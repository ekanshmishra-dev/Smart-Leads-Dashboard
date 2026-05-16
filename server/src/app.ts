import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
