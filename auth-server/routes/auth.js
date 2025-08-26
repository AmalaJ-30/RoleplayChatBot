
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/automated-emails.js';
import * as crypto from 'crypto';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "../middlewarefolder/authMiddleware.js";
//import { sendPasswordResetEmail } from "../utils/automatedEmails.js";



const router = express.Router();
dotenv.config();

//const { sendVerificationEmail } = require('../utils/automated-emails');
// POST /signup
router.post('/signup', async (req, res) => {
  console.log("Signup route hit!");
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const { firstName, lastName, email, username, password } = req.body;

    // 1️⃣ Validate required fields
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2️⃣ Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already taken" });
    }

    // 3️⃣ Validate password strength
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,128}$/;
    if (!strongPassword.test(password)) {
      return res.status(400).json({ 
        message: "Password must be 8–128 characters, include a number and a symbol." 
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      verified: false,
      verificationToken
    });

    await newUser.save();

    // 6️⃣ Try sending email (but don’t block signup)
    try {
      await sendVerificationEmail(email, verificationToken);
      console.log("📧 Verification email sent:", email);
    } catch (mailErr) {
      console.error("❌ Email send failed:", mailErr);
      if (mailErr.response) {
        console.error("Postmark response:", mailErr.response.data);
      }
    }

    // 7️⃣ Respond after user is saved
    return res.status(201).json({ message: "User created successfully!" });

  } catch (err) {
    console.error("🔥 Signup error:", err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "Email or username already exists." });
    }

    return res.status(500).json({ message: "Server error during signup", error: err.message });
  }
});



// backend/routes/auth.js
/*router.post("/verify-email", async (req, res) => {
  const { token, approve } = req.query;
  
  if (!token) return res.status(400).json({ message: "Missing token" });

  if (approve === "true") {
    // mark user as verified in DB
    return res.json({ message: "Verified successfully" });
  } else {
    // reject token or delete pending signup
    return res.json({ message: "Verification canceled" });
  }
});*/

router.post("/verify-email", async (req, res) => {
  const { token, approve } = req.query;
if (!token) {
    return res.status(400).json({ message: "Missing token" });
  }

  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ message: "Invalid token" });

if (approve === "true") {
    user.verified = true;
    user.verificationToken = undefined; // clear token so it can’t be reused
    await user.save();
    return res.json({ message: "Email verified successfully" });
  } else {
    // ❌ Delete the user on rejection
    await User.deleteOne({ _id: user._id });
    return res.status(403).json({ message: "Email verification was rejected. Please sign up again." });
  }
});

router.post('/login', async (req, res) => {
  console.log("LOGIN route hit!");
  try {
    const { username, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password. Please sign up first, if you did, you may have rejected your verification email" });
    }
    
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in. If you recently signed up but chose to reject the verification email, you’ll need to register again." });
    }

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "We cannot find you in our system, please make sure your username and password are correct" });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "6h" });
    
    // 4️⃣ Success
    res.json({ message: "Login successful!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { usernameOrEmail } = req.body;
  if (!usernameOrEmail) return res.status(400).json({ message: "Username or email required" });

  const user = await User.findOne({ 
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] 
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate token & expiry
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
  await user.save();

  // Send email
  await sendPasswordResetEmail(user.email, token);

  res.json({ message: "Password reset email sent" });
});

router.put("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() } // token still valid
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Strong password check
  const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
  if (!strongPassword.test(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters, include a number and a symbol." });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  // Clear reset fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
});

// authserver/routes/auth.js this delete a PERSON'S ACCOUNT, not a chat, the chat one is in chat.js
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting account" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // don't send password hash
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;