import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/MyOrdersPage.css"; // We'll need styles for this

const MyOrdersPage = () => {
  // State to store the fetched orders
  const [orders, setOrders] = useState([]);
  // State to handle loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect runs once when the component first loads
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // 1. Get user info (and token) from localStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) {
          throw new Error("You must be logged in to view orders.");
        }

        // 2. Make an API call to the protected backend route
        const response = await fetch(
          "http://localhost:5001/api/orders/myorders",
          {
            method: "GET",
            headers: {
              // Include the token to prove who you are
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch your orders.");
        }

        const data = await response.json();
        setOrders(data); // 3. Save the fetched orders into state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // 4. Stop the loading indicator
      }
    };

    fetchMyOrders();
  }, []); // The empty array [] means this effect runs only once

  // --- Render UI based on the state ---

  if (loading) {
    return <div className="loading-spinner">Loading your orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="shop-now-link">
            Start Shopping
          </Link>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Grand Total (Rs)</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                {/* Show a shorter version of the ID */}
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <ul>
                    {order.orderItems.map((items) => (
                      <li>{items.name}</li>
                  ))}
                  </ul>
                </td>
                <td>₹{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    <span className="status-paid">Paid(COD)</span>
                  ) : (
                    <span className="status-not-paid">Not Paid</span>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <div>
                      <span className="status-delivered">Delivered</span>
                      <p>Delivered At: {new Date(order.deliveredAt).toLocaleDateString()}</p>
                    </div>
                  ) : (
                    <span className="status-not-delivered">Not Delivered</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrdersPage;
