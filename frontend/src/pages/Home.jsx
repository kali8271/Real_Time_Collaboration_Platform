import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Import CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Real-Time Collaboration Platform</h1>
      <p className="home-description">Real-time document editing, whiteboarding, and chat.</p>
      <Link to="/login" className="home-button">Get Started</Link>
    </div>
  );
};

export default Home;
