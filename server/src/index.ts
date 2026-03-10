import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import stickerRoutes from './routes/stickers';
import shoppingRoutes from './routes/shopping';
import flightRoutes from './routes/flights';
import itineraryRoutes from './routes/itinerary';
import expenseRoutes from './routes/expenses';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/japan-trip';
const PORT = parseInt(process.env.PORT || '3001');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/stickers', stickerRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
