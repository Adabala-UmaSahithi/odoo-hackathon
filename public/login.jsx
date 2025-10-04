import React, { useState } from "react";

const API_URL = "http://localhost:3000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.message === "Welcome to Money Maze Navigator!") {
        window.location.href = "/welcome";
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-content">
      <h1>Money Maze Navigator</h1>
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
        {message && <p style={{ color: "red" }}>{message}</p>}
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
}
