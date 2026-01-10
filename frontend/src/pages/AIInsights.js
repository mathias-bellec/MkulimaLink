import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

function AIInsights() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('yield');
  const [yieldData, setYieldData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [cropRecommendations, setCropRecommendations] = useState(null);

  const yieldPredictionMutation = useMutation(
    async (data) => {
      const response = await api.post('/ai/yield-prediction', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setYieldData(data);
        toast.success('Yield prediction generated!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Prediction failed');
      }
    }
  );

  const pricePredictionMutation = useMutation(
    async (data) => {
      const response = await api.post('/ai/price-prediction', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setPriceData(data);
        toast.success('Price prediction generated!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Prediction failed');
      }
    }
  );

  const cropRecommendationMutation = useMutation(
    async (data) => {
      const response = await api.post('/ai/recommendations/crop', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setCropRecommendations(data);
        toast.success('Recommendations generated!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to get recommendations');
      }
    }
  );

  if (!user?.isPremium) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="card">
          <Sparkles className="mx-auto text-yellow-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Feature</h1>
          <p className="text-xl text-gray-600 mb-6">
            AI Insights is available exclusively for Premium members
          </p>
          <Link to="/premium" className="btn-primary inline-block px-8 py-3 text-lg">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  const handleYieldPrediction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    yieldPredictionMutation.mutate({
      cropType: formData.get('cropType'),
      farmSize: parseFloat(formData.get('farmSize')),
      soilType: formData.get('soilType'),
      region: formData.get('region'),
      plantingDate: formData.get('plantingDate')
    });
  };

  const handlePricePrediction = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    pricePredictionMutation.mutate({
      product: formData.get('product'),
      region: formData.get('region'),
      quantity: parseFloat(formData.get('quantity')),
      targetDate: formData.get('targetDate')
    });
  };

  const handleCropRecommendation = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    cropRecommendationMutation.mutate({
      region: formData.get('region'),
      farmSize: parseFloat(formData.get('farmSize')),
      soilType: formData.get('soilType'),
      budget: parseFloat(formData.get('budget'))
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="text-yellow-500" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600">Advanced AI-powered agriculture analytics</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('yield')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'yield'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Yield Prediction
        </button>
        <button
          onClick={() => setActiveTab('price')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'price'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Price Prediction
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Crop Recommendations
        </button>
      </div>

      {activeTab === 'yield' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Predict Crop Yield</h2>
            <form onSubmit={handleYieldPrediction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                <select name="cropType" className="input-field" required>
                  <option value="">Select crop</option>
                  <option value="Maize">Maize</option>
                  <option value="Rice">Rice</option>
                  <option value="Beans">Beans</option>
                  <option value="Cassava">Cassava</option>
                  <option value="Sweet Potato">Sweet Potato</option>
                  <option value="Sunflower">Sunflower</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (acres)</label>
                <input type="number" name="farmSize" className="input-field" step="0.1" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select name="soilType" className="input-field" required>
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="silt">Silt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select name="region" className="input-field" required>
                  <option value="Dar es Salaam">Dar es Salaam</option>
                  <option value="Arusha">Arusha</option>
                  <option value="Dodoma">Dodoma</option>
                  <option value="Mwanza">Mwanza</option>
                  <option value="Mbeya">Mbeya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Planting Date</label>
                <input type="date" name="plantingDate" className="input-field" required />
              </div>

              <button
                type="submit"
                disabled={yieldPredictionMutation.isLoading}
                className="btn-primary w-full"
              >
                {yieldPredictionMutation.isLoading ? 'Analyzing...' : 'Predict Yield'}
              </button>
            </form>
          </div>

          {yieldData && (
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-primary-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Prediction Results</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Predicted Yield</p>
                  <p className="text-3xl font-bold text-primary-600">{yieldData.predictedYield} tons</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {(yieldData.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estimated Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    TZS {yieldData.estimatedRevenue?.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Key Factors</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Soil Quality:</span>
                      <span className="font-medium">{(yieldData.factors?.soil * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regional Factor:</span>
                      <span className="font-medium">{(yieldData.factors?.region * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weather Impact:</span>
                      <span className="font-medium">{(yieldData.factors?.weather * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Recommendations</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {yieldData.recommendations?.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'price' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Predict Market Price</h2>
            <form onSubmit={handlePricePrediction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <input type="text" name="product" className="input-field" placeholder="e.g., Maize" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select name="region" className="input-field" required>
                  <option value="Dar es Salaam">Dar es Salaam</option>
                  <option value="Arusha">Arusha</option>
                  <option value="Mwanza">Mwanza</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (kg)</label>
                <input type="number" name="quantity" className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Sell Date</label>
                <input type="date" name="targetDate" className="input-field" required />
              </div>

              <button
                type="submit"
                disabled={pricePredictionMutation.isLoading}
                className="btn-primary w-full"
              >
                {pricePredictionMutation.isLoading ? 'Analyzing...' : 'Predict Price'}
              </button>
            </form>
          </div>

          {priceData && (
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-green-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Price Forecast</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    TZS {priceData.currentPrice?.toLocaleString()}/kg
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Predicted Price</p>
                  <p className="text-3xl font-bold text-green-600">
                    TZS {priceData.predictedPrice?.toLocaleString()}/kg
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {(priceData.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estimated Revenue</p>
                  <p className="text-2xl font-bold text-primary-600">
                    TZS {priceData.estimatedRevenue?.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Market Trend</p>
                  <span className={`badge ${
                    priceData.trend === 'rising' ? 'badge-success' : 'badge-danger'
                  }`}>
                    {priceData.trend}
                  </span>
                  <p className="text-sm text-gray-700 mt-2">{priceData.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Crop Recommendations</h2>
            <form onSubmit={handleCropRecommendation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select name="region" className="input-field" required>
                  <option value="Dar es Salaam">Dar es Salaam</option>
                  <option value="Arusha">Arusha</option>
                  <option value="Dodoma">Dodoma</option>
                  <option value="Mwanza">Mwanza</option>
                  <option value="Mbeya">Mbeya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (acres)</label>
                <input type="number" name="farmSize" className="input-field" step="0.1" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select name="soilType" className="input-field" required>
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="silt">Silt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (TZS)</label>
                <input type="number" name="budget" className="input-field" required />
              </div>

              <button
                type="submit"
                disabled={cropRecommendationMutation.isLoading}
                className="btn-primary w-full"
              >
                {cropRecommendationMutation.isLoading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </form>
          </div>

          {cropRecommendations && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-500" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Recommended Crops</h2>
              </div>

              {cropRecommendations.recommendations?.map((rec, index) => (
                <div key={index} className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{rec.crop}</h3>
                    <span className="badge-success">{rec.suitability}% Match</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Expected Yield</p>
                      <p className="font-semibold text-gray-900">{rec.expectedYield} tons</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Est. Revenue</p>
                      <p className="font-semibold text-green-600">
                        TZS {rec.estimatedRevenue?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Growing Period</p>
                      <p className="font-semibold text-gray-900">{rec.growingPeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Water Need</p>
                      <p className="font-semibold text-gray-900">{rec.waterRequirement}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-yellow-200">
                    <p className="text-sm text-gray-600 mb-1">Market Demand</p>
                    <span className={`badge ${
                      rec.marketDemand === 'High' ? 'badge-success' :
                      rec.marketDemand === 'Medium' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {rec.marketDemand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIInsights;
