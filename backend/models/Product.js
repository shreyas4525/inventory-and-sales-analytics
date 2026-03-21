import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    costPrice: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: String,

    supplier: {
      name: {
        type: String,
        required: true,
        default: "Unknown Supplier",
      },
      phone: {
        type: String,
        required: true,
        default: "NA",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
