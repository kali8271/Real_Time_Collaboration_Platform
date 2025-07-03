import React from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Import CSS file
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const { user } = useUser();

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee", textAlign: "center" }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>Welcome to the Real-Time Collaboration Platform</h1>
      <p style={{ color: "#666", fontSize: 18, marginBottom: 32 }}>
        Collaborate, chat, and create in real time. Your productivity hub for teams and individuals.
      </p>
      {!user && (
        <>
          <Link to="/login" className="home-btn" style={{ marginRight: 16 }}>Login</Link>
          <Link to="/signup" className="home-btn">Sign Up</Link>
          <div style={{ marginTop: 32, color: '#888' }}>
            <b>Features:</b> Real-time chat, collaborative documents, whiteboard, admin dashboard, and more!
          </div>
        </>
      )}
      {user && (
        <>
          <div style={{ marginBottom: 24 }}>
            <img
              src={user.profile_picture && user.profile_picture.startsWith("/media/") ? `http://127.0.0.1:8000${user.profile_picture}` : user.profile_picture || "https://ui-avatars.com/api/?name=User"}
              alt="Profile"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #eee", marginBottom: 8 }}
            />
            <h2 style={{ margin: 0 }}>{user.username}</h2>
            <div style={{ color: '#888', marginBottom: 8 }}>{user.email}</div>
            <span style={{
              display: 'inline-block',
              background: user.is_superuser || user.is_staff ? '#007bff' : '#28a745',
              color: '#fff',
              borderRadius: 8,
              padding: '2px 10px',
              fontSize: 14,
              marginBottom: 8
            }}>
              {user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'}
            </span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Link to="/profile" className="home-btn" style={{ marginRight: 12 }}>My Profile</Link>
            <Link to="/activity" className="home-btn" style={{ marginRight: 12 }}>Activity Feed</Link>
            {user.is_superuser || user.is_staff ? (
              <Link to="/dashboard" className="home-btn">Admin Dashboard</Link>
            ) : null}
          </div>
          <div style={{ color: '#888', fontSize: 15, marginTop: 24 }}>
            <b>Tip:</b> Use the navigation bar to access chat, documents, whiteboard, and more.
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
