const express = require('express');
const router = express.Router();
const { getSummary, getRanking } = require('../controllers/analyticsController');
const requireAuth = require('../middleware/requireAuth');

// Require auth for all analytics routes
router.use(requireAuth);

/**
 * Route:  /api/summary/:userId
 * Method: GET
 * Description: Get transaction summary statistics for a user
 * Access: Private
 */
router.get('/summary/:userId', getSummary);

/**
 * Route:  /api/ranking
 * Method: GET
 * Description: Get global user leaderboard rankings
 * Access: Private
 */
router.get('/ranking', getRanking);

module.exports = router;
