import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all the details",
        success: false,
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists!",
        success: false,
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });
    if (!newUser) {
      return res
        .status(500)
        .json({ message: "Something went wrong!", success: false });
    }
    const token = jwt.sign(
      { name: newUser.name, email: newUser.email },
      process.env.SECRET_JWT,
      { expiresIn: "24h" }
    );
    // console.log("Token of jwt: ", token);
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    // console.log("New user: ", newUser);
    // console.log("res.cookie", res.cookie?.token);

    res.status(201).json({
      message: "User created successfully!",
      success: true,
      newUser,
    });
  } catch (error) {
    // console.log("Error registering user");
    res.status(500).json({
      success: false,
      message: "Error registering user!",
    });
  }
};

export const userProfileController = async (req, res) => {
  try {
    const currentUserId = req.userId;
    if (!currentUserId) {
      return res.status(401).json({
        message: "Please login!",
        success: false,
      });
    }
    // console.log("currentUserId : ", currentUserId);
    const currUser = await User.findById({ _id: currentUserId });
    if (!currUser) {
      return res.status(401).json({
        message: "Please login!",
        success: false,
      });
    }
    res.status(200).json({
      currUser,
      message: "Data fetched successfully",
      success: true,
    });
  } catch (error) {
    // console.log("Error fetching user data");
    return res.status(401).json({
      message: "Error fetching user data",
      success: false,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(409).json({
        message: "All fields are required!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    // console.log("Login user details: ", user);
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist!",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    // console.log("IsMathced: ", isMatched);
    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.SECRET_JWT
    );
    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "User authenticated successfully",
      success: true,
      user,
    });
  } catch (error) {
    // console.log("error while logging", error);
    return res.status(400).json({
      message: "Error while logging!",
      success: false,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpsOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    // console.log("Error while logging out", error);
    return res.status(400).json({
      message: "Somethinng went wrong!",
    });
  }
};
