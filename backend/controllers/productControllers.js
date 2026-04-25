import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

//create product
export const createProduct = async (req, res) => {
  try {
    const { name, category, costPrice, sellingPrice, stock } = req.body;
    console.log(req.body);

   const parsedCost = Number(costPrice);
const parsedSelling = Number(sellingPrice);
const parsedStock = Number(stock);

if (
  !name?.trim() ||
  !category?.trim() ||
  isNaN(parsedCost) ||
  isNaN(parsedSelling) ||
  isNaN(parsedStock)
) {
  return res.status(400).json({ message: "Invalid input" });
}
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "products",
    });
    const barcode = Date.now().toString();

    const product = await Product.create({
      name,
      category,
      costPrice,
      sellingPrice,
      stock,
      image: result.secure_url,   // ⭐ save image URL
      barcode,
      // 🔥 safe user handling
      user: req.user?.id || null,
    });

    res.status(201).json(product);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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
export const updateProduct = async (req, res) => {
  try {
    const { name, category, costPrice, sellingPrice, stock } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 If new image uploaded
    if (req.file) {
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(fileStr, {
        folder: "products",
      });

      product.image = result.secure_url;
    }
    
    // ✅ update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (costPrice) product.costPrice = Number(costPrice);
    if (sellingPrice) product.sellingPrice = Number(sellingPrice);
    if (stock) product.stock = Number(stock);

    await product.save();

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 delete image from Cloudinary
    if (product.image) {
      const publicId = product.image
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.code,
      user: req.user.id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

