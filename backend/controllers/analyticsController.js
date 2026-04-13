import Product from "../models/Product.js";
import Sale from "../models/Sales.js";
import mongoose from "mongoose";

// ================= SUMMARY =================
export const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Total products
    const totalProducts = await Product.countDocuments({ user: userId });

    // Total sales (number of orders)
    const totalSales = await Sale.countDocuments({ user: userId });

    // Total revenue (sum of totalBill)
    const revenueResult = await Sale.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalBill" }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Total profit (sum of totalProfit)
    const profitResult = await Sale.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$totalProfit" }
        }
      }
    ]);

    const totalProfit = profitResult[0]?.totalProfit || 0;

    // Low stock products
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

export const getWeeklySales = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const date = req.query.date ? new Date(req.query.date) : new Date();

    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // 🔥 AGGREGATION
    const weeklySales = await Sale.aggregate([
      {
        $match: {
          user: userId,
          createdAt: {
            $gte: startOfWeek,
            $lt: endOfWeek
          }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalRevenue: { $sum: "$totalBill" },
          totalProfit: { $sum: "$totalProfit" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // ✅ ADD YOUR CODE HERE (after aggregation)
    const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const formatted = weeklySales.map(item => ({
      day: daysMap[item._id - 1],   // ⚠️ use _id
      totalRevenue: item.totalRevenue,
      totalProfit: item.totalProfit
    }));

    // ✅ SEND RESPONSE
    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= MONTHLY SALES =================
export const getMonthlySales = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // get year from query (ex: ?year=2025)
    const year = parseInt(req.query.year);

    const monthlySales = await Sale.aggregate([
      {
        $match: {
          user: userId,
          ...(year && {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`)
            }
          })
        }
      },

      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalBill" },
          totalProfit: { $sum: "$totalProfit" }
        }
      },

      { $sort: { "_id": 1 } },

      {
        $project: {
          month: "$_id",
          totalRevenue: 1,
          totalProfit: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(monthlySales);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getYearlySales = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const yearlySales = await Sale.aggregate([
      {
        $match: { user: userId }
      },

      {
        $group: {
          _id: { $year: "$createdAt" },
          totalRevenue: { $sum: "$totalBill" },
          totalProfit: { $sum: "$totalProfit" }
        }
      },

      { $sort: { "_id": 1 } },

      {
        $project: {
          year: "$_id",
          totalRevenue: 1,
          totalProfit: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(yearlySales);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTopProducts = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const topProducts = await Sale.aggregate([
      {
        $match: { user: userId }
      },
      {
        $unwind: "$items"
      },

      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalAmount" },
          totalProfit: { $sum: "$items.profit" }
        }
      },
      {
        $sort: { totalProfit: -1 }
      },

      {
        $limit: 5
      },

      {
        $lookup: {
          from: "products", 
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      {
        $unwind: "$productDetails"
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productDetails.name",
          totalQuantity: 1,
          totalRevenue: 1,
          totalProfit: 1
        }
      }
    ]);

    res.status(200).json(topProducts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfitByCategory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Sale.aggregate([
      {
        $match: { user: userId }
      },


      {
        $unwind: "$items"
      },


      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      {
        $unwind: "$productDetails"
      },

      {
        $group: {
          _id: "$productDetails.category",
          totalProfit: { $sum: "$items.profit" }
        }
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          totalProfit: 1
        }
      },

      {
        $sort: { totalProfit: -1 }
      }
    ]);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};