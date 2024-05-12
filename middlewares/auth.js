import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  let { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please Login or Register",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
};
