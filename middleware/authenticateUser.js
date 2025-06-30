import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model.js";

dotenv.config();

export const isVerified = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log("token inside auth: ", token)
  if(!token){
    return res.status(401).json({
      message: "Login Please!",
      success: false,
    })
  }
  console.log("Authentication token: ", token);
  const decoded = jwt.verify(token, process.env.SECRET_JWT);
  if(!decoded){
    return res.status(401).json({
      message: "Login Please!",
      success: false,
    })
  }
  console.log("decoded value: ", decoded);
  const user = await User.findOne({ email: decoded.email});
  // console.log("logged in user", user)
  req.userId = user._id;
  // console.log("userID: ", userId)
  next();
  } catch (error) {
    console.log("error while getting authentication details", error);
    return res.status(401).json({
      error,
      message: "User Verification Failed"
    })
  }
}