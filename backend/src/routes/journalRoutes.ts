import express from 'express';
import { saveJournalEntry } from '../controllers/journalController';

const router = express.Router();

router.post('/', saveJournalEntry);

export default router;
