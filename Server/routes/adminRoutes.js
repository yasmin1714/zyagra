const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const Admin = require("../models/adminModel");

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid or inactive admin account." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// @route   POST /api/admins/register
// @desc    Register new admin (for development only)
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password ) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists." });
    }

    // Create new admin
    const admin = new Admin({
      email: email.toLowerCase(),
      password,
      role: "admin"
    });

    await admin.save();

    res.status(201).json({
      message: "Admin registered successfully.",
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// @route   POST /api/admins/login
// @desc    Admin login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: "Account is deactivated." });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// @route   GET /api/admins/profile
// @desc    Get admin profile
// @access  Private (Admin only)
router.get("/profile", verifyAdminToken, async (req, res) => {
  try {
    res.json({
      message: "Admin profile retrieved successfully.",
      admin: req.admin
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// @route   POST /api/admins/logout
// @desc    Admin logout (client-side token removal)
// @access  Private (Admin only)
router.post("/logout", verifyAdminToken, async (req, res) => {
  try {
    res.json({ message: "Logout successful." });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;