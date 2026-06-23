import React, { useState } from 'react'
import { useTransactionContext } from '../hooks/useTransactionContext'
import { useAuthContext } from '../hooks/useAuthContext';
import { getApiUrl } from '../utils/apiConfig';

const TransactionForm = () => {
    const { dispatch } = useTransactionContext();
    const { user } = useAuthContext();
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        const transaction = { transactionId, amount: amount ? Number(amount) : '' };

        const response = await fetch(`${getApiUrl()}/api/transactions`, {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields || []);
        } else {
            setError(null);
            setTransactionId('');
            setAmount('');
            setEmptyFields([]);
            console.log("New transaction added", json);
            dispatch({ type: 'CREATE_TRANSACTION', payload: json });
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Transaction</h3>
            
            <label>Transaction ID:</label>
            <input 
                type="text" 
                onChange={(e) => setTransactionId(e.target.value)}
                value={transactionId}
                className={emptyFields.includes('transactionId') ? 'error' : ''}
            />

            <label>Amount:</label>
            <input 
                type="number" 
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                className={emptyFields.includes('amount') ? 'error' : ''}
            />

            <button>Add Transaction</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default TransactionForm;
