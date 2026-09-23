import HttpError from "../helpers/httpError.js";
import { Product } from "../models/Product.js";
import { validationResult } from "express-validator";
import { Cart } from "../models/cart.js";

export const createProduct = async (req, res, next) => {
  try {
    if (req.userData.userRole !== "seller") {
      return next(new HttpError("Unauthorized: Seller access required", 403));
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, category, colour, price, quantity, description, image } =
      req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!name || !category || !colour || !price || !quantity || !description) {
      return next(new HttpError("All fields are required", 400));
    }

    const newProduct = new Product({
      name,
      category,
      image: imagePath,
      colour,
      price,
      quantity,
      description,
      createdBy: req.userData.userId,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { colour: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Everyone sees ALL products
    const products = await Product.find(searchFilter).skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments(searchFilter);

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    if (req.userData.userRole !== "seller") {
      return next(new HttpError("Unauthorized: Seller access required", 403));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { colour: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const filter = {
      createdBy: req.userData.userId,
      ...searchFilter,
    };

    const products = await Product.find(filter).skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      message: "Seller products retrieved successfully",
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const productId = req.params.id;

    console.log("Product ID received:", productId);

    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (req.userData.userRole !== "seller") {
      return next(new HttpError("Unauthorized: Seller access required", 403));
    }

    const productId = req.params.id;
    const { name, category, colour, price, quantity, description } = req.body;

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

    const updateData = {
      name,
      category,
      colour,
      price,
      quantity,
      description,
    };

    if (imagePath) {
      updateData.image = imagePath;
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};
//delete single product
export const deleteProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    if (req.userData.userRole !== "seller") {
      return next(new HttpError("Unauthorized: seller access required", 403));
    }
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};
//clear all
export const deleteAllProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    if (req.userData.userRole !== "seller") {
      return next(new HttpError("Unauthorized: Seller access required", 403));
    }
    const result = await Product.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All products deleted successfully",
      data: result,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

// add to cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return next(new HttpError("Product ID is required", 400));
    }

    if (Number(quantity) < 1) {
      return next(new HttpError("Quantity must be at least 1", 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    //check stock
    if (product.quantity < Number(quantity)) {
      return next(new HttpError("Not enough stock available", 400));
    }

    //find user cart
    let cart = await Cart.findOne({
      user: userId,
    });

    //create cart if not exists
    if (!cart) {
      cart = new Cart({
        user: userId,

        items: [
          {
            product: productId,
            quantity: Number(quantity),
          },
        ],
      });
    } else {
      //check existing products
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + Number(quantity);

        // Check stock again
        if (product.quantity < newQuantity) {
          return next(new HttpError("Not enough stock available", 400));
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity: Number(quantity),
        });
      }
    }

    await cart.save();

    //get updated cart
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: updatedCart,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    // User doesn't have a cart yet
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart retrieved successfully",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart.items,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const productId = req.params.productId;

    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      return next(new HttpError("Quantity must be at least 1", 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    if (product.quantity < Number(quantity)) {
      return next(new HttpError("Not enough stock available", 400));
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return next(new HttpError("Cart not found", 404));
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      return next(new HttpError("Product is not in cart", 404));
    }

    cartItem.quantity = Number(quantity);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      data: updatedCart.items,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const productId = req.params.productId;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return next(new HttpError("Cart not found", 404));
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!itemExists) {
      return next(new HttpError("Product is not in cart", 404));
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: updatedCart.items,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

//clear cart
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
        data: [],
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: [],
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};
