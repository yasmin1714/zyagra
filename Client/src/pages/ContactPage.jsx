import React, { useState } from "react";
import "../style/ContactPage.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("Sending...");

    // --- Replace this with your actual form submission logic (e.g., API call) ---
    console.log("Form data submitted:", formData);

    // Simulate an API call
    setTimeout(() => {
      setFormStatus("Your message has been sent successfully!");
      // Clear the form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          We'd love to hear from you. Please fill out the form below or contact
          us using the details provided.
        </p>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            Fill up the form and our team will get back to you within 24 hours.
          </p>

          <div className="info-item">
            <FaPhoneAlt className="info-icon" />
            <p>+91 120 456 7890</p>
          </div>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <p>support@zyagra.com</p>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <p>Sector 62, Noida, Uttar Pradesh, 201309, India</p>
          </div>

          <div className="business-hours">
            <h4>Business Hours:</h4>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
            {formStatus && <p className="form-status">{formStatus}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
