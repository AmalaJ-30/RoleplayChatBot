import { Routes, Route } from "react-router-dom";
import Home from "./pages/signup/home.jsx"; // ⬅️ updated path
import Signup from "./pages/signup/signup.jsx";
import UserChat from "./pages/userChat/UserChat.jsx";
import SignupEmailVerification from "./pages/signup/SignupEmailVerification.jsx";
import ResetPassword from "./pages/signup/resetpasswordpage.jsx";
import Profile from "./pages/userChat/Profile.jsx";
import PrivateRoute from "./pages/userChat/PrivateRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/verify" element={<SignupEmailVerification />} />
      <Route
  path="/userchat"
  element={
    <PrivateRoute>
      <UserChat />
    </PrivateRoute>
  }
/>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />


    </Routes>
  );
}

export default App;