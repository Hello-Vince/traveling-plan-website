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
  date: { type: String, required: true },
  title: {
    en: { type: String, required: true },
    zhHK: { type: String, required: true },
  },
  weather: {
    icon: { type: String, required: true },
    temp: { type: String, required: true },
    description: {
      en: { type: String, required: true },
      zhHK: { type: String, required: true },
    },
  },
  locations: [{
    time: { type: String, required: true },
    name: {
      en: { type: String, required: true },
      zhHK: { type: String, required: true },
    },
    category: { type: String, required: true },
    emoji: { type: String, required: true },
    notes: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
  }],
});

export default mongoose.model<IItineraryDay>('ItineraryDay', ItineraryDaySchema);
