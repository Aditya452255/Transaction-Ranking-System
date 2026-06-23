const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');

// Get all transactions sorted by amount descending (ranking)
exports.getTransactions = async (req, res) => {
    const user_id = req.user._id;
    try {
        const transactions = await Transaction.find({ user_id }).sort({ amount: -1, createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a single transaction
exports.getTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid transaction ID' });
        }
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Create a new transaction with abuse prevention mechanisms
exports.createTransaction = async (req, res) => {
    const { transactionId, amount } = req.body;
    let emptyFields = [];

    if (!transactionId) {
        emptyFields.push('transactionId');
    }
    if (amount === undefined || amount === null || amount === '') {
        emptyFields.push('amount');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }

    /* 
      ABUSE PREVENTION & LEADERBOARD MANIPULATION MITIGATION:
      1. Maximum Transaction Limit (100,000):
         Since the ranking score places 70% weight on total amount logged, a user could instantly 
         top the leaderboard by posting a single artificially massive transaction. Setting a cap of 
         100,000 forces scores to remain bounded and prevents outliers from gaming the system.
         
      2. Daily Transaction Rate Limit (20 transactions/day):
         Since each transaction adds a flat 20 points to the user's score, a malicious script 
         could spam hundreds of tiny $1 transactions to quickly rack up thousands of leaderboard points.
         Limiting transactions to 20 per calendar day prevents automated spam from gaming the count-based score.
    */

    // Reject transactions that exceed the maximum limit
    if (Number(amount) > 100000) {
        return res.status(400).json({ error: "Transaction amount exceeds allowed limit" });
    }

    try {
        const user_id = req.user._id;

        // Count how many transactions this user has already created today (UTC)
        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        const todayTransactionsCount = await Transaction.countDocuments({
            user_id,
            createdAt: { $gte: startOfToday }
        });

        // Enforce the daily transaction rate limit
        if (todayTransactionsCount >= 20) {
            return res.status(429).json({ error: "Daily transaction limit exceeded" });
        }

        // Duplicate prevention check
        const existing = await Transaction.findOne({ transactionId });
        if (existing) {
            return res.status(409).json({ error: 'Duplicate transaction' });
        }

        const transaction = await Transaction.create({ transactionId, amount, user_id });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid transaction ID' });
        }
        const transaction = await Transaction.findOneAndDelete({ _id: id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Update a transaction
exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid transaction ID' });
        }
        
        // If updating transactionId, verify it's not a duplicate
        if (updates.transactionId) {
            const existing = await Transaction.findOne({ transactionId: updates.transactionId, _id: { $ne: id } });
            if (existing) {
                return res.status(409).json({ error: 'Duplicate transaction ID' });
            }
        }

        const transaction = await Transaction.findOneAndUpdate({ _id: id }, updates, { new: true, runValidators: true });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
