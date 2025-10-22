// in backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");

// --- Middleware to protect routes and ensure Admin role ---
const protectAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    // If token is missing, return JSON 401
    return res
      .status(401)
      .json({ message: "Access denied. No authentication token provided." });
  }

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Check for admin role

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden. Admin privileges required." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    // This catches expired/invalid tokens
    console.error("JWT Verification Failed:", error.message);
    res
      .status(401)
      .json({ message: "Invalid or expired token. Please log in again." });
  }
};

// --- ROUTES ---

// @route   GET /api/products
// @desc    Get all products (Public access)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error fetching products." });
  }
});

// @route   POST /api/products (Admin access)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { name, image, description, price, quantity, category } = req.body;
    if (!name || !price || !category || !image) {
      return res.status(400).json({
        message:
          "Missing required product fields (name, image, price, category).",
      });
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

// @route   DELETE /api/products/:id (Admin access)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const productId = req.params.id; // 1. Robust ID Validation

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    } // 2. Find and Delete

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    } // 3. Success Response

    res.json({
      message: "Product removed successfully.",
      name: deletedProduct.name,
    });
  } catch (error) {
    console.error("Product deletion error:", error);
    res.status(500).json({ message: "Server error during product deletion." });
  }
});

module.exports = router;
