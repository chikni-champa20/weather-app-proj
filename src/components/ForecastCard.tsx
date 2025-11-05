
import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { ForecastData } from '../types/weather';

interface ForecastCardProps {
  forecastData: ForecastData;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  const getWeatherIcon = (condition: string) => {
    const iconMap = {
      'Clear': <Sun className="w-8 h-8 text-yellow-300" />,
      'Clouds': <Cloud className="w-8 h-8 text-white" />,
      'Rain': <CloudRain className="w-8 h-8 text-blue-300" />,
      'Drizzle': <CloudRain className="w-8 h-8 text-blue-300" />,
      'Snow': <CloudSnow className="w-8 h-8 text-blue-100" />,
      'Thunderstorm': <CloudRain className="w-8 h-8 text-purple-300" />
    };
    
    return iconMap[condition as keyof typeof iconMap] || <Sun className="w-8 h-8 text-yellow-300" />;
  };

  return (
    <div className="backdrop-blur-lg rounded-2xl p-6 min-w-[140px] text-center shadow-lg hover:backdrop-blur-xl transition-all duration-300 border border-white/10">
      <h3 className="text-white font-semibold text-lg mb-4">
        {forecastData.dayName}
      </h3>
      
      <div className="flex justify-center mb-4">
        {getWeatherIcon(forecastData.condition)}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white text-xl font-bold">
            {forecastData.highTemp}°
          </span>
          <span className="text-white/70 text-lg">
            {forecastData.lowTemp}°
          </span>
        </div>
        
        {forecastData.precipitationChance > 0 && (
          <div className="text-blue-200 text-sm">
            {forecastData.precipitationChance}% rain
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastCard;
