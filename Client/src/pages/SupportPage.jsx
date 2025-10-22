import React from "react";
import "../style/SupportFarmersPage.css"; // Import the CSS file

const SupportFarmersPage = () => {
  return (
    <div className="support-farmers-page">
      <h1 className="page-title">Supporting Our Farmers</h1>

      {/* Slogan uses new class and inline style removed */}
      <p className="main-slogan">
        **Grow with the Hands that Feed Us: Invest in a Sustainable Future.**
      </p>

      {/* Banner Image */}
      <div className="banner-container">
        <img
          src="/pictures/support/pic4.jpg"
          alt="Farmers working in fields"
          className="banner-image"
        />
      </div>

      {/* Supporting stats (Now with 4 cards) */}
      <section className="stats-section">
        <div className="stat-card">
          <h2 className="stat-value primary-color"> ₹50 Lakh </h2>
          <p className="stat-label">Contributed to Farmers</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-value primary-color">150+ Farmers</h2>
          <p className="stat-label">Supported & Empowered</p>
        </div>

        {/* New Additional Card */}
        <div className="stat-card">
          <h2 className="stat-value primary-color"> 2,000+ Acres </h2>
          <p className="stat-label">Under Organic Farming</p>
        </div>

        <div className="stat-card">
          <h2 className="stat-value primary-color"> Sustainable Growth </h2>
          <p className="stat-label">Farming Resources & Training</p>
        </div>
      </section>

      {/* Benefits and Details */}
      <section className="details-section">
        <h2 className="section-title">How We Help Farmers</h2>
        <ul className="help-list">
          <li>Fair pricing and direct sales, cutting middlemen</li>
          <li>Timely payments & financial support</li>
          <li>Providing irrigation and farming tools</li>
          <li>Training on organic and sustainable farming</li>
          <li>Market access for fresh produce</li>
        </ul>
        <p className="learn-more-link-container">
          <a
            href="/about"
            // Removed target="_blank" and rel="noopener noreferrer"
            className="learn-more-link"
          >
            Learn more about our initiatives
          </a>
        </p>
      </section>

      {/* Gallery / Photos section */}
      <section className="gallery-section">
        <h2 className="section-title">Farmers in Action</h2>
        <div className="gallery-grid">
          <img
            src="/pictures/support/pic3.jpg"
            alt="Farmer harvesting"
            className="gallery-image"
          />
          <img
            src="/pictures/support/pic2.jpg"
            alt="Farmers selling in market"
            className="gallery-image"
          />
          <img
            src="/pictures/support/pic5.jpg"
            alt="Farmers working"
            className="gallery-image"
          />
        </div>
      </section>

      {/* Call to Action (Now with a slogan) */}
      <section className="cta-section">
        <h3 className="cta-heading">Join Us in Supporting Farmers</h3>

        {/* Slogan uses new class and inline style removed */}
        <p className="cta-slogan">Buy Local, Make a Global Impact.</p>

        <p className="cta-text">
          Your support helps improve livelihoods, promotes sustainability, and
          encourage organic farming.
        </p>
        <a
          href="/products"
          // Removed target="_blank" and rel="noopener noreferrer"
          className="cta-button"
        >
          Get Involved Today
        </a>
      </section>
    </div>
  );
};

export default SupportFarmersPage;
