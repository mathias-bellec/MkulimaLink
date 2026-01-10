import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

function Transactions() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(user?.role === 'farmer' ? 'sales' : 'purchases');

  const { data: transactions, isLoading } = useQuery(
    ['transactions', activeTab],
    async () => {
      const endpoint = activeTab === 'sales' ? '/transactions/my/sales' : '/transactions/my/purchases';
      const response = await api.get(endpoint);
      return response.data;
    }
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <Package className="text-blue-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'cancelled':
      case 'disputed':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Transactions</h1>

      <div className="flex gap-4 mb-6">
        {user?.role === 'farmer' && (
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'sales'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Sales
          </button>
        )}
        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'purchases'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          My Purchases
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-1/2 mb-2"></div>
              <div className="skeleton h-4 w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {transactions?.map((transaction) => (
            <div key={transaction._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(transaction.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transaction.product?.name || 'Product'}
                    </h3>
                    <span className={`badge ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700">Quantity</p>
                      <p>{transaction.quantity} {transaction.product?.unit}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {activeTab === 'sales' ? 'Buyer' : 'Seller'}
                      </p>
                      <p>
                        {activeTab === 'sales' 
                          ? transaction.buyer?.name 
                          : transaction.seller?.name}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Date</p>
                      <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {transaction.deliveryDetails && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="font-medium text-gray-700 mb-1">Delivery Details</p>
                      <p className="text-gray-600">{transaction.deliveryDetails.address}</p>
                      <p className="text-gray-600">{transaction.deliveryDetails.phone}</p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">
                    {activeTab === 'sales' ? 'You Receive' : 'Total Amount'}
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    TZS {(activeTab === 'sales' 
                      ? transaction.sellerAmount 
                      : transaction.totalAmount
                    ).toLocaleString()}
                  </p>
                  {activeTab === 'sales' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Commission: TZS {transaction.commission.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {transaction.timeline && transaction.timeline.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                  <div className="space-y-2">
                    {transaction.timeline.slice(-3).map((event, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="font-medium">{event.status}</span>
                        <span>-</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!transactions || transactions.length === 0) && (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No transactions yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Transactions;
