import React from 'react'
import { useTransactionContext } from '../hooks/useTransactionContext'
import { useAuthContext } from '../hooks/useAuthContext';
import { getApiUrl } from '../utils/apiConfig';

const TransactionDetails = ({ transaction, rank }) => {
  const { dispatch } = useTransactionContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`${getApiUrl()}/api/transactions/${transaction._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: json });
    }
  }

  return (
    <div className='transaction-details'>
        <h4>Rank #{rank}</h4>
        <p><strong>Transaction ID: </strong>{transaction.transactionId}</p>
        <p><strong>Amount: </strong>{transaction.amount}</p>
        <p><strong>Created At: </strong>{new Date(transaction.createdAt).toLocaleString()}</p>
        <span onClick={handleClick}>delete</span>
    </div>
  )
}

export default TransactionDetails;
