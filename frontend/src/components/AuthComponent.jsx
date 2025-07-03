import React, { useState } from "react";
import { login, logout, getUser, register } from "../services/auth";

const AuthComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(getUser());
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      setUser(getUser());
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      alert("Registration successful! You can now log in.");
      setRegisterMode(false);
    } catch (error) {
      setError(
        error.response?.data?.username?.[0] ||
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        "Registration failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.username}!</h2>
          {user.email && <p>Email: {user.email}</p>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : registerMode ? (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button type="button" onClick={() => setRegisterMode(false)} disabled={loading}>
            Back to Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <button type="button" onClick={() => setRegisterMode(true)} disabled={loading}>
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthComponent; 