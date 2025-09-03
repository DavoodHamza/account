import { Star } from "lucide-react";
import React from "react";
import "./style.scss";

import {
  default as aboutImage,
  default as heroImage,
} from "../../assets/images/financese.webp";

interface RatingStarsProps {
  rating: number;
}

const Finance: React.FC = () => {
  const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => (
    <div className="rating-stars">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={index < rating ? "star filled" : "star"}
        />
      ))}
    </div>
  );

  return (
    <div className="food-delivery-app">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>FINANCE</h1>
            <p>
              Finance is the management, creation, and study of money,
              investments, and financial systems. It plays a critical role in
              both individual and organizational success by ensuring optimal
              resource allocation, capital generation, and wealth management.
              The field spans a wide range of activities, from budgeting and
              forecasting to investments and risk management.
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Finance Hero" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Simple Information About Us</h2>
          <div className="about-content">
            <div className="chef-image">
              <img src={aboutImage} alt="About Finance" />
            </div>
            <div className="about-details">
              <p>
                Finance is the management, creation, and study of money,
                investments, and financial systems. It plays a critical role in
                both individual and organizational success by ensuring optimal
                resource allocation, capital generation, and wealth management.
                The field spans a wide range of activities, from budgeting and
                forecasting to investments and risk management.
              </p>
              <div className="info-grid">
                <div className="info-card">
                  <h3>Opening Hours</h3>
                  <p>Mon-Sun: 9:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Finance;
