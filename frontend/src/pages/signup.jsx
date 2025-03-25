import React from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css"; // Import CSS

function Signup() {
  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = () => {
    navigate("/"); // Redirect to home after signing up
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Welcome to Our Roleplay Chatbot</h1>
      <p className="signup-subtitle">Please enter your info below:</p>

      {/* Signup Form */}
      <div className="signup-form">
        <input type="text" placeholder="First Name" className="input-field" />
        <input type="text" placeholder="Last Name" className="input-field" />
        <input type="email" placeholder="Email Address" className="input-field" />
        <input type="text" placeholder="Create Username" className="input-field" />
        <input type="password" placeholder="Create Password" className="input-field" />
        <br></br>
        <button className="signup-button" onClick={handleSignup}>Signup</button>
      </div>

      {/* Message After Signup */}
      <p className="signup-message">
        After signing up, you will be taken back to the home page to log in with the information you just created.  
        <br />Thank you for joining us!
      </p>
    </div>
  );
}

export default Signup;