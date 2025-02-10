import React, { useState } from "react";
import { login, logout, getUser } from "../services/auth";

const AuthComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(getUser());

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setUser(getUser()); // Update user state after login
    } catch (error) {
      alert("Login failed! Please check your credentials.");
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
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default AuthComponent;
