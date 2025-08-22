import React, { useEffect, useState } from "react";
import { api } from "../../api";  // adjust path if needed
import styles from "./Profile.module.css";


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

  function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ This will permanently delete your account. Continue?")) return;

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
    if (!user?.email && !user?.username) {
      alert("No email or username available for reset.");
      return;
    }

    await api.post("/auth/forgot-password", { 
      usernameOrEmail: user.email || user.username 
    });

    alert("✅ Check your email for a reset link from campus mind!");
  } catch (err) {
    console.error("❌ Error sending reset link:", err);
    alert(err.message || "Something went wrong.");
  }
};


  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user info found</div>;

return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileCard}>
        <div className={styles.icon}>👤</div>
        <h2 className={styles.title}>Profile</h2>
        
        <div className="flex flex-col items-center mb-6">
  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold shadow-lg">
    {getInitials(`${user.firstName || ""} ${user.lastName || ""}`)}
  </div>
  
  <p className="text-gray-500">{user.email}</p>
</div>


        <div className={styles.infoRow}>
          <span className={styles.label}>Username:</span> {user.username}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>First Name:</span> {user.firstName}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Last Name:</span> {user.lastName}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Email:</span> {user.email}
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.resetBtn} onClick={handleResetPassword}>
            Reset Password
          </button>
          <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
        <button
  onClick={() => {
    localStorage.removeItem("token");   // clear login token
    window.location.href = "/";    // redirect to login page
  }}
  className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
>
  Log Out
</button>
      </div>
    </div>
  );
}
export default Profile;