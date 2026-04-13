import Supplier from "../models/Supplier.js";

export const createSupplier=async (req,res)=>{
    try{
    const {name,phone}=req.body;
    const supplier =await Supplier.create({
        name,phone
    });
    res.status(201).json(supplier);
    }catch(error){
        es.status(500).json({ message: error.message });
    }
};
