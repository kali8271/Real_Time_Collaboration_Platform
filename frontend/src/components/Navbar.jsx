import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import User Context
import "../styles/Navbar.css"; // Import CSS file

const Navbar = () => {
  const { user, setUser } = useUser(); // Get user from context

  // Logout function
  const handleLogout = () => {
    setUser(null); // Clear user
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <h1 className="logo">
          <Link to="/">Collaboration Platform</Link>
        </h1>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>

          {/* Show Login & Signup if NOT logged in */}
          {!user ? (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="nav-item">Signup</Link>
            </>
          ) : (
            <>
              {/* Show Dashboard & Logout if logged in */}
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <button onClick={handleLogout} className="nav-item logout-btn">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
