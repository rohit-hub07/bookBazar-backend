import express from 'express';
import { allOrdersController, getOrderDetailsController, placeOrdersController } from '../controllers/order.controller.js';
import { isVerified } from '../middleware/authenticateUser.js';

const orderRouter = express.Router();

orderRouter.post("/:id",isVerified, placeOrdersController);
orderRouter.get("/",isVerified, allOrdersController);
orderRouter.get("/orderDetail/:id",isVerified, getOrderDetailsController)

export default orderRouter;