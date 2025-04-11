import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./home.module.css";

function Home() {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = () => {
    navigate("/userChat"); // Redirects to the chat page
  }

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.homeContainer}>
      <div className={styles.loginBox}> {/* 🧊 NEW WRAPPER DIV */}

        <h1 className={styles.title}>
          <span className={styles.highlightText}>New Here? <br /></span>
          <Link to="/signup"> Create an Account</Link>
        </h1>

        <div className={styles.loginForm}>
          <input type="text" placeholder="Username" className={styles.inputField} />
          <input type="password" placeholder="Password" className={styles.inputField} />
          <button className={styles.loginButton} onClick={handleLogin}>Login</button>
        </div>

        <p className={styles.warningText}>
          Please note that the conversations you are about to have are with AI bots. <br />
          You are <strong>NOT</strong> talking to real celebrities.
        </p>

        <p className={styles.disclaimer}>
          We will not be held accountable for actions you commit based on your conversations with this bot.
        </p>

      </div> {/* 🧊 END NEW WRAPPER DIV */}
    </div>
    </div>
  );
}

export default Home;