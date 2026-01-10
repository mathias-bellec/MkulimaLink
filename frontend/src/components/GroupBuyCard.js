import React from 'react';
import { Users, Clock, TrendingDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

function GroupBuyCard({ groupBuy }) {
  const progress = (groupBuy.quantity.current / groupBuy.quantity.minimum) * 100;
  const timeLeft = formatDistanceToNow(new Date(groupBuy.timeline.endDate), { addSuffix: true });
  const isEnding = new Date(groupBuy.timeline.endDate) - new Date() < 24 * 60 * 60 * 1000;

  return (
    <Link to={`/group-buy/${groupBuy._id}`} className="card hover:shadow-lg transition-shadow block">
      <div className="flex gap-4">
        {groupBuy.product.image ? (
          <img
            src={groupBuy.product.image}
            alt={groupBuy.product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <Users className="text-gray-400" size={32} />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{groupBuy.title}</h3>
              <p className="text-sm text-gray-600">{groupBuy.product.name}</p>
            </div>
            <span className={`badge ${
              groupBuy.status === 'minimum_reached' ? 'badge-success' : 'badge-info'
            }`}>
              {groupBuy.status === 'minimum_reached' ? 'Goal Reached!' : 'Open'}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <TrendingDown size={16} />
              <span className="font-medium">
                {groupBuy.pricing.savingsPercentage?.toFixed(0)}% off
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} />
              <span>{groupBuy.location?.region || 'Tanzania'}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">
                <Users className="inline mr-1" size={14} />
                {groupBuy.participants?.length || 0} joined
              </span>
              <span className="font-medium text-primary-600">
                {groupBuy.quantity.current} / {groupBuy.quantity.minimum} {groupBuy.quantity.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  progress >= 100 ? 'bg-green-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className={`mt-2 flex items-center gap-1 text-sm ${
            isEnding ? 'text-red-600' : 'text-gray-500'
          }`}>
            <Clock size={14} />
            <span>Ends {timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div>
          <span className="text-gray-500 text-sm line-through">
            {groupBuy.pricing.originalPrice?.toLocaleString()} TZS
          </span>
          <span className="ml-2 text-xl font-bold text-primary-600">
            {groupBuy.pricing.groupPrice.toLocaleString()} TZS
          </span>
          <span className="text-sm text-gray-500">/{groupBuy.product.unit}</span>
        </div>
        <button className="btn-primary py-2 px-4">
          Join Group
        </button>
      </div>
    </Link>
  );
}

export default GroupBuyCard;
