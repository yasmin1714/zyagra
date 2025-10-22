import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import "../style/CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    postalCode: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) {
          throw new Error("You must be logged in to place an order.");
        }
        const userID = userInfo.id
        const userResponse = await fetch(
          `http://localhost:5001/api/users/userdetails/?id=${userID}`,
          {
            method: "GET",
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch your orders.");
        }

        var userData = await userResponse.json();
        const shippingInfoData = {
          fullName: userData.fullName,
          address: userData.shippingAddress.address,
          phone: userData.phone,
          city: userData.shippingAddress.city,
          postalCode: userData.shippingAddress.postalCode
        }
        setShippingInfo(shippingInfoData)
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchUser();
  }, []);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null); // To handle the success pop-up

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Get the logged-in user's token from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.token) {
        throw new Error("You must be logged in to place an order.");
      }

      // 2. Prepare the order data for the API
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id,
        })),
        shippingAddress: shippingInfo,
        phone:shippingInfo.phone,
        paymentMethod: "Cash on Delivery",
        totalPrice: getCartTotal(),
      };

      // 3. Send the order data to the backend
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order.");
      }

      const createdOrder = await response.json();

      // 4. On success, clear the cart and trigger the success pop-up
      clearCart();
      setOrderSuccess({
        message: "Your order has been placed successfully!",
        orderId: createdOrder._id,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- UI Rendering Logic ---

  // Renders the success pop-up after an order is placed
  if (orderSuccess) {
    return (
      <div className="success-modal-overlay">
        <div className="success-modal-content">
          <h2>✅ Thank You!</h2>
          <p>{orderSuccess.message}</p>
          <p className="order-number">
            Your Order Number is: <strong>{orderSuccess.orderId}</strong>
          </p>
          <button
            onClick={() => navigate("/myorders")}
            className="checkout-button"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  // Renders a message if the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="checkout-container empty-cart">
        <h2>Checkout</h2>
        <p>Your cart is empty. You cannot proceed to checkout.</p>
        <Link to="/" className="checkout-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Renders the main checkout form
  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <p className="error-message-checkout">{error}</p>}
      <div className="checkout-layout">
        {/* --- Shipping & Payment Column --- */}
        <div className="customer-details">
          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-section">
              <h2>1. Shipping Information</h2>
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  required
                  readOnly={true}
                />
                </div>
                <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  required

                />
              </div>

              <div className="input-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  required

                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required

                  />
                </div>
                <div className="input-group">
                  <label htmlFor="postalCode">Pincode</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    required

                  />
                </div>
              </div>
            </div>
            <div className="checkout-section">
              <h2>2. Payment Method</h2>
              <div className="payment-placeholder">
                <p>
                  We currently support <strong>Cash on Delivery (COD)</strong>{" "}
                  only.
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="checkout-button place-order-button"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order (COD)"}
            </button>
          </form>
        </div>

        {/* --- Order Summary Column --- */}
        <div className="order-summary">
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <ul className="summary-items">
              {cartItems.map((item) => (
                <li key={item.id} className="summary-item">
                  <span className="item-name">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="summary-total">
              <strong>Total</strong>
              <strong>₹{getCartTotal()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
