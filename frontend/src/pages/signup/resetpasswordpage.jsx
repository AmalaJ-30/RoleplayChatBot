import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
import styles from "./reset-password.module.css";


export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Strong password rule
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    if (!strongPassword.test(password)) {
      alert("Password must be at least 8 characters, include a number and a symbol.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await api.put("/auth/reset-password", { token, password });
      alert(res.message || "Password reset successful!");
    } catch (err) {
      alert(err.message || "Something went wrong.");
    }
  };

 return (
  <div className={styles["reset-container"]}>
    <form className={styles["reset-form"]} onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  </div>
);

}
