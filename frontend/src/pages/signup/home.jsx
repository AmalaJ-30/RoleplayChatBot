import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import Modal from "../../components/Modal.jsx"; 

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear old errors

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
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
        </div>

        <p className={styles.warningText}>
          Please note that the conversations you are about to have are with AI bots. <br />
          You are <strong>NOT</strong> talking to real celebrities.
        </p>

        <p className={styles.disclaimer}>
          We will not be held accountable for actions you commit based on your conversations with this bot.
        </p>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      </div> {/* 🧊 END NEW WRAPPER DIV */}
    </div>
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );


}


export default Home;