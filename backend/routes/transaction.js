const express = require('express');
const router = express.Router();
const { 
    createTransaction, 
    getTransactions, 
    getTransaction, 
    deleteTransaction, 
    updateTransaction 
} = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');

// Require auth for all transaction routes
router.use(requireAuth);

/**
 * Route:  /api/transactions
 * Method: GET
 * Description: Get all transactions
 * Access: Private   
 */
router.get('/', getTransactions);

/**
 * Route:  /api/transactions/:id
 * Method: GET
 * Description: Get a single transaction
 * Access: Private   
 */
router.get('/:id', getTransaction);

/**
 * Route:  /api/transactions
 * Method: POST
 * Description: Create a new transaction
 * Access: Private   
 */
router.post('/', createTransaction);

/**
 * Route:  /api/transactions/:id
 * Method: DELETE
 * Description: Delete a transaction
 * Access: Private   
 */
router.delete('/:id', deleteTransaction);

/**
 * Route:  /api/transactions/:id
 * Method: PATCH
 * Description: Update a transaction
 * Access: Private   
 */
router.patch('/:id', updateTransaction);

module.exports = router;
