import Sale from "../models/Sales.js";
import Product from "../models/Product.js";

export const createSale=async(req,res)=>{
    try{
    const {productId,quantity}=req.body;
    const product=await Product.findById(productId);
    if(!product){
        return res.status(201).json({message:"product not found"});
    }
    if(product.stock<quantity){
        return res.status(201).json({message:"Insufficient stock"});
    }
    const totalAmount = product.sellingPrice * quantity;
    const profit=(product.sellingPrice - product.costPrice) * quantity;
    const sale = await Sale.create({
      user: req.user.id,
      product: product._id,
      quantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      totalAmount,
      profit
    });
    product.stock -= quantity;
    await product.save();

    res.status(201).json(sale);

    }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user.id })
      .populate("product")
      .sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};