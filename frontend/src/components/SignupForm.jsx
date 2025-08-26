import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function SignupForm({
  inputClass = "",
  buttonClass = "",
  formClass = ""
}) {
    
     const [confirmPassword, setConfirmPassword] = useState("");  
       const [confirmEmail, setConfirmEmail] = useState("");
const navigate = useNavigate();
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🚀 Signup attempt with data:", {
  ...formData,
  password: "🔒 hidden"
});

  const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
  if (!strongPassword.test(formData.password)) {
    console.log("❌ Weak password, blocking submit");
    setError("Password must be between 8 and 128 characters, include a number and a symbol");
    return;
  }
   
      if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  if (formData.email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
 
    const data = await response.json();
    console.log("📡 API response:", data);

    if (response.ok) {
      alert(`Signup successful! Please expect an email from "CampusMind" and verify your email address to be able to login`);
      navigate("/");
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("🔥 API call failed:", err);
    alert("Server error, check console.");
  }
};

  

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className={inputClass} />
      <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className={inputClass} />
      <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={inputClass} />
         <input
        name="confirmEmail"
        type="email"
        placeholder="Confirm Email Address"
        value={confirmEmail}
        onChange={(e) => setConfirmEmail(e.target.value)}
        className={inputClass}
      />
      <input name="username" placeholder="Create Username" value={formData.username} onChange={handleChange} className={inputClass} />
      <input name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} className={inputClass} />
      <input
  name="confirmPassword"
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className={inputClass}
/>

      {error && <p style={{ color: "black", marginTop: "8px" }}>{error}</p>}

      <button type="submit" className={buttonClass}>Signup</button>
      <p style={{ marginTop: "12px" }}>
      <Link to="/" style={{ color: "#ffd700", textDecoration: "underline" }}>
        ← Back to Home
      </Link>
    </p>
    <p style={{ marginTop: "8px" }}>
  <Link to="/privacy" style={{ color: "#ffd700", textDecoration: "underline" }}>
    Privacy Policy
  </Link>
</p>
    </form>
  );
}
