import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Plus, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import GroupBuyCard from '../components/GroupBuyCard';
import { useAuthStore } from '../store/authStore';

function GroupBuying() {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({ region: '', type: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['group-buys', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.region) params.append('region', filters.region);
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      const response = await api.get(`/groupbuy?${params}`);
      return response.data;
    }
  });

  const filteredGroupBuys = data?.groupBuys?.filter(gb =>
    gb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gb.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Group Buying</h1>
          <p className="text-gray-600">Join forces with other farmers for better prices</p>
        </div>
        {user?.role === 'farmer' && (
          <Link to="/group-buy/create" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Create Group Buy
          </Link>
        )}
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search group buys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            className="input-field md:w-40"
          >
            <option value="">All Regions</option>
            <option value="Dar es Salaam">Dar es Salaam</option>
            <option value="Arusha">Arusha</option>
            <option value="Mwanza">Mwanza</option>
            <option value="Dodoma">Dodoma</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="input-field md:w-40"
          >
            <option value="">All Types</option>
            <option value="buying">Buying</option>
            <option value="selling">Selling</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-green-800 font-medium">Active Group Buys</p>
              <p className="text-3xl font-bold text-green-900">{data?.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-blue-800 font-medium">Your Group Buys</p>
              <Link to="/group-buy/my" className="text-blue-600 hover:underline text-sm">
                View your joined group buys →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card">
              <div className="skeleton h-32 mb-4"></div>
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredGroupBuys?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroupBuys.map(groupBuy => (
            <GroupBuyCard key={groupBuy._id} groupBuy={groupBuy} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Group Buys Found</h3>
          <p className="text-gray-500 mb-4">Be the first to create a group buy in your area!</p>
          {user?.role === 'farmer' && (
            <Link to="/group-buy/create" className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Create Group Buy
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default GroupBuying;
