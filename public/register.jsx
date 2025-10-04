import React, { useState } from "react";

const API_URL = "http://localhost:3000";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pincode: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          pincode: form.pincode,
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();

      setMessage(data.message);
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-content">
      <h1>Money Maze Navigator</h1>
      <div className="container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            required
          />

          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
        {message && <p style={{ color: "red" }}>{message}</p>}
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}
