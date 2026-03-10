import mongoose, { Schema, Document } from 'mongoose';

export interface IShoppingItem extends Document {
  name: { en: string; zhHK: string };
  image: string;
  tags: Array<{
    label: { en: string; zhHK: string };
    color: string;
  }>;
  checked: boolean;
  quantity: number;
}

const ShoppingItemSchema = new Schema<IShoppingItem>({
  name: {
    en: { type: String, required: true },
    zhHK: { type: String, required: true },
  },
  image: { type: String, required: true },
  tags: [{
    label: {
      en: { type: String, required: true },
      zhHK: { type: String, required: true },
    },
    color: { type: String, required: true },
  }],
  checked: { type: Boolean, default: false },
  quantity: { type: Number, default: 1 },
});

export default mongoose.model<IShoppingItem>('ShoppingItem', ShoppingItemSchema);
