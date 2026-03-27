import Sale from "../models/Sales.js";
import Product from "../models/Product.js";

// CREATE SALE (MULTIPLE PRODUCTS)
export const createSale = async (req, res) => {
  try {
    const items = req.body.items || req.body;
    // items = [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let saleItems = [];
    let totalBill = 0;
    let totalProfit = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }

      const totalAmount = product.sellingPrice * item.quantity;
      const profit =
        (product.sellingPrice - product.costPrice) * item.quantity;

      // push item into array
      saleItems.push({
        product: product._id,
        quantity: item.quantity,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        totalAmount,
        profit
      });

      // update totals
      totalBill += totalAmount;
      totalProfit += profit;

      // reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // create one sale with multiple items
    const sale = await Sale.create({
      user: req.user.id,
      items: saleItems,
      totalBill,
      totalProfit
    });

    res.status(201).json(sale);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SALES (WITH MULTIPLE PRODUCTS)
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user.id })
      .populate("items.product") // IMPORTANT change
      .sort({ createdAt: -1 });

    res.status(200).json(sales);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};