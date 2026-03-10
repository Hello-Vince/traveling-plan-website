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
  airline: { type: String, required: true },
  flightNo: { type: String, required: true },
  departure: {
    code: { type: String, required: true },
    city: {
      en: { type: String, required: true },
      zhHK: { type: String, required: true },
    },
    time: { type: String, required: true },
    date: { type: String, required: true },
  },
  arrival: {
    code: { type: String, required: true },
    city: {
      en: { type: String, required: true },
      zhHK: { type: String, required: true },
    },
    time: { type: String, required: true },
    date: { type: String, required: true },
  },
  gate: { type: String, required: true },
  seat: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'arrived'],
    default: 'scheduled',
  },
});

export default mongoose.model<IFlight>('Flight', FlightSchema);
