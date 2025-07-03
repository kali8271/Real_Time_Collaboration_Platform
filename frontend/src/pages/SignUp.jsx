import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import "../styles/Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await register(username, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        "Registration failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        background: "#f7fafc", // Light gray background for visibility
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        {error && <div style={{ color: "red" }} className="mb-2">{error}</div>}
        {success && <div style={{ color: "green" }} className="mb-2">Registration successful! Redirecting...</div>}
        <input
          type="text"
          placeholder="Username"
          className="signup-input"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          disabled={loading}
        />
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
