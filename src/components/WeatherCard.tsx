
import React from 'react';
import { MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="backdrop-blur-lg rounded-3xl p-8 mb-6 shadow-2xl border border-white/10">
      {/* Location and Time */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-white" />
          <span className="text-white text-lg font-medium">
            {weatherData.city}, {weatherData.country}
          </span>
        </div>
        <div className="text-white/80 text-sm">
          {formatTime(weatherData.timestamp)}
        </div>
      </div>

      {/* Main Temperature Display */}
      <div className="text-center mb-8">
        <div className="text-8xl font-bold text-white mb-2">
          {weatherData.temperature}°
        </div>
        <p className="text-white/90 text-xl capitalize mb-2">
          {weatherData.description}
        </p>
        <p className="text-white/70 text-sm">
          {formatDate(weatherData.timestamp)}
        </p>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <Thermometer className="w-6 h-6 text-white mx-auto mb-2" />
          <p className="text-white/70 text-sm">Feels like</p>
          <p className="text-white text-lg font-semibold">{weatherData.feelsLike}°</p>
        </div>
        
        <div className="backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <Droplets className="w-6 h-6 text-white mx-auto mb-2" />
          <p className="text-white/70 text-sm">Humidity</p>
          <p className="text-white text-lg font-semibold">{weatherData.humidity}%</p>
        </div>
        
        <div className="backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <Wind className="w-6 h-6 text-white mx-auto mb-2" />
          <p className="text-white/70 text-sm">Wind</p>
          <p className="text-white text-lg font-semibold">{weatherData.windSpeed} km/h</p>
        </div>
        
        <div className="backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <Eye className="w-6 h-6 text-white mx-auto mb-2" />
          <p className="text-white/70 text-sm">Visibility</p>
          <p className="text-white text-lg font-semibold">{weatherData.visibility} km</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
