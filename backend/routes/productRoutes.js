import express from 'express'
import { createProduct,getProducts,getProductById,updateProduct,deleteProduct } from '../controllers/productControllers.js'
import { protect } from '../middleware/authMiddleware.js';
import upload from "../middleware/multer.js";

const router=express.Router();

//applies authentication to all routes
router.use(protect);

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;