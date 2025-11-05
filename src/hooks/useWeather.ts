import { useState, useEffect, useCallback } from 'react';
import { WeatherData, ForecastData } from '../types/weather';
import { weatherAPI } from '../services/weatherAPI';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  forecastData: ForecastData[];
  loading: boolean;
  error: string | null;
  searchCity: (city: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('London');

  const fetchWeatherData = useCallback(async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [weather, forecast] = await Promise.all([
        weatherAPI.getCurrentWeather(city),
        weatherAPI.getFiveDayForecast(city)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setCurrentCity(city);
      
      // Cache the data in localStorage
      const cacheData = {
        weather,
        forecast,
        timestamp: Date.now(),
        city
      };
      localStorage.setItem('weatherCache', JSON.stringify(cacheData));
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (city: string) => {
    if (city.trim()) {
      await fetchWeatherData(city);
    }
  }, [fetchWeatherData]);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coords = await weatherAPI.getCurrentLocation();
      const [weather, forecast] = await Promise.all([
        weatherAPI.getWeatherByCoords(coords.lat, coords.lon),
        weatherAPI.getForecastByCoords(coords.lat, coords.lon)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setCurrentCity(weather.city);
      
      // Cache the data
      const cacheData = {
        weather,
        forecast,
        timestamp: Date.now(),
        city: weather.city
      };
      localStorage.setItem('weatherCache', JSON.stringify(cacheData));
      
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Unable to get your current location. Please search for a city manually.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (currentCity) {
      await fetchWeatherData(currentCity);
    }
  }, [currentCity, fetchWeatherData]);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      const cached = localStorage.getItem('weatherCache');
      if (cached) {
        try {
          const data = JSON.parse(cached);
          const cacheAge = Date.now() - data.timestamp;
          const cacheValid = cacheAge < 15 * 60 * 1000; // 15 minutes
          
          if (cacheValid) {
            setWeatherData(data.weather);
            setForecastData(data.forecast);
            setCurrentCity(data.city);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error loading cached data:', err);
        }
      }
      
      // If no valid cache, load default city
      fetchWeatherData('London');
    };

    loadCachedData();
  }, [fetchWeatherData]);

  // Auto-refresh data every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCity && !loading) {
        refreshData();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [currentCity, loading, refreshData]);

  return {
    weatherData,
    forecastData,
    loading,
    error,
    searchCity,
    getCurrentLocation,
    refreshData
  };
}; 