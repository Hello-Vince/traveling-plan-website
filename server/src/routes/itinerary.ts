import { Router, Request, Response } from 'express';
import ItineraryDay from '../models/ItineraryDay';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const days = await ItineraryDay.find().sort({ dayNumber: 1 });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

router.get('/:day', async (req: Request, res: Response) => {
  try {
    const day = await ItineraryDay.findOne({ dayNumber: parseInt(req.params.day) });
    if (!day) return res.status(404).json({ error: 'Day not found' });
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch day' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const day = new ItineraryDay(req.body);
    await day.save();
    res.status(201).json(day);
  } catch (err: any) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message || 'Failed to create day' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const day = await ItineraryDay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!day) return res.status(404).json({ error: 'Day not found' });
    res.json(day);
  } catch (err: any) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message || 'Failed to update day' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const day = await ItineraryDay.findByIdAndDelete(req.params.id);
    if (!day) return res.status(404).json({ error: 'Day not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete day' });
  }
});

export default router;
