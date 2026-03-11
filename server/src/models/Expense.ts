import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  description: { en: string; zhHK: string };
  amount: number;
  category: 'food' | 'transport' | 'accommodation' | 'shopping' | 'other';
  date: string;
}

const ExpenseSchema = new Schema<IExpense>({
  description: {
    en: { type: String, default: '' },
    zhHK: { type: String, default: '' },
  },
  amount: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['food', 'transport', 'accommodation', 'shopping', 'other'],
    default: 'other',
  },
  date: { type: String, default: '' },
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
