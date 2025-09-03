import { Star } from "lucide-react";
import React from "react";
import "./style.scss";

import heroImage from "../../assets/images/ll.webp";
interface RatingStarsProps {
  rating: number;
}
const Retails: React.FC = () => {
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
            <h1>RETAIL</h1>
            <p>
              Retail refers to the process of selling goods or services directly
              to consumers for their personal use. This industry encompasses
              various business models, including physical stores, online
              platforms, and omnichannel strategies. Retail plays a critical
              role in the economy by connecting manufacturers and consumers,
              offering a wide range of products such as clothing, electronics,
              groceries, and more.
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Retail Hero" />
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Simple Information About Us</h2>
          <div className="about-content">
            <div className="chef-image">
              <img src={heroImage} alt="About Retail" />
            </div>
            <div className="about-details">
              <p>
                Retail is a dynamic and consumer-driven sector that continuously
                evolves to meet changing preferences, technological
                advancements, and market trends.
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
export default Retails;
