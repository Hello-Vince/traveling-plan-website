import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  description: { en: string; zhHK: string };
  amount: number;
  category: 'food' | 'transport' | 'accommodation' | 'shopping' | 'other';
  date: string;
}

const ExpenseSchema = new Schema<IExpense>({
  description: {
    en: { type: String, required: true },
    zhHK: { type: String, required: true },
  },
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['food', 'transport', 'accommodation', 'shopping', 'other'],
    required: true,
  },
  date: { type: String, required: true },
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
