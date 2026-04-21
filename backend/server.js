import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from "./config/db.js";

import supplierRoutes from "./routes/supplierRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js";

import uploadRoutes from "./routes/uploadRoutes.js";

connectDB();

const app=express();

app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products",productRoutes);
app.use("/api/sales", saleRoutes);

app.use("/api/auth",authRoutes);

app.use('/api/analytics',analyticsRoutes);

app.use("/api/upload", uploadRoutes);

app.get("/",(req,res)=>{
    res.send("Api running..")
})
const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`server running on port:${PORT}`)
})