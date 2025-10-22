import React, { useState } from "react";
import "../style/CheckoutPage.css";

const ProfilePage = () => {

  const updateProfileDetails = async (e) => {
    const userInfo = localStorage.getItem('userInfo');
  };

  const [shippingInfo] = useState({
    fullName: "Yasmin D",
    address: "11, Connought Palace",
    city: "Delhi",
    postalCode: "851219",
  });
  return (
    <div className="checkout-container">
      <h1>Profile Details</h1>
      <div className="checkout-layout">
        {/* --- Shipping & Payment Column --- */}
        <div className="customer-details">
          <form onSubmit={updateProfileDetails}>
            <div className="checkout-section">
              <h2>1. User Profile Information</h2>
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
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
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="checkout-button place-order-button"
              // disabled={loading}
              
            >
              Update Profile Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;