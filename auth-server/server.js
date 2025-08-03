import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';


dotenv.config();
console.log('POSTMARK_API_KEY:', process.env.POSTMARK_API_KEY);
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
// 1 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// 2 Test route
app.get('/', (req, res) => {
  res.send('Auth server is running!');
});

// 3️ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));