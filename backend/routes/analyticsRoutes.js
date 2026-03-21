import express from 'express';
import { getMonthlySales, getSummary } from '../controllers/analyticsController.js';
import { protect } from"../middleware/authMiddleware.js";

const router=express.Router();

router.get("/summary", protect, getSummary);
router.get("/monthly-sales", protect, getMonthlySales);

export default router;   