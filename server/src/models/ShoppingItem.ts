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
    en: { type: String, default: '' },
    zhHK: { type: String, default: '' },
  },
  image: { type: String, default: '🛒' },
  tags: [{
    label: {
      en: { type: String, default: '' },
      zhHK: { type: String, default: '' },
    },
    color: { type: String, default: '#FFECD2' },
  }],
  checked: { type: Boolean, default: false },
  quantity: { type: Number, default: 1 },
});

export default mongoose.model<IShoppingItem>('ShoppingItem', ShoppingItemSchema);
