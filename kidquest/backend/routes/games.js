import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateGame } from '../services/aiService.js';
import { generateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/generate', generateLimiter, async (req, res, next) => {
  try {
    const { profile, location, sessionId } = req.body;

    if (!profile || typeof profile.age !== 'number') {
      return res.status(400).json({ error: 'invalid_input', message: 'profile.age is required.' });
    }
    if (!location || !location.placeType) {
      return res.status(400).json({ error: 'invalid_input', message: 'location.placeType is required.' });
    }

    const game = await generateGame(profile, location);
    game.id = uuidv4();

    res.json({
      sessionId: sessionId || uuidv4(),
      game,
    });
  } catch (err) {
    if (err.retryable) {
      return res.status(422).json({
        error: err.code || 'game_generation_failed',
        message: err.message,
        retryable: true,
      });
    }
    next(err);
  }
});

export default router;
