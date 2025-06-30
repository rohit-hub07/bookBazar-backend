import express from "express";
import { addBookController, addReviewController, deleteBook, getAllBooks, getBookById, updateBookDetail } from "../controllers/book.controller.js";
import { isVerified } from "../middleware/authenticateUser.js";
import { isAdmin } from "../middleware/getCurrUser.js";

const bookRouter = express.Router();

bookRouter.post('/',isVerified,isAdmin, addBookController);
bookRouter.get('/',isVerified, getAllBooks);
bookRouter.get('/:id',isVerified, getBookById);
bookRouter.put('/update/:id',isVerified,isAdmin, updateBookDetail);
bookRouter.delete('/:id',isVerified,isAdmin, deleteBook)

//review routes inside books
bookRouter.post('/:id/reviews',isVerified, addReviewController);


export default bookRouter;