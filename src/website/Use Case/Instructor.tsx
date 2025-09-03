import { Star } from "lucide-react";
import React from "react";
import "./style.scss";

import heroImage from "../../assets/images/tesing.webp";

interface RatingStarsProps {
  rating: number;
}

// Props interface for PopularCourse
interface PopularCourse {
  name: string;
  price: string;
  rating: number;
  image: string;
}

// Main Component
const Instructor: React.FC = () => {
  // Example popular courses data
  const popularCourses: PopularCourse[] = [
    { name: "Web Development", price: "£100", rating: 5, image: "/webdev.jpg" },
    {
      name: "Data Science",
      price: "£120",
      rating: 4,
      image: "/datascience.jpg",
    },
    {
      name: "Digital Marketing",
      price: "£80",
      rating: 5,
      image: "/marketing.jpg",
    },
    {
      name: "Graphic Design",
      price: "£90",
      rating: 4,
      image: "/graphicdesign.jpg",
    },
  ];

  // RatingStars Component
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
    <div className="instructor-app">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>EXPERT INSTRUCTOR</h1>
            <p>
              Learn from the best instructors in the field, offering a wide
              range of courses to boost your career. Whether you're interested
              in tech, marketing, or design, our instructors provide
              high-quality lessons tailored to your needs.
            </p>
            <button className="explore-btn">
              Explore Courses
              <span>→</span>
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Instructor Hero" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Instructor;
