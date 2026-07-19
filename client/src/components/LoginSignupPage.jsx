import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/LoginSignupPage.css";

function LoginSignup({ setIsLoggedIn }) {
  const [isSignUpMode, setSignUpMode] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    genres: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const toggleMode = () => {
    setSignUpMode((prevMode) => !prevMode);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      setSuccessMessage("Account created successfully! Please log in.");
      setErrorMessage("");
      toggleMode(); // Switch to login mode after successful signup
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during signup.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      console.log("login data", data)
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Token: ",data.token);
      // Store the token in localStorage
      localStorage.setItem("token", data.token);

      console.log("Stored: ",localStorage.getItem("token"));
      setSuccessMessage("Logged in successfully!");
      setIsLoggedIn(true);
      setErrorMessage("");

      // Navigate to the home or profile page
      navigate(-1); // Adjust this path as needed

    } catch (error) {
      setErrorMessage(error.message || "An error occurred during login.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`loginSignupContainer ${isSignUpMode ? "sign-up-mode" : ""}`}>
        {/* Login Form Section */}
        <div className="form-container sign-in-container">
          <h2>Login</h2>
          <p className="form-helper">Welcome back! Access your library.</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button onClick={handleLogin} className="auth-btn">Login</button>
          <p className="mobile-toggle-link" onClick={toggleMode}>
            Don't have an account? <span>Sign Up</span>
          </p>
          {errorMessage && <p className="auth-message error">{errorMessage}</p>}
          {successMessage && <p className="auth-message success">{successMessage}</p>}
        </div>

        {/* Signup Form Section */}
        <div className="form-container sign-up-container">
          <h2>Create Account</h2>
          <p className="form-helper">Join us to start compiling your BookNest.</p>
          
          <input
            type="text"
            name="user_name"
            placeholder="Name"
            value={formData.user_name}
            onChange={handleInputChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="genres"
            placeholder="Favorite Genres (comma-separated)"
            value={formData.genres}
            onChange={handleInputChange}
          />
          <button onClick={handleSignup} className="auth-btn">Create Account</button>
          <p className="mobile-toggle-link" onClick={toggleMode}>
            Already have an account? <span>Login</span>
          </p>
          {errorMessage && <p className="auth-message error">{errorMessage}</p>}
          {successMessage && <p className="auth-message success">{successMessage}</p>}
        </div>

        {/* Overlay Section */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>Keep tracking your reading progress and managing your collections.</p>
              <button onClick={toggleMode} className="ghost-btn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Hello, Reader!</h2>
              <p>Sign up to start organizing your personal library list today.</p>
              <button onClick={toggleMode} className="ghost-btn">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
