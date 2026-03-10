export interface BilingualText {
  en: string;
  zhHK: string;
}

export interface Sticker {
  _id: string;
  stickerId: number;
  emoji: string;
  name: BilingualText;
  category: string;
  selected: boolean;
}

export interface ShoppingTag {
  label: BilingualText;
  color: string;
}

export interface ShoppingItem {
  _id: string;
  name: BilingualText;
  image: string;
  tags: ShoppingTag[];
  checked: boolean;
  quantity: number;
}

export interface FlightEndpoint {
  code: string;
  city: BilingualText;
  time: string;
  date: string;
}

export interface Flight {
  _id: string;
  airline: string;
  flightNo: string;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  gate: string;
  seat: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived';
}

export interface ItineraryLocation {
  time: string;
  name: BilingualText;
  category: string;
  emoji: string;
  notes: BilingualText;
}

export interface ItineraryDay {
  _id: string;
  dayNumber: number;
  date: string;
  title: BilingualText;
  weather: {
    icon: string;
    temp: string;
    description: BilingualText;
  };
  locations: ItineraryLocation[];
}

export interface Expense {
  _id: string;
  description: BilingualText;
  amount: number;
  category: 'food' | 'transport' | 'accommodation' | 'shopping' | 'other';
  date: string;
}

export type AccentColor = 'pink' | 'sage' | 'lavender' | 'sky';
export type FontSize = 'small' | 'medium' | 'large';
export type FallingEffect = 'none' | 'snowflakes' | 'cherry' | 'stars';
export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  language: 'en' | 'zhHK';
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  fallingEffect: FallingEffect;
}
