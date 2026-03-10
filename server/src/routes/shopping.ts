import { Router, Request, Response } from 'express';
import ShoppingItem from '../models/ShoppingItem';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await ShoppingItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shopping items' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const item = new ShoppingItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const item = await ShoppingItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const item = await ShoppingItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
