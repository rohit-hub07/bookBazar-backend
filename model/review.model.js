import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    book:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
    }
  },
  { timestamps: true }
);

const Review = new mongoose.model("Review", reviewSchema);

export default Review;