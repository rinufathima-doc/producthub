import express from "express";
import { body } from "express-validator";
import { userLogin, userRegister } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name is required"),

    body("lastName").notEmpty().withMessage("Last name is required"),

    body("email").isEmail().withMessage("Please enter a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  userRegister,
);

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  userLogin,
);

export default authRouter;
