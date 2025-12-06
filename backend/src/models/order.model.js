import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    total_price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    status: {
      type: String,
    },

    delivery_address: {
      type: String,
    },
    location: {
      type: String,
    },
    loc: {
      type: Map,
      of: Number,
    },
    orderDate: Date,
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
