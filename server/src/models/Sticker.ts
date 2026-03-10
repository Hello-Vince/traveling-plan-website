import mongoose, { Schema, Document } from 'mongoose';

export interface ISticker extends Document {
  stickerId: number;
  emoji: string;
  name: { en: string; zhHK: string };
  category: string;
  selected: boolean;
}

const StickerSchema = new Schema<ISticker>({
  stickerId: { type: Number, required: true, unique: true },
  emoji: { type: String, required: true },
  name: {
    en: { type: String, required: true },
    zhHK: { type: String, required: true },
  },
  category: { type: String, required: true },
  selected: { type: Boolean, default: false },
});

export default mongoose.model<ISticker>('Sticker', StickerSchema);
