import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  bookDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const Orders = new mongoose.model("Orders", orderSchema);

export default Orders;