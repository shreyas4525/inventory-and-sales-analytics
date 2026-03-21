import Product from "../models/Product.js";
import Sale from "../models/Sales.js";
import mongoose from "mongoose";
export const getSummary = async (req, res) => {
  try {

    const userId = req.user.id;

    // total products of this user
    const totalProducts = await Product.countDocuments({
      user: userId
    });

    // total sales of this user
    const totalSales = await Sale.countDocuments({
      user: userId
    });

    // revenue calculation
    const revenueResult = await Sale.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // profit calculation
    const profitResult = await Sale.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" }
        }
      }
    ]);

    const totalProfit = profitResult[0]?.totalProfit || 0;

    // low stock products
    const lowStockProducts = await Product.countDocuments({
      user: userId,
      stock: { $lt: 5 }
    });

    res.status(200).json({
      totalProducts,
      totalSales,
      totalRevenue,
      totalProfit,
      lowStockProducts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {

    const monthlySales = await Sale.aggregate([
    {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) } 
    },

      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },

      { $sort: { "_id": 1 } },

      {
        $project: {
          month: "$_id",
          totalRevenue: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(monthlySales);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};