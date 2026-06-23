const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');

// GET /api/summary/:userId
exports.getSummary = async (req, res) => {
    const { userId } = req.params;

    try {
        const stats = await Transaction.aggregate([
            { $match: { user_id: userId } },
            {
                $group: {
                    _id: "$user_id",
                    totalTransactions: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    averageAmount: { $avg: "$amount" },
                    highestTransaction: { $max: "$amount" },
                    lowestTransaction: { $min: "$amount" }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.status(200).json({
                userId,
                totalTransactions: 0,
                totalAmount: 0,
                averageAmount: 0,
                highestTransaction: 0,
                lowestTransaction: 0
            });
        }

        const data = stats[0];
        res.status(200).json({
            userId: data._id,
            totalTransactions: data.totalTransactions,
            totalAmount: data.totalAmount,
            averageAmount: Math.round(data.averageAmount * 100) / 100,
            highestTransaction: data.highestTransaction,
            lowestTransaction: data.lowestTransaction
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET /api/ranking
exports.getRanking = async (req, res) => {
    try {
        const ranking = await Transaction.aggregate([
            // Group by user and day first to find unique days
            {
                $group: {
                    _id: {
                        user_id: "$user_id",
                        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                    },
                    dailyAmount: { $sum: "$amount" },
                    dailyCount: { $sum: 1 }
                }
            },
            // Group by user to calculate total amount, transaction count, and unique days count
            {
                $group: {
                    _id: "$_id.user_id",
                    totalAmount: { $sum: "$dailyAmount" },
                    transactionCount: { $sum: "$dailyCount" },
                    uniqueDaysCount: { $sum: 1 }
                }
            },
            // Lookup email from users collection
            {
                $lookup: {
                    from: "users",
                    let: { user_str_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$user_str_id" }]
                                }
                            }
                        },
                        { $project: { email: 1 } }
                    ],
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Calculate score using formula: (totalAmount * 0.7) + (transactionCount * 20) + consistencyBonus
            // consistencyBonus: 50 points per day if transactions span multiple different days (uniqueDaysCount > 1)
            {
                $project: {
                    userId: "$_id",
                    userEmail: "$userDetails.email",
                    totalAmount: 1,
                    transactionCount: 1,
                    uniqueDaysCount: 1,
                    score: {
                        $add: [
                            { $multiply: ["$totalAmount", 0.7] },
                            { $multiply: ["$transactionCount", 20] },
                            {
                                $cond: [
                                    { $gt: ["$uniqueDaysCount", 1] },
                                    { $multiply: ["$uniqueDaysCount", 50] },
                                    0
                                ]
                            }
                        ]
                    }
                }
            },
            // Sort by score descending
            { $sort: { score: -1 } }
        ]);

        // Map to format response and assign ranks
        const rankedResults = ranking.map((item, index) => ({
            rank: index + 1,
            userId: item.userId,
            userEmail: item.userEmail || item.userId,
            score: Math.round(item.score * 100) / 100,
            totalAmount: item.totalAmount,
            transactionCount: item.transactionCount
        }));

        res.status(200).json(rankedResults);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
