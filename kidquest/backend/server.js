import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import gamesRouter from './routes/games.js';
import locationRouter from './routes/location.js';

const app = express();

app.use(cors({ origin: config.frontendOrigin }));
app.use(express.json());
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.use('/api/games', gamesRouter);
app.use('/api/location', locationRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`KidQuest backend running on port ${config.port}`);
});
