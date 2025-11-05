import { WeatherData, ForecastData, SearchResult } from '../types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'your_api_key_here';

class WeatherAPI {
  private async makeRequest<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Search for cities
  async searchCities(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    const url = `${GEO_API_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const data = await this.makeRequest<any[]>(url);
    
    return data.map(city => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    }));
  }

  // Get current weather
  async getCurrentWeather(city: string): Promise<WeatherData> {
    const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest<any>(url);
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: data.visibility / 1000, // Convert m to km
      timestamp: new Date(data.dt * 1000),
      icon: data.weather[0].icon
    };
  }

  // Get 5-day forecast
  async getFiveDayForecast(city: string): Promise<ForecastData[]> {
    const url = `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest<any>(url);
    
    // Group forecast data by day
    const dailyData = new Map<string, any[]>();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, []);
      }
      dailyData.get(date)!.push(item);
    });

    // Process each day's data
    const forecast: ForecastData[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dailyData.forEach((dayItems, date) => {
      if (forecast.length >= 5) return; // Limit to 5 days
      
      // Calculate daily statistics
      const temps = dayItems.map((item: any) => item.main.temp);
      const highTemp = Math.round(Math.max(...temps));
      const lowTemp = Math.round(Math.min(...temps));
      
      // Get most common weather condition for the day
      const conditions = dayItems.map((item: any) => item.weather[0].main);
      const condition = this.getMostFrequent(conditions);
      
      // Calculate precipitation chance
      const precipitationChance = Math.round(
        dayItems.reduce((sum: number, item: any) => sum + (item.pop || 0), 0) / dayItems.length * 100
      );
      
      // Get day name
      const dayDate = new Date(date);
      const dayName = dayNames[dayDate.getDay()];
      
      forecast.push({
        date,
        dayName,
        highTemp,
        lowTemp,
        condition,
        description: condition.toLowerCase(),
        precipitationChance,
        icon: dayItems[0].weather[0].icon
      });
    });

    return forecast;
  }

  // Get weather by coordinates (for geolocation)
  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest<any>(url);
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      visibility: data.visibility / 1000,
      timestamp: new Date(data.dt * 1000),
      icon: data.weather[0].icon
    };
  }

  // Get forecast by coordinates
  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData[]> {
    const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const data = await this.makeRequest<any>(url);
    
    // Same processing logic as getFiveDayForecast
    const dailyData = new Map<string, any[]>();
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, []);
      }
      dailyData.get(date)!.push(item);
    });

    const forecast: ForecastData[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    dailyData.forEach((dayItems, date) => {
      if (forecast.length >= 5) return;
      
      const temps = dayItems.map((item: any) => item.main.temp);
      const highTemp = Math.round(Math.max(...temps));
      const lowTemp = Math.round(Math.min(...temps));
      
      const conditions = dayItems.map((item: any) => item.weather[0].main);
      const condition = this.getMostFrequent(conditions);
      
      const precipitationChance = Math.round(
        dayItems.reduce((sum: number, item: any) => sum + (item.pop || 0), 0) / dayItems.length * 100
      );
      
      const dayDate = new Date(date);
      const dayName = dayNames[dayDate.getDay()];
      
      forecast.push({
        date,
        dayName,
        highTemp,
        lowTemp,
        condition,
        description: condition.toLowerCase(),
        precipitationChance,
        icon: dayItems[0].weather[0].icon
      });
    });

    return forecast;
  }

  // Helper method to get most frequent value in array
  private getMostFrequent(arr: string[]): string {
    const frequency: { [key: string]: number } = {};
    let maxFreq = 0;
    let mostFrequent = arr[0];

    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
        mostFrequent = item;
      }
    });

    return mostFrequent;
  }

  // Get user's current location
  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location.'));
        }
      );
    });
  }
}

export const weatherAPI = new WeatherAPI(); 