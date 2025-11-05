
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  timestamp: Date;
  icon: string;
}

export interface ForecastData {
  date: string;
  dayName: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  description: string;
  precipitationChance: number;
  icon: string;
}

export interface SearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
