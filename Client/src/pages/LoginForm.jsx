import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/LoginPage.css"; // We can reuse the same CSS for a similar look
import { useAuth } from "../context/AuthContext";
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("Please enter both email and password.");
    }

    try {
      // Step 1: Send data to the REGULAR USER login endpoint
      const response = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Step 2: Save the regular user's info to localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      login(data); // Update auth context
      // Step 3: Navigate to the homepage with a welcome message
      navigate("/", { state: { message: data.message } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Log In to Your Account</h2>
        <p>Welcome back to ZYAGRA!</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Log In
        </button>

        <div className="form-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

          {/* --- NEW LINK TO ADMIN LOGIN --- */}
          <p className="admin-link">
            Are you an administrator? <Link to="/admin/login">Admin Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
