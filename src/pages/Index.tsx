import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Bell, Settings } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import SearchBar from '../components/SearchBar';
import NotificationPanel from '../components/NotificationPanel';
import SettingsModal from '../components/SettingsModal';
import { weatherService } from '../services/weatherService';
import { notificationService } from '../services/notificationService';
import { WeatherData, ForecastData } from '../types/weather';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchWeatherData = async (city: string = 'London') => {
    try {
      setLoading(true);
      setError(null);
      
      const [weather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(city),
        weatherService.getFiveDayForecast(city)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);

      // Generate notifications based on weather data
      const notifications = notificationService.analyzeWeatherData(weather, forecast);
      setNotificationCount(notifications.length);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearch = (city: string) => {
    if (city.trim()) {
      setSearchCity(city);
      fetchWeatherData(city);
    }
  };

  const getWeatherGradient = (condition: string) => {
    const gradients = {
      'Clear': 'bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-400',
      'Clouds': 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
      'Rain': 'bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600',
      'Drizzle': 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
      'Snow': 'bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200',
      'Thunderstorm': 'bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800',
      'Mist': 'bg-gradient-to-br from-gray-200 via-gray-300 to-blue-200',
      'Fog': 'bg-gradient-to-br from-gray-200 via-gray-300 to-blue-200'
    };
    
    return gradients[condition as keyof typeof gradients] || gradients['Clear'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
          <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${weatherData ? getWeatherGradient(weatherData.condition) : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header with Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-4">
            {/* Notifications Button */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-3 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-white/30 transition-all"
            >
              <Bell className="w-6 h-6 text-white" />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-3 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-white/30 transition-all"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        
        {error && (
          <div className="backdrop-blur-lg rounded-2xl p-4 mb-6 text-center border border-red-300/30">
            <p className="text-white font-medium">{error}</p>
          </div>
        )}

        {weatherData && (
          <>
            {/* Main Weather Card */}
            <WeatherCard weatherData={weatherData} />
            
            {/* 5-Day Forecast */}
            <div className="mt-8">
              <h2 className="text-white text-xl font-semibold mb-4 px-2">
                5-Day Forecast
              </h2>
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {forecastData.map((day, index) => (
                  <ForecastCard key={index} forecastData={day} />
                ))}
              </div>
            </div>

            {/* AI Weather Insights */}
            {notificationCount > 0 && (
              <div className="mt-8">
                <div className="backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Bell className="w-6 h-6 text-white" />
                    <h2 className="text-white text-xl font-semibold">AI Weather Insights</h2>
                  </div>
                  <p className="text-white/90 mb-4">
                    We've detected {notificationCount} important weather condition{notificationCount > 1 ? 's' : ''} that might affect your day.
                  </p>
                  <button
                    onClick={() => setNotificationsOpen(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        weatherData={weatherData}
        forecastData={forecastData}
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
