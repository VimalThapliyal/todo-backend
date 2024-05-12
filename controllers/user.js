import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookies } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const getMyProfile = (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword });
    sendCookies(user, res, "User Created Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendCookies(user, res, `Welcome Back ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV == "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV == "Development" ? false : true,
      })
      .json({
        success: true,
        user: null,
      });
  } catch (error) {
    next(error);
  }
};
