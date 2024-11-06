// src/SignUp.jsx
import React, { useState } from "react";


function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    // Validate inputs
    if (!username || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Reset error message and proceed with sign-up logic
    setErrorMessage("");
    alert("Sign-up successful!"); // Replace with actual sign-up logic
  };

  return (
    <div className="signup-container">
      <h2>Welcome to FoodLife!</h2>
      <p>Create an account to get started.</p>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button onClick={handleSignUp} className="signup-button">
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;