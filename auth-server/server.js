import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import famousPeopleRoutes from "./routes/famousPeople.js";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://stellular-pavlova-647c52.netlify.app",
  "https://theairoleplay.com",
  "https://www.theairoleplay.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (curl, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed: " + origin), false);
    }
    return callback(null, true);
  },
  credentials: true,
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
