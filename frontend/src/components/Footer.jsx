import React from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { user } = useUser();
  return (
    <footer style={{
      background: 'var(--card-bg)',
      color: 'var(--text)',
      borderTop: '1px solid var(--border)',
      padding: '1rem 0',
      textAlign: 'center',
      fontSize: 15,
      marginTop: 40
    }}>
      <div style={{ marginBottom: 8 }}>
        <Link to="/" style={{ margin: '0 12px', color: 'var(--text)', textDecoration: 'none' }}>Home</Link>
        <Link to="/about" style={{ margin: '0 12px', color: 'var(--text)', textDecoration: 'none' }}>About</Link>
        <Link to="/contact" style={{ margin: '0 12px', color: 'var(--text)', textDecoration: 'none' }}>Contact</Link>
        <Link to="/privacy" style={{ margin: '0 12px', color: 'var(--text)', textDecoration: 'none' }}>Privacy</Link>
      </div>
      {user ? (
        <div style={{ color: '#888', fontSize: 14 }}>
          Logged in as <b>{user.username}</b> ({user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'})
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: 14 }}>
          &copy; {new Date().getFullYear()} Real-Time Collaboration Platform
        </div>
      )}
    </footer>
  );
};

export default Footer;
