import express from 'express';
import { addAbsence, getAbsences, getStats } from '../controllers/absence.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getAbsences).post(protect, addAbsence);
router.get('/stats', protect, getStats);

export default router;
