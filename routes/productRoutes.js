import express from "express";
import {
  createProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/productController.js";
import userAuthCheck from "../middleware/authCheck.js";
import upload from "../middleware/fileUpload.js";
import { body, param } from "express-validator";

const productrouter = express.Router();
const productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),

  body("category").notEmpty().withMessage("Category is required"),

  body("colour").notEmpty().withMessage("Colour is required"),

  body("price").isFloat({ min: 0 }).withMessage("Price must be a valid number"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a valid number"),

  body("description").notEmpty().withMessage("Description is required"),
];
userAuthCheck;

productrouter.post(
  "/",
  userAuthCheck,
  upload.single("image"),
  productValidation,
  createProduct,
);
productrouter.get("/", userAuthCheck, getAllProducts);
productrouter.get("/my-products", userAuthCheck, getMyProducts);
productrouter.post("/cart", userAuthCheck, addToCart);
productrouter.get("/cart", userAuthCheck, getCart);
productrouter.patch("/cart/:productId", userAuthCheck, updateCartQuantity);
productrouter.delete("/cart/:productId", userAuthCheck, removeFromCart);
productrouter.delete("/cart", userAuthCheck, clearCart);
productrouter.get("/:id", userAuthCheck, getProductById);
productrouter.put(
  "/:id",
  userAuthCheck,
  upload.single("image"),
  productValidation,
  updateProduct,
);
productrouter.delete("/:id", userAuthCheck, deleteProduct);
productrouter.delete("/", userAuthCheck, deleteAllProducts);

export default productrouter;
