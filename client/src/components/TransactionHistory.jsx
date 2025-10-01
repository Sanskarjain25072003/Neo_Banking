import { useState, useEffect } from 'react';
import api from '../utils/api';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/banking/transactions?page=${pageNum}&limit=10`);
      const data = response.data;
      
      if (pageNum === 1) {
        setTransactions(data.transactions);
      } else {
        setTransactions(prev => [...prev, ...data.transactions]);
      }
      
      setHasMore(data.pagination.current < data.pagination.pages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return '📈';
      case 'transfer':
        return '💸';
      case 'withdrawal':
        return '📉';
      default:
        return '💰';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'transfer':
        return 'text-blue-600';
      case 'withdrawal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Transaction History
        </h3>
        
        {loading && transactions.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                      {transaction.fromUser && transaction.type === 'transfer' && (
                        <p className="text-xs text-gray-400">
                          From: {transaction.fromUser.name}
                        </p>
                      )}
                      {transaction.toUser && transaction.type === 'transfer' && (
                        <p className="text-xs text-gray-400">
                          To: {transaction.toUser.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Balance: ${transaction.balanceAfter.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
