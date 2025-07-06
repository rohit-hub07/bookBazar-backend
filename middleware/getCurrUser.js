import User from "../model/user.model.js";

export const getCurrUser = async (userId) => {
  const currUser = await User.findById(userId).select("-password");
  if (!currUser) {
    return null;
  }
  // console.log("Current User: ", currUser);
  return currUser;
};

export const isAdmin = async (req, res, next) => {
  try {
    const loggedInUserId = req.userId;
    const user = await User.findById(loggedInUserId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Please login!",
        success: false,
      });
    }
    // console.log("User inside isAdmin: ", user);
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not authorized to perform this task!",
        success: false,
      });
    }
    next();
  } catch (error) {
    // console.log("Error verifying the user", error);
    return res.status(401).json({
      message: "Error verifying the user",
      success: false,
    });
  }
};
