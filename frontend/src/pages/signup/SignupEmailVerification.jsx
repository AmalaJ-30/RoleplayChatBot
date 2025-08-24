// frontend/src/pages/signup/SignupEmailVerification.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function SignupEmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  const handleVerification = async (isApproved) => {
    try {
      const res = await fetch(
        `${API_BASE}/auth/verify-email?token=${token}&approve=${isApproved}`, // adjust to your backend
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
      background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)", 
      color: "white",
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
    }}
  >
    {/* Glassy Card Wrapper */}
    <div
      style={{
        background: "rgba(0, 0, 0, 0.4)",   // semi-transparent overlay
        backdropFilter: "blur(12px)",       // frosted glass effect
        borderRadius: "12px",
        padding: "40px",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem" }}>
        Verify Your Email
      </h1>

      <p style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "2rem" }}>
        You signed up for my <strong>Roleplay Chat Box</strong> app with this
        email. Please click <span style={{ color: "#4ade80" }}>YES</span> if it
        was you, or <span style={{ color: "#f87171" }}>NO</span> if it was not.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button
          onClick={() => handleVerification(true)}
          style={{
            background: "linear-gradient(to right, #3b82f6, #60a5fa)", // YES
            color: "white",
            padding: "0.6rem 1.8rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, opacity 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.opacity = "0.9";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.opacity = "1";
          }}
        >
          YES
        </button>

        <button
          onClick={() => handleVerification(false)}
          style={{
            background: "linear-gradient(to right, #ef4444, #f87171)", // NO
            color: "white",
            padding: "0.6rem 1.8rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, opacity 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.opacity = "0.9";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.opacity = "1";
          }}
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
  </div>
);

}