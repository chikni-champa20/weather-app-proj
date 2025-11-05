import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Eye,
  EyeOff,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  icon?: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  icon, 
  size = 24, 
  className = "" 
}) => {
  const getWeatherIcon = () => {
    const conditionLower = condition.toLowerCase();
    
    // Map OpenWeatherMap icon codes to Lucide icons
    if (icon) {
      const iconMap: { [key: string]: React.ReactNode } = {
        // Clear sky
        '01d': <Sun className={`w-${size} h-${size} text-yellow-500`} />,
        '01n': <Sun className={`w-${size} h-${size} text-yellow-400`} />,
        
        // Few clouds
        '02d': <Cloud className={`w-${size} h-${size} text-gray-400`} />,
        '02n': <Cloud className={`w-${size} h-${size} text-gray-500`} />,
        
        // Scattered clouds
        '03d': <Cloud className={`w-${size} h-${size} text-gray-500`} />,
        '03n': <Cloud className={`w-${size} h-${size} text-gray-600`} />,
        
        // Broken clouds
        '04d': <Cloud className={`w-${size} h-${size} text-gray-600`} />,
        '04n': <Cloud className={`w-${size} h-${size} text-gray-700`} />,
        
        // Shower rain
        '09d': <CloudRain className={`w-${size} h-${size} text-blue-500`} />,
        '09n': <CloudRain className={`w-${size} h-${size} text-blue-600`} />,
        
        // Rain
        '10d': <CloudRain className={`w-${size} h-${size} text-blue-600`} />,
        '10n': <CloudRain className={`w-${size} h-${size} text-blue-700`} />,
        
        // Thunderstorm
        '11d': <CloudLightning className={`w-${size} h-${size} text-purple-600`} />,
        '11n': <CloudLightning className={`w-${size} h-${size} text-purple-700`} />,
        
        // Snow
        '13d': <CloudSnow className={`w-${size} h-${size} text-blue-300`} />,
        '13n': <CloudSnow className={`w-${size} h-${size} text-blue-400`} />,
        
        // Mist/Fog
        '50d': <EyeOff className={`w-${size} h-${size} text-gray-400`} />,
        '50n': <EyeOff className={`w-${size} h-${size} text-gray-500`} />
      };
      
      return iconMap[icon] || getFallbackIcon();
    }
    
    return getFallbackIcon();
  };

  const getFallbackIcon = () => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      return <Sun className={`w-${size} h-${size} text-yellow-500 ${className}`} />;
    }
    
    if (conditionLower.includes('cloud')) {
      return <Cloud className={`w-${size} h-${size} text-gray-500 ${className}`} />;
    }
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className={`w-${size} h-${size} text-blue-500 ${className}`} />;
    }
    
    if (conditionLower.includes('snow')) {
      return <CloudSnow className={`w-${size} h-${size} text-blue-300 ${className}`} />;
    }
    
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <CloudLightning className={`w-${size} h-${size} text-purple-600 ${className}`} />;
    }
    
    if (conditionLower.includes('wind') || conditionLower.includes('breeze')) {
      return <Wind className={`w-${size} h-${size} text-gray-400 ${className}`} />;
    }
    
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return <EyeOff className={`w-${size} h-${size} text-gray-400 ${className}`} />;
    }
    
    // Default fallback
    return <Thermometer className={`w-${size} h-${size} text-gray-500 ${className}`} />;
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {getWeatherIcon()}
    </div>
  );
};

export default WeatherIcon; 