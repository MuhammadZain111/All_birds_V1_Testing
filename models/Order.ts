import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      productId: String,
      size: Number,
      quantity: Number,
      price: Number,
    },
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  },

  paymentStatus: {
    type: String,
    enum: ["UNPAID", "PAID", "FAILED"],
    default: "UNPAID",
  },
});



const Order =
  mongoose.models.Order  || mongoose.model("Order", orderSchema);

export default Order;