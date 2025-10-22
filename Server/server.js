// Hire (import) all our specialists
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Load environment variables (like JWT_SECRET and MONGO_URI)
require("dotenv").config();


const app = express(); // This starts our manager's shift

// --- Set up the office rules (Middleware) ---
// 1. CORS: Allows requests from your React frontend
app.use(cors());
// 2. JSON Parser: Allows the server to read JSON bodies (for POST/PUT requests)
app.use(express.json());

// --- Route mounting ---
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// --- CRITICAL FIX: 404/Not Found Handler ---
// This middleware runs if none of the above '/api' routes matched.
// It ensures we send a clean JSON error, not an HTML page.
app.use((req, res, next) => {
  const error = new Error(`API Route Not Found: ${req.originalUrl}`);
  res.status(404).json({
    message: error.message,
  });
});

// --- Connect to Database ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Bouncer is connected to the Member List!"))
  .catch((err) => console.log("Database connection error:", err));

// --- Open the office for business ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Bouncer's office is open on port ${PORT}`);
});
