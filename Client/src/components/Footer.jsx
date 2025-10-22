import React from "react";
import { Link } from "react-router-dom";
import "../style/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* --- About ZYAGRA Section --- */}
        <div className="footer-section">
          <h3 className="footer-brand">ZYAGRA</h3>
          <p>
            Your daily dose of freshness, delivered in minutes. Born in Noida,
            we're committed to bringing you the best quality groceries with a
            smile.
          </p>
        </div>

        {/* --- Quick Links Section --- */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/products">All Products</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
          </ul>
        </div>

        {/* --- Customer Service Section --- */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li>
              <a href="#">Shipping & Delivery</a>
            </li>
            <li>
              <a href="#">Returns & Refunds</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* --- Social Media & Contact --- */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <p>Stay updated with our latest offers and products!</p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} ZYAGRA. All Rights Reserved. Built with
          ❤️ in Noida, India.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
