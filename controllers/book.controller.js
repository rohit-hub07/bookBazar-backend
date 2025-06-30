import { getCurrUser } from "../middleware/getCurrUser.js";
import Books from "../model/book.model.js";
import Review from "../model/review.model.js";

export const addBookController = async (req, res) => {
  console.log("req.body:", req.body);
  const { bookImage, title, price } = req.body;
  try {
    if (!bookImage || !title || !price) {
      return res.status(409).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const addedBook = await Books.create({ bookImage, title, price });
    if (!addedBook) {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }
    res.status(201).json({
      addedBook,
      message: "Book added successfully",
      success: true,
    });
  } catch (error) {
    console.log("Some error occured while adding book", error);
    return res.status(500).json({
      message: "Some error occured while adding book!",
      success: false,
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Books.find({}).populate("purchasedBy").populate("review");
    console.log("Allbooks: ", allBooks);
    res.status(200).json({
      success: true,
      allBooks,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.log("Error getting book details!", error);
    return res.status(500).json({
      message: "Error fetching book details",
      success: false,
    });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const bookDetail = await Books.findById({ _id: id }).populate("purchasedBy").populate("review");
    if (!bookDetail) {
      return res.status(404).json({
        message: "Book doesn't exist!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Book detail fetched successfully",
      success: true,
      bookDetail,
    });
  } catch (error) {
    console.log("Error getting book detail", error);
    return res.status(500).json({
      message: "Error getting book detail",
      success: false,
    });
  }
};

export const updateBookDetail = async (req, res) => {
  const { id } = req.params;
  const { bookImage, title, price,author } = req.body;
  try {
    const updatedBookDetail = await Books.findByIdAndUpdate(
      { _id: id },
      { bookImage, title, price, author },
      { new: true }
    );
    console.log("Updated book details: ", updatedBookDetail);
    res.status(200).json({
      message: "Book details updated successfully",
      success: true,
      updatedBookDetail,
    });
  } catch (error) {
    console.log("Error updating book details ", error);
    return res.status(500).json({
      message: "Error updating book details",
      success: false,
    });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Books.findByIdAndDelete({ _id: id });
    if (!book) {
      return res.status(404).json({
        message: "Book doesn't exist",
        success: false,
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      success: true,
      book,
    });
  } catch (error) {
    console.log("Error deleting book", error);
    return res.status(404).json({
      message: "Book doesn't exist",
      success: false,
    });
  }
};

//reviews controllers
export const addReviewController = async (req, res) => {
  const { id } = req.params;
  const { rating, description } = req.body;
  try {
    if (!rating) {
      return res.status(404).json({
        message: "Please fill the details!",
        success: false,
      });
    }

    const bookDetail = await Books.findById({ _id: id });
    if (!bookDetail) {
      return res.status(404).json({
        message: "Book doesn't exist",
        success: false,
      });
    }
    const review = await Review.create({
      rating,
      description,
    });
    const loggedInUserId = await getCurrUser(req.userId);
    console.log("Review: ", review);
    review.book = bookDetail.id;
    review.user = loggedInUserId;
    bookDetail.review.push(review);
    await bookDetail.save();
    await review.save();
    console.log("book detail: ", bookDetail);
    res.status(200).json({
      message: "Review added successfully",
      success: true,
      bookDetail,
      reviews: bookDetail.review,
      review,
    });
  } catch (error) {
    console.log("Error adding the review", error);
    return res.status(409).json({
      message: "Error adding the review!",
      success: false,
    });
  }
};


