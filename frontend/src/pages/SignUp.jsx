import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"; // Import CSS file

// Background images array
const backgroundImages = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg"
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bgIndex, setBgIndex] = useState(0); // Track current background index
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signing up with:", email, password);
    navigate("/login"); // Redirect to Login after signup
  };

  // Change background image every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup function
  }, []);

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url(${backgroundImages[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>

      {/* Change Background Button (Manual) */}
      <button
        onClick={() => setBgIndex((prev) => (prev + 1) % backgroundImages.length)}
        className="bg-change-button"
      >
        Change Background
      </button>
    </div>
  );
};

export default Signup;
