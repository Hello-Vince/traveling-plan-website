import { Router, Request, Response } from 'express';
import Sticker from '../models/Sticker';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const stickers = await Sticker.find().sort({ stickerId: 1 });
    res.json(stickers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stickers' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const sticker = await Sticker.findById(req.params.id);
    if (!sticker) return res.status(404).json({ error: 'Sticker not found' });
    sticker.selected = !sticker.selected;
    await sticker.save();
    res.json(sticker);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update sticker' });
  }
});

export default router;
