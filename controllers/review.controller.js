import { getCurrUser } from "../middleware/getCurrUser.js";
import Books from "../model/book.model.js";
import Review from "../model/review.model.js";
import User from "../model/user.model.js";

export const deleteReviewController = async (req, res) => {
  const { id } = req.params;
  let isOwner = false;
  try {
    // await Books.findByIdAndDelete(id,{$pull: {review: id}})

    //Only the user who has created the review can delete it and the admin
    const loggedInUserId = await getCurrUser(req.userId);
    const review = await Review.findById({ _id: id });
    if (!review) {
      return res.status(404).json({
        message: "Review doesn't exist!",
        success: false,
      });
    }

    if (
      loggedInUserId._id.toString() !== review.user._id.toString() &&
      loggedInUserId.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can not delete other's review!",
        success: false,
      });
    }

    if (loggedInUserId._id.toString() == review.user._id.toString()) {
      isOwner = true;
    }

    await Books.findByIdAndUpdate(
      { _id: review.book },
      { $pull: { review: id } }
    );
    const deletedReview = await Review.findByIdAndDelete({ _id: id });
    if (!deletedReview) {
      return res.status(404).json({
        message: "Review doesn't exist!",
        success: false,
      });
    }
    res.status(200).json({
      message: "Review deleted successfully",
      success: true,
      deletedReview,
      isOwner,
    });
  } catch (error) {
    // console.log("Error deleting the review", error);
    return res.status(404).json({
      message: "Error deleting the review!",
      success: false,
    });
  }
};

export const viewReviewController = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Books.findById({ _id: id });
    if (!book) {
      return res.status(404).json({
        message: "Book doesn't exist!",
        success: false,
      });
    }
    const review = await Review.find({ book: id }).populate("user");
    // console.log("review:", review);
    res.status(200).json({
      message: "Reviews fetched successfully",
      success: true,
      allReview: review,
    });
  } catch (error) {
    // console.log("Error fetching reviews", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews!",
    });
  }
};
