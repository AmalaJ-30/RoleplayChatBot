import express from "express";
import { authMiddleware } from "../middlewarefolder/authMiddleware.js";
import Chat from "../models/chatSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename =fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read famousPeople.json manually import famousPeople from "../famousPeople.json" assert { type: "json" }; did not work
const famousPeople = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../famousPeople.json"), "utf-8")
);
const router = express.Router();

/*router.put(
  "/:id",
  (req, res, next) => {
    console.log("[Backend] PUT /chats/:id route hit before auth");
    next();
  },
  authMiddleware,
  async (req, res) => {
    console.log("[Backend] Passed auth, updating chat...");

    try {
      const updatedChat = await Chat.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { person: req.body.person, role: req.body.role },
        { new: true }
      );

      if (!updatedChat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      console.log("[Backend] Updated chat:", updatedChat);
      res.json(updatedChat);
    } catch (err) {
      console.error("Error updating chat:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);*/
 
// Get all chats for logged in user
router.get("/", authMiddleware, async (req, res) => {
  console.log("[AuthMiddleware] Headers:", req.headers);
  const chats = await Chat.find({ userId: req.user.id });
  res.json(chats);
});

// Save a new chat
router.post("/", authMiddleware, async (req, res) => {
  try {

     // Check if person is in famous people list (case insensitive)
     const { person, role, messages } = req.body;
  const isFamous = famousPeople.some(
    (name) => name.toLowerCase() === person.trim().toLowerCase()
  );

  if (!isFamous) {
    return res.status(400).json({ message: "This person is not in the famous people list." });
  } 
    const chat = new Chat({
      userId: req.user.id,
      person: req.body.person,
      role: req.body.role,
      messages: req.body.messages || [],
    });

    const savedChat = await chat.save();
    res.json(savedChat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/famous-people", (req, res) => {
  res.json(famousPeopleArray); // send the array from famousPeople.json
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

// GET single chat
router.get("/:id", authMiddleware, async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  res.json(chat);
});

// DELETE chat
router.delete("/:id", async (req, res) => {
  try {
    const deletedChat = await Chat.findByIdAndDelete(req.params.id);
    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ message: "Server error" });
  }
});
//rename
router.put("/:id", authMiddleware, async (req, res) => {
//  console.log("[Backend] Rename route hit:", req.params.id, req.body);
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      
      { _id: req.params.id, userId: req.user.id },
      { person: req.body.person, role: req.body.role },
      { new: true }
    );
    
    console.log("[Backend] Updated chat result:", updatedChat);
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(updatedChat);
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
