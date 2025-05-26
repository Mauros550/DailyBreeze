# 🌤️ DailyBreeze Weather Dashboard

[Live Demo on Render](https://**your-app-name**.onrender.com)

---

## 🎯 Project Overview

DailyBreeze is a full-stack weather dashboard that lets travelers:
- 🔍 Search any city’s current weather and 5-day forecast  
- 📜 View and revisit past searches  
- 🗑️ Delete unwanted entries (bonus!)

Built with **Express** & **TypeScript** on the back end and **Vite** + **TypeScript** on the front end, and deployed to **Render**.

---

## 🚀 Features

- **Search**  
  - POST `/api/weather` with `{ cityName }`  
  - Geocodes via OpenWeather, fetches 5-day forecast, parses into current + daily cards  
- **History**  
  - GET `/api/weather/history` returns an array of `{ id, name }`  
  - DELETE `/api/weather/history/:id` to remove entries  
- **Responsive UI**  
  - Styled with Bootstrap (cards, buttons)  
  - Mobile-friendly layout  

---

## 📸 Screenshot

![Dashboard Screenshot](./public/screenshot.png)

---

## 📂 Repo Structure

/
├─ client/ ← Vite front end (src → public → dist)
├─ server/ ← Express back end (src → dist)
├─ db/
│ └─ db.json ← stores search history
├─ .gitignore
└─ README.md
## 🛠️ Getting Started

1. **Clone** the repo  
   ```bash
   git clone https://github.com/your-username/**your-repo-name**.git
   cd **your-repo-name**
Install & Build

bash
Copy
Edit
cd client
npm install
npm run build

cd ../server
npm install
npm run build
Run Locally

bash
Copy
Edit
npm start            # from server/, serves client at localhost:3001
Env Vars
Create a .env in server/:

ini
Copy
Edit
API_KEY=your_openweather_key
PORT=3001
📄 Deployment
Build Command:
cd client && npm ci && npm run build && cd ../server && npm ci && npm run build

Start Command:
cd server && npm start

Environment Variables:

API_KEY = Your OpenWeather API key

👤 Author
Your Name • GitHub • Email

