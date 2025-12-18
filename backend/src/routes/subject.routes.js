import express from 'express';
import { createSubject, getSubjects } from '../controllers/subject.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Allow anyone to see subjects or protect it? The prompt implies students see subjects.
// Creating subjects usually requires admin, but for simplicity I will just use protect.
router.route('/').get(protect, getSubjects).post(protect, createSubject);

export default router;
