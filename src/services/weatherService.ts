
import { WeatherData, ForecastData } from '../types/weather';

// Mock weather service - in a real app, you'd use OpenWeatherMap API
class WeatherService {
  private mockWeatherData = {
    'London': {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 18, feels_like: 20, humidity: 65 },
      weather: [{ main: 'Clouds', description: 'Partly cloudy', icon: '02d' }],
      wind: { speed: 3.5 },
      visibility: 10000,
      dt: Date.now() / 1000
    },
    'New York': {
      name: 'New York',
      sys: { country: 'US' },
      main: { temp: 22, feels_like: 25, humidity: 58 },
      weather: [{ main: 'Clear', description: 'Clear sky', icon: '01d' }],
      wind: { speed: 4.2 },
      visibility: 10000,
      dt: Date.now() / 1000
    },
    'Tokyo': {
      name: 'Tokyo',
      sys: { country: 'JP' },
      main: { temp: 24, feels_like: 27, humidity: 72 },
      weather: [{ main: 'Rain', description: 'Light rain', icon: '10d' }],
      wind: { speed: 2.8 },
      visibility: 8000,
      dt: Date.now() / 1000
    }
  };

  private mockForecastData = [
    { day: 'Today', high: 20, low: 15, condition: 'Clouds', icon: '02d', precipitation: 10 },
    { day: 'Tomorrow', high: 22, low: 16, condition: 'Clear', icon: '01d', precipitation: 0 },
    { day: 'Sat', high: 19, low: 13, condition: 'Rain', icon: '10d', precipitation: 80 },
    { day: 'Sun', high: 21, low: 14, condition: 'Clouds', icon: '03d', precipitation: 20 },
    { day: 'Mon', high: 23, low: 17, condition: 'Clear', icon: '01d', precipitation: 5 }
  ];

  async getCurrentWeather(city: string): Promise<WeatherData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = this.mockWeatherData[city as keyof typeof this.mockWeatherData] || this.mockWeatherData['London'];
    
    return {
      city: mockData.name,
      country: mockData.sys.country,
      temperature: Math.round(mockData.main.temp),
      feelsLike: Math.round(mockData.main.feels_like),
      condition: mockData.weather[0].main,
      description: mockData.weather[0].description,
      humidity: mockData.main.humidity,
      windSpeed: Math.round(mockData.wind.speed * 3.6), // Convert m/s to km/h
      visibility: mockData.visibility / 1000, // Convert m to km
      timestamp: new Date(mockData.dt * 1000),
      icon: mockData.weather[0].icon
    };
  }

  async getFiveDayForecast(city: string): Promise<ForecastData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.mockForecastData.map((day, index) => ({
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayName: day.day,
      highTemp: day.high,
      lowTemp: day.low,
      condition: day.condition,
      description: day.condition.toLowerCase(),
      precipitationChance: day.precipitation,
      icon: day.icon
    }));
  }
}

export const weatherService = new WeatherService();
