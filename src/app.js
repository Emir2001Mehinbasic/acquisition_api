import express from 'express';
import logger from './config/logger.js';

const app = express();

app.get('/', (req, res) => {
    logger:
  res.status(200).send('Aaaaaa');
});

export default app;
