import React, { useEffect, useState } from "react";
import { api } from "../../api";  // adjust path if needed

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get("/auth/me");
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await api.delete("/auth/delete");
      alert("Account deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("❌ Error deleting account:", err);
      alert("Failed to delete account.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.post("/auth/forgot-password", { email: user.email });
      alert("Check your email for a reset link!");
    } catch (err) {
      console.error("❌ Error sending reset link:", err);
      alert("Failed to send reset link.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user info found</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Last Name:</strong> {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button onClick={handleResetPassword}>Reset Password</button>
      <button onClick={handleDeleteAccount} style={{ marginLeft: "10px", color: "red" }}>
        Delete Account
      </button>
    </div>
  );
}

export default Profile;