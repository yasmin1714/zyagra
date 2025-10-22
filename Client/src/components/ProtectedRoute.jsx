// in backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken"); // Used to protect routes
// require('dotenv').config(); // Assuming this is done in the server.js entry file

// --- Middleware to protect routes and ensure Admin role ---
const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }

  try {
    // Note: process.env.JWT_SECRET must be available here
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Authorization Check: Must have the 'admin' role in the token payload
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized. Admin privileges required." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    // Handles expired or invalid token
    res.status(401).json({ message: "Token is invalid or expired." });
  }
};

// --- ROUTES ---

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error fetching products." });
  }
});

// @route   POST /api/products
// @desc    Add a new product
// @access  Private/Admin
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { name, image, description, price, quantity, category } = req.body;

    // Basic Validation (You might want more detailed validation here)
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Missing required product fields." });
    }

    const newProduct = new Product({
      name,
      image,
      description,
      price,
      quantity,
      category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server Error during product creation." });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
// @access  Private/Admin
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Use .deleteOne() for Mongoose 5+
    await Product.deleteOne({ _id: req.params.id });

    res.json({ message: "Product removed successfully.", name: product.name });
  } catch (error) {
    console.error("Product deletion error:", error);
    // If ID format is invalid (e.g., non-MongoDB ObjectId), Mongoose throws a CastError, which we catch here.
    res.status(500).json({ message: "Server error during product deletion." });
  }
});

module.exports = router;
