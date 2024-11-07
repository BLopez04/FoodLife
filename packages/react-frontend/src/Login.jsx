// src/Login.jsx
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = () => {
    // Replace with actual authentication logic
    if (username === "user" && password === "password") {
      alert("Login successful!");
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <p>Please enter your username and password to sign in.</p>
      
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

      <button onClick={handleSignIn} className="signin-button">Sign In</button>
    </div>
  );
}

export default Login;