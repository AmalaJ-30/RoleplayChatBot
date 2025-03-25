import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css"; 


function Home() {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    navigate("/userChat"); // Redirects to the chat page
  }
  return (
    <div className="home-container">
     <h1 className="home-title">
      <span className="highlight-text">New Here? <br></br></span> 
      <Link to="/signup"> Create an Account</Link>
    </h1>
      
       {/* Login Form */}
       <div className="login-form">
        <input type="text" placeholder="Username" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>

      <p className="warning-text">
        Please note that the conversations you are about to have are with AI bots. <br />
        You are <strong>NOT</strong> talking to real celebrities.
      </p>

      <p className="disclaimer">
        We will not be held accountable for actions you commit based on your conversations with this bot.
      </p>

     
    </div>
  );
}

export default Home;