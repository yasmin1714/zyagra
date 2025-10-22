const express = require("express");
const ObjectId = require('mongodb').ObjectId
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/orderModel");
const User = require("../models/userModel")
const Product = require("../models/productModel")
// --- Middleware to Protect User Routes ---
// This checks for a valid user token and attaches user info to the request
const protectAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // We check if the decoded token has an 'admin' role
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as an admin" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
const protectUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attaches decoded user info (like id)
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Logged-in users only)
router.post("/", protectUser, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice, phone } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  } else {
    const objectId = new ObjectId(req.user.id);
    const order = new Order({
      user: objectId, // Get the user ID from the token via middleware
      orderItems: orderItems,
      shippingAddress: shippingAddress,
      phone:phone,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged-in user's orders
// @access  Private
router.get("/myorders", protectUser, async (req, res) => {
  // Find all orders where the 'user' field matches the logged-in user's ID
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

router.get("/allorders", protectAdmin, async (req, res) => {
  // Find all orders with the user details and the order details
  const orders = await Order.find({});
  for (const index in orders) {
    const userDetail = await User.findById(orders[index].user);
    orders[index].shippingAddress.address = userDetail.fullName + " - " + orders[index].shippingAddress.address
  }
  res.json(orders);
});

router.post("/updateorder", protectAdmin, async (req, res) => {
  // Find all orders with the user details and the order details
  const { orderId } = (req.body)
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const now = new Date();
    const { orderId } = (req.body)
    const order = await Order.findById(orderId)
    if(order.isPaid) {
      return res.status(400).json({ error: 'Order Already Paid and Delivered' });
    }
    const updatedorder = await Order.findByIdAndUpdate(
      orderId, {
      $set: {
        isPaid: true,
        isDelivered: true,
        paidAt: now,
        deliveredAt: now
      }
    },
      { new: true }
    );
    res.json({ message: 'Order updated ✅', order: updatedorder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
