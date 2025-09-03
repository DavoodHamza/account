import { Star } from "lucide-react";
import React from "react";
import {
  default as photographerImage1,
  default as photographerImage3,
} from "../../assets/images/photographer1.webp";
import photographerImage2 from "../../assets/images/photographer2.webp";
import heroImage from "../../assets/images/photographers-hero.webp";
import "./style.scss";

interface PopularPhotographer {
  rating: number;
  image: string;
}

const Photographers: React.FC = () => {
  const popularPhotographers: PopularPhotographer[] = [
    { rating: 5, image: photographerImage1 },
    { rating: 4, image: photographerImage2 },
    { rating: 5, image: photographerImage3 },
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
            <h1>PHOTOGRAPHERS</h1>
            <p>
              "Photography captures not just moments but the essence of life.
              Our team of photographers brings passion and creativity to every
              frame, delivering stunning visuals that speak louder than words.
              Whether it’s portraits, landscapes, or events, we ensure every
              shot tells a story."
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Hero Photographers" />
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Meet Our Photographers</h2>
          <div className="about-content">
            <div className="chef-image">
              <img src={photographerImage1} alt="Photographer" />
            </div>
            <div className="about-details">
              <p>
                Our photographers are skilled storytellers, blending technical
                expertise with an artistic touch. They aim to capture your
                memories and moments with precision and beauty, providing
                timeless images you'll treasure forever.
              </p>
              <div className="info-grid">
                <div className="info-card">
                  <h3>Available Hours</h3>
                  <p>Mon-Sun: 9:00 AM - 8:00 PM</p>
                </div>
                <div className="info-card">
                  <h3>Contact</h3>
                  <p>+44 987 654 321</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Photographers Section */}
      <section className="popular-food-section">
        <div className="food-container">
          <div className="food-grid">
            {popularPhotographers.map((photographer, index) => (
              <div key={index} className="food-card">
                <img
                  src={photographer.image}
                  alt={`Photographer ${index + 1}`}
                />
                <RatingStars rating={photographer.rating} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Photographers;
