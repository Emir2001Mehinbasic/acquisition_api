import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';
import { time } from 'drizzle-orm/mysql-core';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);
app.use(cookieParser());

app.get('/', (req, res) => {
  logger.info('Hello From acqusition');
  res.status(200).send('Aaaaaa');
});

app.get('/health', (req, res) => {
  logger.info('Health Check');
  res.status(200).json({ status: 'OK' , timestamp: new Date().toISOString() , uptime: process.uptime() });
});


app.use('/api/auth', authRoutes);

export default app;
