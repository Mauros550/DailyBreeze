import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import weatherRoutes from './routes/api/weatherRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1) Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) API routes for weather
//    This will handle:
//      POST /api/weather/
//      GET  /api/weather/history
//      DELETE /api/weather/history/:id
app.use('/api/weather', weatherRoutes);

// 3) Serve your built front end
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// 4) Catch-all to send back index.html on non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// 5) Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
