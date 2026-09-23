import HttpError from "../helpers/httpError.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

export const userRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    } else {
      const { firstName, lastName, email, password, role } = req.body;
      const userRole = role === "seller" ? "seller" : "customer";

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new HttpError("Email already exists", 400));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: userRole,
      });

      await newUser.save();

      const token = jwt.sign(
        {
          user_id: newUser._id,
          role: newUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRY },
      );

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
        accessToken: token,
      });
    }
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new HttpError("Email and password are required", 400));
    }

    const user = await User.findOne({ email }).select(
      "_id firstName lastName email role password",
    );

    if (!user) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new HttpError("Invalid email or password", 401));
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: token,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};
