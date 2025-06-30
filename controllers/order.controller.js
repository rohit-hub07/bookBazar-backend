import { getCurrUser } from "../middleware/getCurrUser.js";
import Books from "../model/book.model.js";
import Orders from "../model/order.model.js";

// export const addTocartController = async() => {
//   const { id } = req.params;
//   try {
//     // const bookDetail = await
//   } catch (error) {

//   }
// }

export const placeOrdersController = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const book = await Books.findById({ _id: id });
    if (!book) {
      return res.status(404).json({
        message: "Book doesn't exist!",
        success: false,
      });
    }

    console.log("Book details inside order: ", book);
    const loggedInUser = await getCurrUser(req.userId);
    console.log("LoggedInuser: ", loggedInUser);
    const order = await Orders.create({
      bookDetail: book,
      user: loggedInUser,
      quantity,
    });
    if (!order) {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }

    console.log("Placed order: ", order);
    await order.save();

    book.purchasedBy.push(loggedInUser);
    await book.save();

    console.log("Book inside placeorder: ", book);
    res.status(200).json({
      message: "Order placed successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.log("Error while ordering", error);
    return res.status(500).json({
      success: false,
      message: "Error while ordering!",
    });
  }
};

export const allOrdersController = async (req, res) => {
  try {
    const loggedInUser = await getCurrUser(req.userId);
    if (loggedInUser.role === "admin") {
      const allOrders = await Orders.find({})
        .populate({ path: "user", select: "-password" })
        .populate("bookDetail");
      if (!allOrders) {
        return res.status(404).json({
          message: "No order available!",
          success: false,
        });
      }
      res.status(200).json({
        message: "Orders fetched successfully",
        success: true,
        allOrders,
      });
    } else {
      const allOrders = await Orders.find({ user: loggedInUser._id })
        .populate({ path: "user", select: "-password" })
        .populate("bookDetail");
      console.log("inside orders of current user: ", allOrders);
      if (!allOrders) {
        return res.status(404).json({
          message: "No order available!",
          success: false,
        });
      }
      res.status(200).json({
        message: "Orders fetched successfully",
        success: true,
        allOrders,
      });
    }
  } catch (error) {
    console.log("Error while fetching orders", error);
    return res.status(404).json({
      message: "No order available!",
      success: false,
    });
  }
};

export const getOrderDetailsController = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(401).json({
        message: "Order doesn't exist!",
        success: false,
      });
    }
    const orderDetails = await Orders.findById({ _id: id })
      .populate({ path: "user", select: "-password" })
      .populate("bookDetail");
    if (!orderDetails) {
      return res.status(401).json({
        message: "Order doesn't exist!",
        success: false,
      });
    }
    res.status(200).json({
      message: "Order detail fetched successfully",
      success: true,
      orderDetails,
    });
  } catch (error) {
    console.log("Error getting the order details", error);
    return res.status(500).json({
      message: "Error getting the order details",
      success: false,
    });
  }
};
