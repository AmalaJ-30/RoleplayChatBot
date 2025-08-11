import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/automated-emails.js';
import * as crypto from 'crypto';

const router = express.Router();


//const { sendVerificationEmail } = require('../utils/automated-emails');
// POST /signup
router.post('/signup', async (req, res) => {
  console.log("Signup route hit!");

  const verificationToken = crypto.randomBytes(32).toString('hex');
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // 1️⃣ Check if email or username already exists
   const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already taken' });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Save new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      verified: false,
      verificationToken: verificationToken
    });
    

// ... after saving the user to DB:
console.log("About to send verification email to:", email, verificationToken);
await sendVerificationEmail(email, verificationToken);
console.log("sendVerificationEmail finished!");

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
    user.verificationRejected = true; // mark as rejected
    user.verificationToken = undefined;
    await user.save();
    return res.json({ message: "Verification request rejected" });
  }
  
});

router.post('/login', async (req, res) => {
  console.log("LOGIN route hit!");
  try {
    const { username, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    
    if (user.verificationRejected) {
  return res.status(403).json({ message: "You have rejected email verification. Please sign up again." });
}
    // 2️⃣ Check if verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // 4️⃣ Success
    res.json({ message: "Login successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;