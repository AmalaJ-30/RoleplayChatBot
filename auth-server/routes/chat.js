import express from "express";
import { authMiddleware } from "../middlewarefolder/authMiddleware.js";
import Chat from "../models/chatSchema.js";

const router = express.Router();

// Get all chats for logged in user
router.get("/", authMiddleware, async (req, res) => {
  const chats = await Chat.find({ userId: req.user.id });
  res.json(chats);
});

// Save a new chat
router.post("/", authMiddleware, async (req, res) => {
  const { person, role, messages } = req.body;
  const newChat = new Chat({ userId: req.user.id, person, role, messages });
  await newChat.save();
  res.status(201).json(newChat);
});

// Update messages for a specific chat
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { messages } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { messages },
      { new: true }
    );

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
