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

// TODO: Complete the WeatherService class
class WeatherService {

  private apiKey = process.env.API_KEY;

  // Fetch location data (coordinates) for a city
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );
    return { lat: response.data[0].lat, lon: response.data[0].lon };
  }

  // Fetch weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`
    );
    return response.data;
  }

  // Parse the current weather data
  private parseCurrentWeather(response: any): Weather {
    return {
      city: response.city.name,
      date: new Date(response.list[0].dt * 1000).toLocaleDateString(),
      icon: response.list[0].weather[0].icon,
      iconDescription: response.list[0].weather[0].description,
      tempF: response.list[0].main.temp,
      windSpeed: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity,
    };
  }

  // Build the 5-day forecast array
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((item) => ({
      city: currentWeather.city,
      date: new Date(item.dt * 1000).toLocaleDateString(),
      icon: item.weather[0].icon,
      iconDescription: item.weather[0].description,
      tempF: item.main.temp,
      windSpeed: item.wind.speed,
      humidity: item.main.humidity,
    }));
  }

  // Get weather data for a city
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list.slice(1, 6));
    return [currentWeather, ...forecast];
  }
}


export default new WeatherService();
