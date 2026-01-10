import React from 'react';
import { Bell, BellOff, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

function PriceAlertCard({ alert, onDelete }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const newStatus = alert.status === 'active' ? 'paused' : 'active';
      await api.put(`/alerts/price-alert/${alert._id}`, { status: newStatus });
      return newStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['price-alerts']);
      toast.success('Alert updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/alerts/price-alert/${alert._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['price-alerts']);
      toast.success('Alert deleted');
      onDelete?.();
    }
  });

  const getConditionText = () => {
    switch (alert.condition.type) {
      case 'below':
        return `Below ${alert.condition.value.toLocaleString()} TZS`;
      case 'above':
        return `Above ${alert.condition.value.toLocaleString()} TZS`;
      case 'change':
        return `${alert.condition.percentage}% change`;
      default:
        return '';
    }
  };

  return (
    <div className={`card border-l-4 ${
      alert.status === 'active' ? 'border-l-green-500' : 
      alert.status === 'triggered' ? 'border-l-yellow-500' : 'border-l-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{alert.product}</h4>
          <p className="text-sm text-gray-600">{alert.region || 'All Regions'}</p>
          
          <div className="mt-2 flex items-center gap-2">
            {alert.condition.type === 'below' ? (
              <TrendingDown className="text-red-500" size={16} />
            ) : (
              <TrendingUp className="text-green-500" size={16} />
            )}
            <span className="text-sm font-medium">{getConditionText()}</span>
          </div>

          {alert.currentPrice && (
            <p className="text-sm text-gray-500 mt-1">
              Current: {alert.currentPrice.toLocaleString()} TZS
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {alert.notifications.sms && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">SMS</span>
            )}
            {alert.notifications.push && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Push</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
            className={`p-2 rounded-lg ${
              alert.status === 'active' 
                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {alert.status === 'active' ? <Bell size={18} /> : <BellOff size={18} />}
          </button>
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {alert.status === 'triggered' && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚡ Alert triggered! Price reached your target.
          </p>
        </div>
      )}
    </div>
  );
}

export default PriceAlertCard;
