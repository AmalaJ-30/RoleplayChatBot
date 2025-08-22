import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import Modal from "../../components/Modal.jsx";
import { api } from "../../api.js";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const handleLogin = async () => {
    setError(""); // Clear old errors

    try {
      console.log('API base =', import.meta.env.VITE_API_URL);
       const res = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});

     if (res.status === 403) {
  const data = await res.json();
  setModalMessage(data.message || "Login failed.");
  return;
} //take out the numbers from the invalid maessages

      if (!res.ok) {
  const data = await res.json();
  setModalMessage(data.message || "Invalid username or password 3.");
  return;
}


        const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/userChat");

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

 const handleForgotPassword = async () => {
  if (!username) {
    alert("Please enter your username or email first.");
    return;
  }

  try {
    const res = await api.post('/auth/forgot-password', { usernameOrEmail: username });
    alert(res.message || "Password reset email sent.");
  } catch (err) {
    console.error("Forgot password error:", err);
    alert(err.message || "Something went wrong. Please try again.");

  }
};


  return (
    <div className={styles.pageWrapper}>
    <div className={styles.homeContainer}>
      <div className={styles.loginBox}> {/* 🧊 NEW WRAPPER DIV */}

        <h1 className={styles.title}>
          <span className={styles.highlightText}>New Here? <br /></span>
          <Link to="/signup"> Create an Account</Link>
        </h1>

        <div className={styles.loginForm}>
         <input
  type="text"
  placeholder="Username"
  className={styles.inputField}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
<input
  type="password"
  placeholder="Password"
  className={styles.inputField}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
        
        <button className={styles.loginButton} onClick={handleLogin}>Login</button>

 <p 
  className={styles.forgotPassword}
  onClick={handleForgotPassword}
>
  Forgot Password?
</p>

        <p className={styles.warningText}>
          Please note that the conversations you are about to have are with AI bots. <br />
          You are <strong>NOT</strong> talking to real historical figures.
        </p>

        <p className={styles.disclaimer}>
         I will not be held accountable for actions you commit based on your conversations with this bot.
        </p>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

</div>
      </div> {/* 🧊 END NEW WRAPPER DIV */}
    </div>
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );


}


export default Home;