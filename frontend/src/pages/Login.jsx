import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import "../styles/Login.css"; // Import CSS file
import { useUser } from "../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      // Set user context after login
      const access = localStorage.getItem("accessToken");
      if (access) {
        const payload = JSON.parse(atob(access.split('.')[1]));
        setUser({
          username: payload.username || payload.user_name || payload.sub || "User",
          email: payload.email,
          is_staff: payload.is_staff,
          is_superuser: payload.is_superuser,
          ...payload,
        });
      }
      navigate("/editor/1"); // Redirect to Editor after login
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
