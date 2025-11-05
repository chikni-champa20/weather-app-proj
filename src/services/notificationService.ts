import { WeatherData, ForecastData } from '../types/weather';

export interface Notification {
  id: string;
  type: 'temperature' | 'precipitation' | 'wind' | 'comfort';
  severity: 'info' | 'warning' | 'alert';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  dismissed: boolean;
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  windUnit: 'kmh' | 'mph';
  timeFormat: '12' | '24';
  notifications: {
    temperature: boolean;
    precipitation: boolean;
    wind: boolean;
    comfort: boolean;
  };
  notificationTiming: 'morning' | 'evening' | 'both';
}

// AI Logic Triggers as specified
const TEMP_THRESHOLDS = {
  EXTREME_HEAT: 35, // °C
  HEAT_WARNING: 30,
  COLD_WARNING: 5,
  EXTREME_COLD: -5
};

const PRECIPITATION_THRESHOLDS = {
  LIGHT_RAIN: 0.1, // mm/hour
  MODERATE_RAIN: 2.5,
  HEAVY_RAIN: 10
};

const WIND_THRESHOLDS = {
  BREEZY: 15, // mph
  WINDY: 25,
  VERY_WINDY: 40
};

class NotificationService {
  private notifications: Notification[] = [];
  private userPreferences: UserPreferences = {
    temperatureUnit: 'celsius',
    windUnit: 'kmh',
    timeFormat: '12',
    notifications: {
      temperature: true,
      precipitation: true,
      wind: true,
      comfort: true
    },
    notificationTiming: 'both'
  };

  // Load user preferences from localStorage
  loadPreferences(): UserPreferences {
    const saved = localStorage.getItem('weatherAppPreferences');
    if (saved) {
      this.userPreferences = { ...this.userPreferences, ...JSON.parse(saved) };
    }
    return this.userPreferences;
  }

  // Save user preferences to localStorage
  savePreferences(preferences: Partial<UserPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    localStorage.setItem('weatherAppPreferences', JSON.stringify(this.userPreferences));
  }

  // Analyze weather data and generate AI-powered notifications
  analyzeWeatherData(currentWeather: WeatherData, forecast: ForecastData[]): Notification[] {
    const notifications: Notification[] = [];
    
    // Temperature Analysis
    if (this.userPreferences.notifications.temperature) {
      const tempNotifications = this.analyzeTemperature(currentWeather, forecast);
      notifications.push(...tempNotifications);
    }

    // Precipitation Analysis
    if (this.userPreferences.notifications.precipitation) {
      const precipNotifications = this.analyzePrecipitation(currentWeather, forecast);
      notifications.push(...precipNotifications);
    }

    // Wind Analysis
    if (this.userPreferences.notifications.wind) {
      const windNotifications = this.analyzeWind(currentWeather, forecast);
      notifications.push(...windNotifications);
    }

    // Comfort Analysis
    if (this.userPreferences.notifications.comfort) {
      const comfortNotifications = this.analyzeComfort(currentWeather, forecast);
      notifications.push(...comfortNotifications);
    }

    return notifications;
  }

  private analyzeTemperature(currentWeather: WeatherData, forecast: ForecastData[]): Notification[] {
    const notifications: Notification[] = [];
    const temp = currentWeather.temperature;

    // Extreme heat warning
    if (temp >= TEMP_THRESHOLDS.EXTREME_HEAT) {
      notifications.push({
        id: `temp-extreme-heat-${Date.now()}`,
        type: 'temperature',
        severity: 'alert',
        title: 'Extreme Heat Warning',
        message: `Temperature is ${temp}°C. Stay hydrated, avoid outdoor activities during peak hours, and check on vulnerable individuals.`,
        icon: 'thermometer-sun',
        timestamp: new Date(),
        dismissed: false
      });
    }
    // Heat warning
    else if (temp >= TEMP_THRESHOLDS.HEAT_WARNING) {
      notifications.push({
        id: `temp-heat-${Date.now()}`,
        type: 'temperature',
        severity: 'warning',
        title: 'Heat Advisory',
        message: `High temperature of ${temp}°C. Consider lighter clothing and stay hydrated.`,
        icon: 'thermometer',
        timestamp: new Date(),
        dismissed: false
      });
    }
    // Cold warning
    else if (temp <= TEMP_THRESHOLDS.COLD_WARNING) {
      notifications.push({
        id: `temp-cold-${Date.now()}`,
        type: 'temperature',
        severity: 'warning',
        title: 'Cold Weather Alert',
        message: `Low temperature of ${temp}°C. Bundle up and consider indoor activities.`,
        icon: 'thermometer-snowflake',
        timestamp: new Date(),
        dismissed: false
      });
    }

    // Temperature change analysis
    if (forecast.length > 0) {
      const tomorrowTemp = forecast[0].highTemp;
      const tempChange = tomorrowTemp - temp;
      
      if (Math.abs(tempChange) >= 10) {
        notifications.push({
          id: `temp-change-${Date.now()}`,
          type: 'temperature',
          severity: 'info',
          title: 'Significant Temperature Change',
          message: `Temperature will ${tempChange > 0 ? 'rise' : 'drop'} by ${Math.abs(tempChange)}°C tomorrow. Plan your activities accordingly.`,
          icon: 'trending-up',
          timestamp: new Date(),
          dismissed: false
        });
      }
    }

    return notifications;
  }

  private analyzePrecipitation(currentWeather: WeatherData, forecast: ForecastData[]): Notification[] {
    const notifications: Notification[] = [];

    // Check current weather for rain
    if (currentWeather.condition.toLowerCase().includes('rain')) {
      notifications.push({
        id: `precip-current-${Date.now()}`,
        type: 'precipitation',
        severity: 'info',
        title: 'Rain Alert',
        message: 'It\'s currently raining. Don\'t forget your umbrella!',
        icon: 'umbrella',
        timestamp: new Date(),
        dismissed: false
      });
    }

    // Check forecast for precipitation
    forecast.forEach((day, index) => {
      if (day.precipitationChance > 70) {
        notifications.push({
          id: `precip-forecast-${index}-${Date.now()}`,
          type: 'precipitation',
          severity: 'warning',
          title: 'High Precipitation Chance',
          message: `${day.precipitationChance}% chance of rain ${index === 0 ? 'tomorrow' : `on ${day.dayName}`}. Plan outdoor activities accordingly.`,
          icon: 'cloud-rain',
          timestamp: new Date(),
          dismissed: false
        });
      }
    });

    return notifications;
  }

  private analyzeWind(currentWeather: WeatherData, forecast: ForecastData[]): Notification[] {
    const notifications: Notification[] = [];
    
    // Convert wind speed to mph for analysis
    const windSpeedMph = this.userPreferences.windUnit === 'kmh' 
      ? currentWeather.windSpeed * 0.621371 
      : currentWeather.windSpeed;

    if (windSpeedMph >= WIND_THRESHOLDS.VERY_WINDY) {
      notifications.push({
        id: `wind-very-${Date.now()}`,
        type: 'wind',
        severity: 'alert',
        title: 'High Wind Warning',
        message: `Wind speed is ${Math.round(windSpeedMph)} mph. Avoid outdoor activities and secure loose objects.`,
        icon: 'wind',
        timestamp: new Date(),
        dismissed: false
      });
    } else if (windSpeedMph >= WIND_THRESHOLDS.WINDY) {
      notifications.push({
        id: `wind-windy-${Date.now()}`,
        type: 'wind',
        severity: 'warning',
        title: 'Windy Conditions',
        message: `Windy conditions with ${Math.round(windSpeedMph)} mph winds. Consider indoor activities.`,
        icon: 'wind',
        timestamp: new Date(),
        dismissed: false
      });
    }

    return notifications;
  }

  private analyzeComfort(currentWeather: WeatherData, forecast: ForecastData[]): Notification[] {
    const notifications: Notification[] = [];

    // Humidity comfort analysis
    if (currentWeather.humidity > 80) {
      notifications.push({
        id: `comfort-humidity-${Date.now()}`,
        type: 'comfort',
        severity: 'info',
        title: 'High Humidity',
        message: `Humidity is ${currentWeather.humidity}%. It may feel warmer than the actual temperature.`,
        icon: 'droplets',
        timestamp: new Date(),
        dismissed: false
      });
    }

    // Visibility analysis
    if (currentWeather.visibility < 5) {
      notifications.push({
        id: `comfort-visibility-${Date.now()}`,
        type: 'comfort',
        severity: 'warning',
        title: 'Reduced Visibility',
        message: `Visibility is reduced to ${currentWeather.visibility} km. Drive carefully and use caution outdoors.`,
        icon: 'eye-off',
        timestamp: new Date(),
        dismissed: false
      });
    }

    // Seasonal clothing recommendations
    const temp = currentWeather.temperature;
    if (temp < 10) {
      notifications.push({
        id: `comfort-clothing-cold-${Date.now()}`,
        type: 'comfort',
        severity: 'info',
        title: 'Clothing Recommendation',
        message: 'Wear warm clothing including a jacket, hat, and gloves.',
        icon: 'shirt',
        timestamp: new Date(),
        dismissed: false
      });
    } else if (temp > 25) {
      notifications.push({
        id: `comfort-clothing-hot-${Date.now()}`,
        type: 'comfort',
        severity: 'info',
        title: 'Clothing Recommendation',
        message: 'Light, breathable clothing recommended. Don\'t forget sunscreen!',
        icon: 'shirt',
        timestamp: new Date(),
        dismissed: false
      });
    }

    return notifications;
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications.filter(n => !n.dismissed);
  }

  // Dismiss a notification
  dismissNotification(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.dismissed = true;
    }
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications.forEach(n => n.dismissed = true);
  }

  // Add a custom notification
  addCustomNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    this.notifications.push({
      ...notification,
      id: `custom-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    });
  }
}

export const notificationService = new NotificationService(); 