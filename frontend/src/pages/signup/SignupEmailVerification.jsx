// frontend/src/pages/signup/SignupEmailVerification.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function SignupEmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");

  const handleVerification = async (isApproved) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/verify-email?token=${token}&approve=${isApproved}`, // adjust to your backend
        { method: "POST" }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(isApproved ? "✅ Verified! You can log in now." : "❌ Verification canceled.");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",   // changed from height
    width: "100vw",    
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "0.75rem" }}>
        Verify Your Email
      </h1>
      <p style={{ fontSize: "1rem", maxWidth: "500px", opacity: 0.9 }}>
        You signed up for our <strong>Roleplay Chat Box</strong> app with this
        email. Please click <span style={{ color: "#4ade80" }}>YES</span> if it
        was you, or <span style={{ color: "#f87171" }}>NO</span> if it was not.
      </p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => handleVerification(true)}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        >
          YES
        </button>

        <button
          onClick={() => handleVerification(false)}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
        >
          NO
        </button>
      </div>

      {message && (
        <p style={{ marginTop: "1.5rem", fontSize: "0.95rem", opacity: 0.85 }}>
          {message}
        </p>
      )}
    </div>
  );
}