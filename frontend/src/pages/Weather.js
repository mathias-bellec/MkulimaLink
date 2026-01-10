import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

function Weather() {
  const [selectedRegion, setSelectedRegion] = useState('Dar es Salaam');

  const { data: weatherData, isLoading } = useQuery(
    ['weather', selectedRegion],
    async () => {
      const response = await api.get(`/weather/current/${selectedRegion}`);
      return response.data;
    },
    { enabled: !!selectedRegion }
  );

  const { data: alerts } = useQuery(
    ['weather-alerts', selectedRegion],
    async () => {
      const response = await api.get(`/weather/alerts/${selectedRegion}`);
      return response.data;
    },
    { enabled: !!selectedRegion }
  );

  const { data: regions } = useQuery('weather-regions', async () => {
    const response = await api.get('/weather/regions');
    return response.data;
  });

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={48} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={48} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="text-gray-500" size={48} />;
      default:
        return <Cloud className="text-gray-500" size={48} />;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Forecast</h1>
      <p className="text-gray-600 mb-8">Get accurate weather information for your farming region</p>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Region</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="input-field max-w-md"
        >
          {regions?.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      {alerts && alerts.alerts && alerts.alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {alerts.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                alert.severity === 'moderate' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={
                  alert.severity === 'high' ? 'text-red-600' :
                  alert.severity === 'moderate' ? 'text-yellow-600' :
                  'text-blue-600'
                } size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                  </h3>
                  <p className="text-gray-700 mb-2">{alert.message}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Recommendation:</strong> {alert.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="card">
          <div className="skeleton h-32 mb-4"></div>
          <div className="skeleton h-6 w-1/2"></div>
        </div>
      ) : weatherData ? (
        <>
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {getWeatherIcon(weatherData.condition)}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRegion}</h2>
                <p className="text-5xl font-bold text-gray-900 mb-2">
                  {Math.round(weatherData.temperature)}°C
                </p>
                <p className="text-xl text-gray-600">{weatherData.condition}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Droplets className="text-blue-500 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {Math.round(weatherData.humidity)}%
                  </p>
                </div>
                <div className="text-center">
                  <Wind className="text-gray-500 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {Math.round(weatherData.windSpeed)} km/h
                  </p>
                </div>
                <div className="text-center col-span-2">
                  <CloudRain className="text-blue-500 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-600">Rainfall</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {Math.round(weatherData.rainfall)} mm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7-Day Forecast</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    {getWeatherIcon(day.condition)}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {Math.round(day.temperature)}°C
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{day.condition}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {Math.round(day.rainfall)}mm
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No weather data available</p>
        </div>
      )}

      <div className="mt-8 card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Farming Tips Based on Weather</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Rainy Season</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure proper drainage in fields</li>
              <li>• Monitor for fungal diseases</li>
              <li>• Reduce irrigation frequency</li>
              <li>• Protect harvested crops from moisture</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Dry Season</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Increase irrigation frequency</li>
              <li>• Apply mulch to retain moisture</li>
              <li>• Monitor crops for drought stress</li>
              <li>• Consider drought-resistant varieties</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
