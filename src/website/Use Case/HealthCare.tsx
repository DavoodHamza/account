import { Star } from "lucide-react";
import React from "react";
import hospitalImage from "../../assets/images/hospital.webp";
import "./style.scss";

import health2Image from "../../assets/images/healths.webp";

import health3Image from "../../assets/images/health4.webp";

interface Popularhealth {
  rating: number;
  image: string;
}

const Healthcare: React.FC = () => {
  const popularHelath: Popularhealth[] = [
    { rating: 4, image: hospitalImage },
    { rating: 4, image: health2Image },
    { rating: 4, image: health3Image },
  ];

  // Props type for RatingStars component
  interface RatingStarsProps {
    rating: number;
  }

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
            <h1>HEALTH CARE</h1>
            <p>
              "Healthcare is a right, not a privilege. We are dedicated to
              providing accessible and affordable medical services to
              individuals and families, regardless of their background or
              circumstances. Our state-of-the-art facilities and expert team
              ensure that quality care is always within your reach."
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={health2Image} alt="Hero Healthcare" />
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Simple Information About Us</h2>
          <div className="about-content">
            <div className="chef-image">
              <img src={hospitalImage} alt="Hospital" />
            </div>
            <div className="about-details">
              <p>
                We believe that healthcare is not just about curing illness but
                fostering well-being in mind, body, and spirit. By combining
                advanced medical practices with a human touch, we aim to be your
                trusted partner in health. At [Your Healthcare Brand Name], your
                journey to better health is our top priority."
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
      {/* Popular Food Section */}
      <section className="popular-food-section">
        <div className="food-container">
          <div className="food-grid">
            {popularHelath.map((health, index) => (
              <div key={index} className="food-card">
                <img src={health.image} alt={`health${index + 1}`} />
                <RatingStars rating={health.rating} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Healthcare;
