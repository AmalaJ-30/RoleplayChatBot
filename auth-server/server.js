import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import famousPeopleRoutes from "./routes/famousPeople.js";

dotenv.config();

const app = express();


app.use(cors({
  origin: ["http://localhost:5173", "https://stellar-pavlova-647c52.netlify.app", "https://theairoleplay.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
//app.options("*", cors());
app.use(express.json());
// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);   // includes /:id/image
app.use("/api", famousPeopleRoutes);
//app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Auth server is running!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
