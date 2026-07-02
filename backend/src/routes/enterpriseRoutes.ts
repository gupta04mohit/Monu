import { Router } from 'express';
import { matchDoctor, bookAppointment, getWearableMetrics } from '../controllers/enterpriseController';

const router = Router();

router.post('/marketplace/match', matchDoctor);
router.post('/marketplace/book', bookAppointment);
router.get('/wearables/:userId', getWearableMetrics);

export default router;
