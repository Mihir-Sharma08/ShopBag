import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,

      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: String,
    },
    stock: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
