import { Routes, Route } from "react-router-dom";
import Home from "./pages/signup/home.jsx"; // ⬅️ updated path
import Signup from "./pages/signup/signup.jsx";
import UserChat from "./pages/userChat/UserChat.jsx";
import SignupEmailVerification from "./pages/signup/SignupEmailVerification.jsx";
import ResetPassword from "./pages/signup/resetpasswordpage.jsx";
import Profile from "./pages/userChat/Profile.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/verify" element={<SignupEmailVerification />} />
      <Route path="/userChat" element={<UserChat />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />


    </Routes>
  );
}

export default App;