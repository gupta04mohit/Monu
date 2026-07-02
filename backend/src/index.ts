import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import enterpriseRoutes from './routes/enterpriseRoutes';
import journalRoutes from './routes/journalRoutes';
import tripRoutes from './routes/tripRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient({});

// Connect to MongoDB for Travel Features
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vedaai_travel';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for Travel features'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'VedaAI Backend is running smoothly.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/trips', tripRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
