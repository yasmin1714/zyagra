const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require('dotenv').config();
const Admin = require("../models/adminModel");

const MONGO_URI="mongodb+srv://yasminddg_db_user:Jesus1417*@cluster0.e66x3bm.mongodb.net/"

const register= async (email, password) => {
  try {

    mongoose
      .connect(MONGO_URI)
      .then(() => console.log("Bouncer is connected to the Member List!")) // Success!
      .catch((err) => console.log(err)); // Something went wrong

    // Validation
    if (!email || !password) {
      return ({ message: "Email and password are required." });
    }

    if (password.length < 6) {
      return ({ message: "Password must be at least 6 characters." });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return ({ message: "Admin with this email already exists." });
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
    return({ message: "Server error during registration." });
  }
};

registerAdmin = register('admin@gmail.com','password123')