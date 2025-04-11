import { Routes, Route } from "react-router-dom";
import Home from "./pages/signup/home.jsx"; // ⬅️ updated path
import Signup from "./pages/signup/signup.jsx";
import UserChat from "./pages/userChat/UserChat.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userChat" element={<UserChat />} />
    </Routes>
  );
}

export default App;