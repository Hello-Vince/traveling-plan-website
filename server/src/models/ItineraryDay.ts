import mongoose, { Schema, Document } from 'mongoose';

export interface IItineraryDay extends Document {
  dayNumber: number;
  date: string;
  title: { en: string; zhHK: string };
  weather: {
    icon: string;
    temp: string;
    description: { en: string; zhHK: string };
  };
  locations: Array<{
    time: string;
    name: { en: string; zhHK: string };
    category: string;
    emoji: string;
    notes: { en: string; zhHK: string };
  }>;
}

const ItineraryDaySchema = new Schema<IItineraryDay>({
  dayNumber: { type: Number, required: true, unique: true },
  date: { type: String, default: '' },
  title: {
    en: { type: String, default: '' },
    zhHK: { type: String, default: '' },
  },
  weather: {
    icon: { type: String, default: '☀️' },
    temp: { type: String, default: '' },
    description: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
  },
  locations: [{
    time: { type: String, default: '' },
    name: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
    category: { type: String, default: 'landmark' },
    emoji: { type: String, default: '📍' },
    notes: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
  }],
});

export default mongoose.model<IItineraryDay>('ItineraryDay', ItineraryDaySchema);
