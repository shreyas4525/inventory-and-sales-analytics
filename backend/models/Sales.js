import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    costPrice: {
      type: Number,
      required: true
    },

    sellingPrice: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },
    profit:{
      type:Number,
      required:true
    },
    soldAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);