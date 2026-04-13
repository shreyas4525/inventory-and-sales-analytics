import express from 'express';
import { getMonthlySales, getSummary,getYearlySales,getWeeklySales,getTopProducts,getProfitByCategory} from '../controllers/analyticsController.js';
import { protect } from"../middleware/authMiddleware.js";

const router=express.Router();

router.get("/summary", protect, getSummary);
router.get("/monthly-sales", protect, getMonthlySales);
router.get("/yearly-sales", protect, getYearlySales);
router.get("/weekly-sales", protect, getWeeklySales);
router.get("/top-products", protect, getTopProducts);
router.get("/profit-category", protect, getProfitByCategory);


export default router;   