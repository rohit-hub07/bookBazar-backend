import express from "express";
import { deleteReviewController, viewReviewController } from "../controllers/review.controller.js";
import { isVerified } from "../middleware/authenticateUser.js";


const reviewRouter = express.Router();

reviewRouter.delete('/:id',isVerified, deleteReviewController);
reviewRouter.get('/:id/reviews',isVerified, viewReviewController);

export default reviewRouter;
