# Japan Trip Planner - Technical Specification

## Overview

A bilingual (English / Cantonese) travel planning web application with a Kawaii Japanese aesthetic. The app helps users plan a trip to Japan with sticker collections, shopping lists, flight information, and daily itineraries.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + TypeScript + Vite      |
| Backend    | Express.js + TypeScript           |
| Database   | MongoDB 7 (Mongoose ODM)          |
| Container  | Docker + Docker Compose           |
| i18n       | react-i18next (EN / zh-HK)        |
| Styling    | CSS Modules + CSS custom props     |

---

## Design System

### Color Palette

| Token              | Light Mode   | Dark Mode    |
|--------------------|-------------|-------------|
| `--bg-primary`     | #FFF8F0     | #2D2A26     |
| `--bg-card`        | #FFFFFF     | #3A3631     |
| `--pink`           | #F4A7BB     | #D4879A     |
| `--sage`           | #B8D4A3     | #8FB07A     |
| `--cream`          | #FFF0DB     | #4A4539     |
| `--lavender`       | #D4B8E0     | #A48BB0     |
| `--sky`            | #A8D8EA     | #7AACBE     |
| `--text-primary`   | #5C4033     | #F0E6D8     |
| `--text-secondary` | #8B7355     | #C4B8A8     |
| `--border`         | #E8DDD0     | #4A4539     |
| `--outline-brown`  | #8B6F47     | #A08060     |

### Typography

- **Headings (CJK):** "Noto Sans TC", "Microsoft JhengHei", sans-serif
- **Body (CJK):** "Noto Sans TC", sans-serif
- **Body (Latin):** "Quicksand", "Nunito", sans-serif
- **Sticker labels:** "M PLUS Rounded 1c", sans-serif

### Component Tokens

- Border radius: 16px (cards), 24px (buttons), 50% (avatars)
- Box shadow: `0 2px 12px rgba(92,64,51,0.08)`
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

---

## Monorepo Structure

```
japan-trip-app/
├── SPEC.md
├── docker-compose.yml
├── client/                    # React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── App.css
│       ├── i18n/
│       │   ├── index.ts
│       │   ├── en.json
│       │   └── zhHK.json
│       ├── contexts/
│       │   └── SettingsContext.tsx
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Navbar.module.css
│       │   │   ├── FallingEffects.tsx
│       │   │   └── FallingEffects.module.css
│       │   ├── StickerGrid/
│       │   │   ├── StickerGrid.tsx
│       │   │   └── StickerGrid.module.css
│       │   ├── ShoppingList/
│       │   │   ├── ShoppingList.tsx
│       │   │   └── ShoppingList.module.css
│       │   ├── BoardingPass/
│       │   │   ├── BoardingPass.tsx
│       │   │   └── BoardingPass.module.css
│       │   ├── Itinerary/
│       │   │   ├── Itinerary.tsx
│       │   │   └── Itinerary.module.css
│       │   └── Settings/
│       │       ├── Settings.tsx
│       │       └── Settings.module.css
│       └── types/
│           └── index.ts
└── server/                    # Express backend
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── models/
        │   ├── Sticker.ts
        │   ├── ShoppingItem.ts
        │   ├── Flight.ts
        │   └── ItineraryDay.ts
        ├── routes/
        │   ├── stickers.ts
        │   ├── shopping.ts
        │   ├── flights.ts
        │   └── itinerary.ts
        └── seed.ts
```

---

## Features

### 1. Sticker Selection Grid

A 4-column responsive grid of kawaii stickers representing Japan travel items.

**Sticker data (seeded):**

| ID  | Emoji | Name (EN)        | Name (zh-HK)    | Category   |
|-----|-------|------------------|------------------|------------|
| 1   | 👘    | Kimono Girl       | 和服少女          | culture    |
| 2   | 🐱    | Lucky Cat         | 招財貓            | culture    |
| 3   | 🍜    | Ramen             | 拉麵              | food       |
| 4   | 🗻    | Mount Fuji        | 富士山            | landmark   |
| 5   | 🚄    | JR Pass           | JR 通票           | transport  |
| 6   | ♨️    | Onsen             | 溫泉              | activity   |
| 7   | 🌸    | Cherry Blossoms   | 櫻花              | nature     |
| 8   | 🏯    | Castle            | 城堡              | landmark   |
| 9   | 🍡    | Dango             | 糰子              | food       |
| 10  | ⛩️    | Torii Gate        | 鳥居              | landmark   |
| 11  | 🎌    | Festival          | 祭典              | culture    |
| 12  | 🍵    | Matcha            | 抹茶              | food       |
| 13  | 🦌    | Nara Deer         | 奈良鹿            | nature     |
| 14  | 🎎    | Hina Dolls        | 雛人形            | culture    |
| 15  | 🍱    | Bento             | 便當              | food       |
| 16  | 🎋    | Tanabata          | 七夕              | culture    |
| 17  | 🏔️    | Snow Mountain     | 雪山              | nature     |
| 18  | 🛒    | Konbini           | 便利店            | shopping   |
| 19  | 🎮    | Arcade            | 遊戲機中心         | activity   |
| 20  | 🧧    | Omamori           | 御守              | culture    |
| 21  | 🍣    | Sushi             | 壽司              | food       |
| 22  | 🚃    | Train             | 電車              | transport  |
| 23  | 🎐    | Wind Chime        | 風鈴              | culture    |
| 24  | 🌊    | Wave              | 海浪              | nature     |

**Interactions:**
- Tap to select/deselect (toggle pink ring highlight)
- Selected stickers persist to database
- Animated bounce on tap

### 2. Settings / Customization

| Setting         | Options                              | Default     |
|-----------------|--------------------------------------|-------------|
| Language        | English / 廣東話                      | English     |
| Theme           | Light / Dark                         | Light       |
| Accent Color    | Pink / Sage / Lavender / Sky         | Pink        |
| Font Size       | Small (14px) / Medium (16px) / Large (18px) | Medium |
| Falling Effect  | None / Snowflakes / Cherry Blossoms / Stars | None  |

Settings are stored in localStorage and React Context.

### 3. Shopping List

Displays items to buy during the trip with images, tags, and status.

**Schema:**
```typescript
interface ShoppingItem {
  _id: string;
  name: { en: string; zhHK: string };
  image: string;            // emoji or URL
  tags: Array<{
    label: { en: string; zhHK: string };
    color: string;           // hex color for oval tag
  }>;
  checked: boolean;
  quantity: number;
}
```

**Seed data includes:** Royce chocolate, Tokyo Banana, matcha KitKat, face masks, Uniqlo items, etc.

### 4. Flight Boarding Passes

Visual boarding pass cards showing flight info.

**Schema:**
```typescript
interface Flight {
  _id: string;
  airline: string;
  flightNo: string;
  departure: {
    code: string;    // HKG
    city: { en: string; zhHK: string };
    time: string;
    date: string;
  };
  arrival: {
    code: string;    // KIX or NRT
    city: { en: string; zhHK: string };
    time: string;
    date: string;
  };
  gate: string;
  seat: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived';
}
```

**Seed flights:**
1. HKG → KIX (Peach Aviation MM68, 2026-04-01)
2. KIX → HKG (Peach Aviation MM67, 2026-04-08)

### 5. Daily Itinerary

Day-by-day plan for the Osaka trip with countdown timer.

**Schema:**
```typescript
interface ItineraryDay {
  _id: string;
  dayNumber: number;
  date: string;
  title: { en: string; zhHK: string };
  weather: { icon: string; temp: string; description: { en: string; zhHK: string } };
  locations: Array<{
    time: string;
    name: { en: string; zhHK: string };
    category: string;   // food | landmark | shopping | transport | hotel
    emoji: string;
    notes: { en: string; zhHK: string };
  }>;
}
```

**Seed: 7-day Osaka itinerary** (Day 1: Arrival + Dotonbori, Day 2: Osaka Castle + Shinsekai, etc.)

---

## API Endpoints

| Method | Path                    | Description               |
|--------|-------------------------|---------------------------|
| GET    | /api/stickers           | Get all stickers           |
| PATCH  | /api/stickers/:id       | Toggle sticker selection   |
| GET    | /api/shopping           | Get shopping list          |
| POST   | /api/shopping           | Add shopping item          |
| PATCH  | /api/shopping/:id       | Update item (check/qty)    |
| DELETE | /api/shopping/:id       | Delete shopping item       |
| GET    | /api/flights            | Get all flights            |
| GET    | /api/itinerary          | Get full itinerary         |
| GET    | /api/itinerary/:day     | Get single day             |

---

## Docker Setup

```yaml
services:
  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo-data:/data/db]
  
  server:
    build: ./server
    ports: ["3001:3001"]
    depends_on: [mongodb]
    environment:
      MONGO_URI: mongodb://mongodb:27017/japan-trip
  
  client:
    build: ./client
    ports: ["5173:5173"]
    depends_on: [server]
```

---

## Responsive Design

- Mobile-first: 375px base
- Tablet: 768px breakpoint
- Desktop: 1024px breakpoint
- Max content width: 480px (mobile app feel)
