import { Router } from 'express';
import { resolveLocation } from '../services/locationService.js';

const router = Router();

router.post('/resolve', async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 100 } = req.body;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'invalid_input', message: 'latitude and longitude are required numbers.' });
    }
    const result = await resolveLocation(latitude, longitude, radius);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
