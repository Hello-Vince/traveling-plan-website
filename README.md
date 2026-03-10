# Japan Trip Planner 🗾✈️

A Kawaii-style travel planning web app with English and Cantonese language support. Built with React, Express, MongoDB, and Docker.

![Japan Trip Planner](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Node](https://img.shields.io/badge/Node-20-green)

## Features

- 🏷️ **Sticker Selection** - Cute sticker grid with Japanese themes
- 🛍️ **Shopping List** - Track trip items with tags
- ✈️ **Flight Boarding Passes** - Manage flight reservations
- 📅 **Daily Itinerary** - Plan your Osaka adventures
- 🌸 **Settings** - Theme colors, dark mode, falling effects
- 🌐 **Bilingual** - English and Cantonese (粵語) support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: MongoDB
- **i18n**: react-i18next
- **Docker**: Docker Compose

## Prerequisites

- Node.js 18+
- Docker & Docker Compose

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and navigate to project
cd japan-trip-app

# Start all services (MongoDB + Server + Client)
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

Access the app:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Option 2: Local Development

#### Backend

```bash
cd server

# Install dependencies
npm install

# Start MongoDB (separate terminal or Docker)
docker run -d -p 27017:27017 --name mongodb mongo:7

# Run development server
npm run dev
```

#### Frontend

```bash
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```

## Project Structure

```
japan-trip-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── i18n/          # Translations
│   │   └── styles/        # CSS styles
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Entry point
│   └── ...
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Language Switching

Click the language toggle in the navbar to switch between:
- 🇬🇧 English
- 🇭🇰 粵語 (Cantonese)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stickers` | Get all stickers |
| PUT | `/api/stickers/:id` | Update sticker |
| GET | `/api/shopping` | Get shopping list |
| POST | `/api/shopping` | Add item |
| PUT | `/api/shopping/:id` | Update item |
| DELETE | `/api/shopping/:id` | Delete item |
| GET | `/api/flights` | Get flights |
| GET | `/api/itinerary` | Get itinerary |
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update settings |

## Environment Variables

### Server (.env)
```
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/japan-trip
```

### Client
The client uses Vite's proxy to forward `/api` requests to the backend.

## Building for Production

```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build
```

## License

MIT
