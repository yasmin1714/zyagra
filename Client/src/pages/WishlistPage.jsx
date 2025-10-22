import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // << import your cart context here
import "../style/WishlistPage.css";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const { addToCart } = useCart(); // << get the addToCart function from context

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    addToCart(item); // << add item to cart
    handleRemove(item.id); // optional: remove from wishlist after adding to cart
  };

  const clearWishlist = () => setWishlist([]);

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your wishlist is empty</h2>
        <Link to="/products" className="btn-shop">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      <button className="btn-clear" onClick={clearWishlist}>
        Clear Wishlist
      </button>
      <div className="wishlist-items">
        {wishlist.map((item) => (
          <div className="wishlist-item" key={item.id}>
            <img src={item.image} alt={item.name} className="wishlist-image" />
            <div className="wishlist-details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button
                className="btn-remove"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
              <button
                className="btn-shop"
                onClick={() => handleAddToCart(item)}
                style={{ marginLeft: "1rem" }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
