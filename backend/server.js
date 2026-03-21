import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";

import supplierRoutes from "./routes/supplierRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/suppliers", supplierRoutes);
app.use("/api/products",productRoutes);
app.use("/api/sales", saleRoutes);

app.use("/api/auth",authRoutes);

app.use('/api/analytics',analyticsRoutes);

app.get("/",(req,res)=>{
    res.send("Api running..")
})
const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`server running on port:${PORT}`)
})