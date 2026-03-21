import express from 'express';
import { createSale,getSales } from '../controllers/saleControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.use(protect);

router.post('/',createSale);
router.get('/',getSales);

export default router;