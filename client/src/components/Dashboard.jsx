import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AddMoney from './AddMoney';
import SendMoney from './SendMoney';
import TransactionHistory from './TransactionHistory';

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [balance, setBalance] = useState(user?.balance || 0);
  const [loading, setLoading] = useState(false);

  const refreshProfile = async () => {
    try {
      const response = await api.get('/banking/profile');
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      setBalance(updatedUser.balance);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleTransactionComplete = () => {
    refreshProfile();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">NeoBank</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-lg font-medium text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8">
            <div className="text-white">
              <p className="text-blue-100 text-sm font-medium">Account Balance</p>
              <p className="text-4xl font-bold">${balance.toLocaleString()}</p>
              <p className="text-blue-100 text-sm mt-2">Account: {user?.accountNumber}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <AddMoney onTransactionComplete={handleTransactionComplete} />
            <SendMoney onTransactionComplete={handleTransactionComplete} />
          </div>

          {/* Transaction History */}
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
