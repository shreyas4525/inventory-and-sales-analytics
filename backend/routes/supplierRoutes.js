import express from 'express';
import { createSupplier } from '../controllers/supplierControllers.js';

const router=express.Router()

router.post('/',createSupplier);

export default router;