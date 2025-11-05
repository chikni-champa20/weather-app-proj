import { WeatherData, ForecastData } from '../types/weather';

// Unit conversion utilities
export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9/5) + 32);
};

export const convertFahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round((fahrenheit - 32) * 5/9);
};

export const convertKmhToMph = (kmh: number): number => {
  return Math.round(kmh * 0.621371);
};

export const convertMphToKmh = (mph: number): number => {
  return Math.round(mph * 1.60934);
};

// Temperature formatting
export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  return `${temp}°${unit === 'celsius' ? 'C' : 'F'}`;
};

// Wind speed formatting
export const formatWindSpeed = (speed: number, unit: 'kmh' | 'mph'): string => {
  return `${speed} ${unit.toUpperCase()}`;
};

// Time formatting
export const formatTime = (date: Date, format: '12' | '24' = '12'): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: format === '12'
  });
};

// Date formatting
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

// Weather condition mapping
export const getWeatherCondition = (condition: string): string => {
  const conditionMap: { [key: string]: string } = {
    'Clear': 'Clear Sky',
    'Clouds': 'Cloudy',
    'Rain': 'Rainy',
    'Drizzle': 'Light Rain',
    'Snow': 'Snowy',
    'Thunderstorm': 'Thunderstorm',
    'Mist': 'Misty',
    'Fog': 'Foggy'
  };
  
  return conditionMap[condition] || condition;
};

// Weather gradient mapping
export const getWeatherGradient = (condition: string): string => {
  const gradients: { [key: string]: string } = {
    'Clear': 'bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-400',
    'Clouds': 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
    'Rain': 'bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600',
    'Drizzle': 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
    'Snow': 'bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200',
    'Thunderstorm': 'bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800',
    'Mist': 'bg-gradient-to-br from-gray-200 via-gray-300 to-blue-200',
    'Fog': 'bg-gradient-to-br from-gray-200 via-gray-300 to-blue-200'
  };
  
  return gradients[condition] || gradients['Clear'];
};

// Cache utilities
export const cacheWeatherData = (data: { weather: WeatherData; forecast: ForecastData[]; city: string }) => {
  const cacheData = {
    ...data,
    timestamp: Date.now()
  };
  localStorage.setItem('weatherCache', JSON.stringify(cacheData));
};

export const getCachedWeatherData = () => {
  const cached = localStorage.getItem('weatherCache');
  if (cached) {
    try {
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - data.timestamp;
      const cacheValid = cacheAge < 15 * 60 * 1000; // 15 minutes
      
      if (cacheValid) {
        return data;
      }
    } catch (err) {
      console.error('Error loading cached data:', err);
    }
  }
  return null;
};

// Recent searches utilities
export const addRecentSearch = (city: string) => {
  const recent = getRecentSearches();
  const updated = [city, ...recent.filter(c => c !== city)].slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(updated));
};

export const getRecentSearches = (): string[] => {
  try {
    const recent = localStorage.getItem('recentSearches');
    return recent ? JSON.parse(recent) : [];
  } catch (err) {
    console.error('Error loading recent searches:', err);
    return [];
  }
}; 