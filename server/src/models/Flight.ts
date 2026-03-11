import mongoose, { Schema, Document } from 'mongoose';

export interface IFlight extends Document {
  airline: string;
  flightNo: string;
  departure: {
    code: string;
    city: { en: string; zhHK: string };
    time: string;
    date: string;
  };
  arrival: {
    code: string;
    city: { en: string; zhHK: string };
    time: string;
    date: string;
  };
  gate: string;
  seat: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived';
}

const FlightSchema = new Schema<IFlight>({
  airline: { type: String, default: '' },
  flightNo: { type: String, default: '' },
  departure: {
    code: { type: String, default: '' },
    city: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
    time: { type: String, default: '' },
    date: { type: String, default: '' },
  },
  arrival: {
    code: { type: String, default: '' },
    city: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
    time: { type: String, default: '' },
    date: { type: String, default: '' },
  },
  gate: { type: String, default: '' },
  seat: { type: String, default: '' },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'arrived'],
    default: 'scheduled',
  },
});

export default mongoose.model<IFlight>('Flight', FlightSchema);
