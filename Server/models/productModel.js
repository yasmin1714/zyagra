// in backend/models/productModel.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL to the product image
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: String, required: true }, // e.g., "500 ml", "1 dozen"
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
