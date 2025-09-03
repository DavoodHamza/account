import { Star } from "lucide-react";
import React from "react";
import "./style.scss";

// Import images from the assets folder
import {
  default as aboutImage,
  default as heroImage,
} from "../../assets/images/logisticsSample.webp";

interface RatingStarsProps {
  rating: number;
}

const Logistics: React.FC = () => {
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
            <h1>LOGISTICS</h1>
            <p>
              Logistics is the process of planning, implementing, and managing
              the efficient flow of goods, services, and information from the
              point of origin to the point of consumption. It ensures that the
              right product reaches the right customer at the right time, in the
              right condition, and at the lowest possible cost. Logistics is a
              critical component of supply chain management, involving
              transportation, warehousing, inventory management, and
              coordination.
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Logistics Hero" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Simple Information About Us</h2>
          <div className="about-content">
            <div className="chef-image">
              <img src={aboutImage} alt="About Logistics" />
            </div>
            <div className="about-details">
              <p>
                Logistics is the process of planning, implementing, and managing
                the efficient flow of goods, services, and information from the
                point of origin to the point of consumption. It ensures that the
                right product reaches the right customer at the right time, in
                the right condition, and at the lowest possible cost. Logistics
                is a critical component of supply chain management, involving
                transportation, warehousing, inventory management, and
                coordination.
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

export default Logistics;
