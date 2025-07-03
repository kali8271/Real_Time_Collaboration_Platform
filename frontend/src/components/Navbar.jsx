import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import User Context
import "../styles/Navbar.css"; // Import CSS file
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const API_BASE = "http://127.0.0.1:8000";
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User";

const Navbar = () => {
  const { user, setUser } = useUser() || {}; // Get user from context
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  // Logout function
  const handleLogout = () => {
    setUser(null); // Clear user
  };

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lng', lng);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        {/* Logo */}
        <h1 className="logo" style={{ margin: 0, fontSize: 24 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)' }}>{t("Collaboration Platform")}</Link>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" className="nav-item">{t("Home")}</Link>
          {user && (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/chat" className="nav-item">Chat</Link>
              <Link to="/whiteboard" className="nav-item">Whiteboard</Link>
              <Link to="/documents" className="nav-item">Documents</Link>
              <Link to="/users" className="nav-item">Users</Link>
              <Link to="/profile" className="nav-item">{t("Profile")}</Link>
              <Link to="/activity" className="nav-item">Activity</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="nav-item">{t("Login")}</Link>
              <Link to="/signup" className="nav-item">{t("Signup")}</Link>
            </>
          )}
          <button onClick={toggleTheme} className="nav-item" style={{ fontSize: 18 }} title="Toggle theme" aria-label="Toggle theme">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <select onChange={e => changeLang(e.target.value)} value={i18n.language} className="nav-item" style={{ marginLeft: 8 }} aria-label="Select language">
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
          </select>
          {user && (
            <span className="nav-item user-info" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
              <img
                src={user.profile_picture && user.profile_picture.startsWith("/media/") ? `${API_BASE}${user.profile_picture}` : user.profile_picture || DEFAULT_AVATAR}
                alt="Profile"
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }}
              />
              <span style={{ fontWeight: 500 }}>{user.username}</span>
              <span style={{
                display: 'inline-block',
                background: user.is_superuser || user.is_staff ? '#007bff' : '#28a745',
                color: '#fff',
                borderRadius: 8,
                padding: '2px 8px',
                fontSize: 12
              }}>
                {user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'}
              </span>
              <button onClick={handleLogout} className="nav-item logout-btn" style={{ marginLeft: 8 }}>{t("Logout")}</button>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
