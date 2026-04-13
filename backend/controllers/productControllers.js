import Product from "../models/Product.js";

//create product
export const createProduct=async(req,res)=>{
try{
 const { name, category, costPrice, sellingPrice, stock } = req.body;

    if (!name || !category || !costPrice || !sellingPrice || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      category,
      costPrice,
      sellingPrice,
      stock,
      user: req.user.id
    });
 res.status(201).json(product)
}catch(error){
    res.status(500).json({message:error.message})
}
};
//Get All Product
export const getProducts=async(req,res)=>{
    try{
    const product=await Product.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(product);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

//get single product
export const getProductById=async(req,res)=>{
try{
    const product=await Product.findOne({
  _id: req.params.id,
  user: req.user.id
})
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update product
export const updateProduct = async (req,res)=>{
 try{

   const product = await Product.findOneAndUpdate(
     { _id: req.params.id, user: req.user.id },
     req.body,
     { new:true }
   );

   if(!product){
     return res.status(404).json({message:"Product not found"});
   }

   res.status(200).json(product);

 }catch(error){
   res.status(500).json({message:error.message});
 }
};

//delete product
export const deleteProduct = async (req,res)=>{
 try{

   const product = await Product.findOneAndDelete({
     _id: req.params.id,
     user: req.user.id
   });

   if(!product){
     return res.status(404).json({message:"Product not found"});
   }

   res.status(200).json({message:"Product deleted successfully"});

 }catch(error){
   res.status(500).json({message:error.message});
 }
};

