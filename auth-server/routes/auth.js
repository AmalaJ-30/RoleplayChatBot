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
    if (existingUser) return res.status(400).json({ message: 'Email or Username already taken' });

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

export default router;