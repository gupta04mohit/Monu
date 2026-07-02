import { Router } from 'express';
import { saveTrip, getTrips, getTripById } from '../controllers/tripController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .post(protect, saveTrip)
  .get(protect, getTrips);

router.route('/:id')
  .get(protect, getTripById);

export default router;
