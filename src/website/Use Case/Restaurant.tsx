import { Star } from "lucide-react";
import React from "react";
import "./style.scss";

import burritoImage from "../../assets/images/burrito.webp";
import chowmeinImage from "../../assets/images/chowmein.webp";
import pizzaImage from "../../assets/images/pizza.webp";
import restaurantImage from "../../assets/images/resturant.webp";
import salmonImage from "../../assets/images/salmon.webp";
import chefImage from "../../assets/images/shef.webp";

interface FoodItem {
  name: string;
  price: string;
  rating: number;
  image: string;
}

// Props type for RatingStars component
interface RatingStarsProps {
  rating: number;
}

const Restaurant: React.FC = () => {
  const popularFoods: FoodItem[] = [
    { name: "Pizza", price: "£8", rating: 5, image: pizzaImage },
    { name: "Chowmein", price: "£6", rating: 4, image: chowmeinImage },
    { name: "Salmon", price: "£10", rating: 5, image: salmonImage },
    { name: "Burrito", price: "£4", rating: 4, image: burritoImage },
  ];

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
            <h1>RESTAURANT</h1>
            <p>
              Best Restaurant In Town And Best Home Cooked Cuisine On Demand You
              Will Feel You Are In Home And You Have Made Food For You. We Have
              Best Home Cooked Cuisine In The Area, You Will Love Our Food.
            </p>
            <button className="explore-btn">
              Explore
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={restaurantImage} alt="Restaurant" />
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Simple Information About Us</h2>
          <div className="about-content">
            <div className="chef-image">
              <img src={chefImage} alt="Chef" />
            </div>
            <div className="about-details">
              <p>
                Our restaurant is a cozy spot in the heart of London where we
                serve delightful home-cooked meals. We take pride in our fresh
                ingredients and authentic recipes passed down through
                generations.
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

      <section className="popular-food-section">
        <div className="food-container">
          <h2>Our Popular Food</h2>
          <div className="food-grid">
            {popularFoods.map((food, index) => (
              <div key={index} className="food-card">
                <img src={food.image} alt={food.name} />
                <div className="food-info">
                  <h3>{food.name}</h3>
                  <span className="price">{food.price}</span>
                </div>
                <RatingStars rating={food.rating} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Restaurant;
