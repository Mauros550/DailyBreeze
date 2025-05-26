import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point at your repo’s “server/db/db.json”
const historyFilePath = path.resolve(__dirname, '../../db/db.json');

interface City {
  id: string;
  name: string;
}

class HistoryService {
  // Read the search history (returns [] if file doesn’t exist yet)
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(historyFilePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Write the updated list back to disk
  private async write(cities: City[]): Promise<void> {
    await fs.mkdir(path.dirname(historyFilePath), { recursive: true });
    await fs.writeFile(historyFilePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // Public API
  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity: City = { id: uuidv4(), name: cityName };
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filtered = cities.filter(c => c.id !== id);
    await this.write(filtered);
  }
}

export default new HistoryService();
