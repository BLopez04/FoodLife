// src/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { terminal } from "virtual:terminal";
import { setToken } from "./Auth.js";
import "../scss/_signup.scss";

// Move the INVALID TOKEN, TOKEN etc into the Auth.js file
// Use localStorage to have the token persists between pages (and access it)
// Use the create auth header

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = () => {
    // Validate inputs
    if (!username || !password) {
      setErrorMessage("Username and Password required");
      return;
    } else {
      fetch("Http://localhost:8000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({username: username, pwd: password})
      })
        .then((res) => {
          if (res.status === 201) {
            return res.json()
          } else if (res.status === 409) {
            setErrorMessage("Username taken");
          } else {
            setErrorMessage("Sign-up unsuccessful, try again later");
          }
        })
        .then((payload) => {
          if (payload && payload.token) {
            setToken(payload.token);
            alert("Sign-up successful!");
            setErrorMessage("");
            navigate("/overview");
          }
        })
        .catch((error) => {
          setErrorMessage(error.message);
        })
    }
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
