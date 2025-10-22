import React from "react";
import "../style/AboutPage.css";

// --- Team Members Data (replace with your actual team) ---
const teamMembers = [
  {
    name: "Sandeep Kumar",
    role: "Founder & CEO",
    image: "https://placehold.co/400x400/E6FFFA/285E61?text=Sandeep",
    bio: "Aarav started ZYAGRA from his garage in Noida with a mission to bring fresh, quality groceries to every doorstep.",
  },
  {
    name: "Minakshee",
    role: "Head of Operations",
    image: "https://placehold.co/400x400/FEFBEB/946F00?text=Minakshee",
    bio: "Priya is the logistical mastermind, ensuring your orders are delivered fresh and on time, every time.",
  },
  {
    name: "Yasmin and Srishti",
    role: "Chief Technology Officer",
    image: "https://placehold.co/400x400/EBF4FF/1E40AF?text=Yasmin+%26+Srishti",
    bio: "Rohan leads our tech team, building the seamless app experience you love and trust.",
  },
];

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* --- Hero Section --- */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Who We Are</h1>
          <p>
            We're not just a delivery service; we're your friendly neighborhood
            grocery store, reimagined for today's fast-paced world.
          </p>
        </div>
      </section>

      {/* --- Our Mission Section --- */}
      <section className="about-section">
        <div className="section-content mission-section">
          <div className="mission-text">
            <h2>Our Mission 🎯</h2>
            <p>
              To deliver fresh, high-quality groceries and daily essentials to
              your doorstep with lightning speed and a smile. We aim to make
              grocery shopping a hassle-free and delightful experience, giving
              you back your most valuable asset: your time.
            </p>
          </div>
          <div className="mission-image">
            <img
              src="/pictures/home page/promise.jpg"
              alt="Fresh groceries"
            />
          </div>
        </div>
      </section>

      {/* --- Our Story Section --- */}
      <section className="about-section light-bg">
        <div className="section-content story-section">
          <h2>Our Story 📖</h2>
          <p>
            Founded in Noida in 2025, ZYAGRA was born out of a simple
            frustration: why should getting fresh groceries be a chore? Our
            founder, Sandeep Kumar, noticed a gap between the local vendors with
            the freshest produce and the busy households that needed it. With a
            small team and a big dream, we started by making deliveries on our
            own scooters. Today, we've grown into a trusted service for
            thousands of families across Uttar Pradesh, but our commitment to
            quality and community remains the same.
          </p>
        </div>
      </section>

      {/* --- Meet the Team Section --- */}
      <section className="about-section">
        <div className="section-content team-section">
          <h2>Meet the Team 👋</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.name} className="team-member-card">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-member-image"
                />
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
