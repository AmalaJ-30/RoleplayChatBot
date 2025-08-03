import { useState } from "react";

export default function SignupForm({
  inputClass = "",
  buttonClass = "",
  formClass = ""
}) {

    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        console.log(data);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className={inputClass} />
      <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className={inputClass} />
      <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={inputClass} />
      <input name="username" placeholder="Create Username" value={formData.username} onChange={handleChange} className={inputClass} />
      <input name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} className={inputClass} />
      <button type="submit" className={buttonClass}>Signup</button>
    </form>
  );
}
