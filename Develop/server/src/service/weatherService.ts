import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

interface WeatherPayload {
  current: Weather;
  forecast: Weather[];
}

class WeatherService {
  private apiKey = process.env.API_KEY!;
  private baseGeoUrl = 'https://api.openweathermap.org/geo/1.0/direct';
  private baseForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  // 1) Turn city name → { lat, lon }
  private async fetchLocation(query: string): Promise<Coordinates> {
    const url = `${this.baseGeoUrl}?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
    const res = await axios.get(url);
    if (!res.data.length) throw new Error(`City "${query}" not found`);
    const { lat, lon } = res.data[0];
    return { lat, lon };
  }

  // 2) Fetch the 5-day forecast
  private async fetchForecast(coords: Coordinates): Promise<any> {
    const url = `${this.baseForecastUrl}?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${this.apiKey}`;
    return (await axios.get(url)).data;
  }

  // 3) Extract the “current” from the first list item
  private parseCurrent(data: any): Weather {
    const first = data.list[0];
    return {
      city: data.city.name,
      date: new Date(first.dt * 1000).toLocaleDateString(),
      icon: first.weather[0].icon,
      iconDescription: first.weather[0].description,
      tempF: first.main.temp,
      windSpeed: first.wind.speed,
      humidity: first.main.humidity,
    };
  }

  // 4) Take the next 5 days (every 8th entry) and map to our Weather type
  private parseForecast(data: any): Weather[] {
    return data.list
      .filter((_: any, idx: number) => idx % 8 === 0)
      .slice(1, 6)
      .map((entry: any) => ({
        city: data.city.name,
        date: new Date(entry.dt * 1000).toLocaleDateString(),
        icon: entry.weather[0].icon,
        iconDescription: entry.weather[0].description,
        tempF: entry.main.temp,
        windSpeed: entry.wind.speed,
        humidity: entry.main.humidity,
      }));
  }

  // Public API: returns an object matching your front end
  async getWeatherForCity(cityName: string): Promise<WeatherPayload> {
    const coords = await this.fetchLocation(cityName);
    const rawData = await this.fetchForecast(coords);
    const current = this.parseCurrent(rawData);
    const forecast = this.parseForecast(rawData);
    return { current, forecast };
  }
}

export default new WeatherService();
