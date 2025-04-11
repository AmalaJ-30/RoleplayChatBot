import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './Signup.module.css'; // Import CSS

function Signup() {
  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = () => {
    navigate("/"); // Redirect to home after signing up
  };

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.signupContainer}>
    <h1 className={styles.signupTitle}>Welcome to Our Roleplay Chatbot</h1>
    <p className={styles.signupSubtitle}>Please enter your info below:</p>
  
    <div className={styles.signupForm}>
      <input type="text" placeholder="First Name" className={styles.inputField} />
      <input type="text" placeholder="Last Name" className={styles.inputField} />
      <input type="email" placeholder="Email Address" className={styles.inputField} />
      <input type="text" placeholder="Create Username" className={styles.inputField} />
      <input type="password" placeholder="Create Password" className={styles.inputField} />
      <br />
      <button className={styles.signupButton} onClick={handleSignup}>Signup</button>
    </div>
  
    <p className={styles.signupMessage}>
      After signing up, you will be taken back to the home page to log in with the information you just created.  
      <br />Thank you for joining us!
    </p>
  </div>
   </div>
  );
}

export default Signup;