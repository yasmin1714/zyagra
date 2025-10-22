import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import "../style/CartPage.css"; // Import the new stylesheet
import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Your Shopping Cart</h2>
        <p>Your cart is currently empty. Add some fresh groceries!</p>
        <Link to="/products" className="cart-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      <div className="cart-grid">
        {/* Cart Items List */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="item-price">
                  ₹{parseFloat(item.price).toFixed(2)}
                </p>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-subtotal">
                <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getCartTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>Free</span>
          </div>
          <div className="summary-total-row">
            <strong>Total</strong>
            <strong>₹{getCartTotal()}</strong>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="cart-button checkout-button"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
