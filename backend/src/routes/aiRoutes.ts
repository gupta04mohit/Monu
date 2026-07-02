import express from 'express';
import { chatWithVeda } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Route is unprotected for now to allow easy testing from frontend without auth context setup
// In production, add `protect` middleware
router.post('/chat', chatWithVeda);

export default router;
