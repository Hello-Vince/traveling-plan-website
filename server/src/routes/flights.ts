import { Router, Request, Response } from 'express';
import Flight from '../models/Flight';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err: any) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message || 'Failed to create flight' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json(flight);
  } catch (err: any) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message || 'Failed to update flight' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete flight' });
  }
});

export default router;
