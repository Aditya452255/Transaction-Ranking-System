import React, { useEffect, useState } from 'react'
import TransactionDetails from '../components/TransactionDetails';
import TransactionForm from '../components/TransactionForm';
import { useTransactionContext } from '../hooks/useTransactionContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { getApiUrl } from '../utils/apiConfig';

const Home = () => {
    const { transactions, dispatch } = useTransactionContext();
    const { user } = useAuthContext();
    
    const [summary, setSummary] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [activeTab, setActiveTab] = useState('transactions');

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch(`${getApiUrl()}/api/transactions`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            
            if (response.ok) {
                dispatch({ type: 'SET_TRANSACTIONS', payload: json });
            }
        }

        if (user) {
            fetchTransactions();
        }
    }, [dispatch, user]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user) return;
            try {
                // Fetch user summary
                const summaryRes = await fetch(`${getApiUrl()}/api/summary/${user._id || ''}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const summaryJson = await summaryRes.json();
                if (summaryRes.ok) {
                    setSummary(summaryJson);
                }

                // Fetch global rankings
                const rankingRes = await fetch(`${getApiUrl()}/api/ranking`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const rankingJson = await rankingRes.json();
                if (rankingRes.ok) {
                    setRanking(rankingJson);
                }
            } catch (err) {
                console.error("Error fetching analytics data:", err);
            }
        }

        if (user && user._id) {
            fetchAnalytics();
        }
    }, [transactions, user]);

    return (
        <div className='home'>
            <div className="left-panel">
                {/* Stats Dashboard Grid */}
                {summary && (
                    <div className="stats-grid">
                        <div className="stats-card">
                            <h5>Total Transactions</h5>
                            <p>{summary.totalTransactions}</p>
                        </div>
                        <div className="stats-card">
                            <h5>Total Value</h5>
                            <p>${summary.totalAmount}</p>
                        </div>
                        <div className="stats-card">
                            <h5>Average Value</h5>
                            <p>${summary.averageAmount}</p>
                        </div>
                        <div className="stats-card">
                            <h5>Highest Trans</h5>
                            <p>${summary.highestTransaction}</p>
                        </div>
                        <div className="stats-card">
                            <h5>Lowest Trans</h5>
                            <p>${summary.lowestTransaction}</p>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <button 
                        className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('transactions')}
                    >
                        My Transactions
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        Rankings & Leaderboard
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'transactions' ? (
                    <div className="transactions">  
                        {transactions && transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <TransactionDetails 
                                    key={transaction._id} 
                                    transaction={transaction} 
                                    rank={index + 1} 
                                />
                            ))
                        ) : (
                            <p className="no-transactions-message">No transactions logged yet. Add one on the right!</p>
                        )}
                    </div> 
                ) : (
                    <div className="leaderboard">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>User</th>
                                    <th>Score</th>
                                    <th>Total Value</th>
                                    <th>Trans Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking && ranking.map((rankItem) => (
                                    <tr 
                                        key={rankItem.userId}
                                        className={rankItem.userId === user._id ? 'highlight-current-user' : ''}
                                    >
                                        <td>
                                            <span className={`rank-badge ${
                                                rankItem.rank === 1 ? 'rank-1' :
                                                rankItem.rank === 2 ? 'rank-2' :
                                                rankItem.rank === 3 ? 'rank-3' : 'rank-other'
                                            }`}>
                                                {rankItem.rank}
                                            </span>
                                        </td>
                                        <td>
                                            {rankItem.userId === user._id ? (
                                                <span>{rankItem.userEmail} (You)</span>
                                            ) : (
                                                <span>{rankItem.userEmail}</span>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{rankItem.score} pts</td>
                                        <td>${rankItem.totalAmount}</td>
                                        <td>{rankItem.transactionCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div> 
            <TransactionForm />
        </div>
    )
}

export default Home;