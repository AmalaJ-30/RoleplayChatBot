import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './Signup.module.css'; // Import CSS
import SignupForm from "../../components/SignupForm.jsx";
function Signup() {
  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = () => {
    navigate("/"); // Redirect to home after signing up
  };

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.signupContainer}>
    <h1 className={styles.signupTitle}>Welcome to my Roleplay Chatbot</h1>
    <p className={styles.signupSubtitle}>Please enter your info below:</p>
  
      <div className={styles.signupForm}>
  <SignupForm
    inputClass={styles.inputField}
    buttonClass={styles.signupButton}
    formClass={styles.signupForm}
  />
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
/*<div className={styles.signupForm}>
  <SignupForm />
</div>*/