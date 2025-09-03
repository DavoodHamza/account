import React from "react";
import "./style.scss";

import heroImage from "../../assets/images/business-hero.webp";

const Business: React.FC = () => {
  return (
    <div className="business-accounting-app">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>BUSINESS</h1>
            <p>
              "Business accounting is the foundation of financial success. Our
              expert team provides precise, reliable, and innovative accounting
              services to help businesses grow. From managing transactions to
              financial reporting, we ensure transparency and accuracy in every
              detail."
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Hero Business Accounting" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Business;
