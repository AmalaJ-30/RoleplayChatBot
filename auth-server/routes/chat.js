import express from "express";
import { authMiddleware } from "../middlewarefolder/authMiddleware.js";
import Chat from "../models/chatSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename =fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Aliases
const aliasesPath = path.join(__dirname, "../aliases.json");
const aliases = JSON.parse(fs.readFileSync(aliasesPath, "utf-8"));

// Flatten alias map for quick lookup
function resolveAlias(inputName) {
  const lowerInput = inputName.trim().toLowerCase();

  // 1. Direct famous person match
  if (famousPeople.some(name => name.toLowerCase() === lowerInput)) {
    return inputName;
  }

  // 2. Alias match → return canonical name
  for (const [canonical, aliasList] of Object.entries(aliases)) {
    if (
      aliasList.some(alias => alias.toLowerCase() === lowerInput) ||
      canonical.toLowerCase() === lowerInput
    ) {
      return canonical; // always return the "real" name
    }
  }

  return null; // not found
}


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
     
    const resolvedName = resolveAlias(person);

    if (!resolvedName) {
      return res.status(400).json({
        message: "Oops, not famous enough for me to know 'em. Try someone actually important 😉",
      });
    }
  const isFamous = famousPeople.some(
    (name) => name.toLowerCase() === person.trim().toLowerCase()
  );

  if (!isFamous) {
    return res.status(400).json({ message: "This person is not in the famous people list." });
  } 
    const chat = new Chat({
      userId: req.user.id,
      person: resolvedName,
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

/*
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { person, role, messages } = req.body;

    const resolvedName = resolveAlias(person);

    if (!resolvedName) {
      return res.status(400).json({
        message: "Oops, not famous enough for me to know 'em. Try someone actually important 😉",
      });
    }

    const chat = new Chat({
      userId: req.user.id,
      person: resolvedName,  // ✅ Always save canonical name
      role,
      messages: messages || [],
    });

    const savedChat = await chat.save();
    res.json(savedChat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Server error" });
  }
});

*/

router.get("/famous-people", (req, res) => {
  res.json(famousPeopleArray); // send the array from famousPeople.json
});

// Update messages for a specific chat
router.put("/:id/messages", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { messages } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: { messages } }, //never change this, this is why your images stay
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
router.put("/:id/rename", authMiddleware, async (req, res) => {
//  console.log("[Backend] Rename route hit:", req.params.id, req.body);
  try {

    // Check famous person validity
const resolvedName = resolveAlias(req.body.person);
if (!resolvedName) {
  return res.status(400).json({
    message: "Oops, not famous enough for me to know 'em. Try someone actually important 😉",
  });
}

const isFamous = famousPeople.some(
  (name) => name.toLowerCase() === req.body.person.trim().toLowerCase()
);
if (!isFamous) {
  return res.status(400).json({ message: "This person is not in the famous people list." });
}

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

/*router.post("/:id/image", async (req, res) => {
  try {
    const { chatId, person, role } = req.body;

    // 1. Check chat
    let chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // 2. Return cached image if exists
    if (chat.image_url) {
      return res.json({ image_url: chat.image_url });
    }

    // 3. Otherwise call FastAPI image generator
    const response = await fetch("http://localhost:8001/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: chatId, person, role })
    });

    const data = await response.json();

    if (!data.image_url) {
      return res.status(500).json({ error: "Image generation failed" });
    }

    // 4. Save in DB
    chat.image_url = data.image_url;
    await chat.save();

    // 5. Return new image URL
    res.json({ image_url: chat.image_url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
*/

router.post("/:id/image", authMiddleware, async (req, res) => {
  try {
    const { person, role } = req.body;
    const { id } = req.params;

    console.log("🎯 Image gen request:", { id, person, role, user: req.user });

    // 1. Find chat with correct user
    let chat = await Chat.findOne({ _id: id, userId: req.user.id });
    if (!chat) {
      console.log("❌ Chat not found in DB:", id, "for user:", req.user.id);
      return res.status(404).json({ error: "Chat not found" });
    }
    console.log("✅ Found chat:", chat._id, "existing image:", chat.image_url);

    // 2. Return cached
    if (chat.image_url && !req.body.forceRegenerate) {
      console.log("📦 Returning cached image:", chat.image_url.substring(0,50));
      return res.json({ image_url: chat.image_url });
    }

    // 3. Call FastAPI
    const response = await fetch(`http://127.0.0.1:8001/chats/${id}/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: id, person, role })
    });

    const data = await response.json();
    console.log("🖼️ FastAPI response:", Object.keys(data));

    if (!data.image_url) {
      return res.status(500).json({ error: "Image generation failed" });
    }

    // 4. Save in DB
    chat.image_url = data.image_url;
    await chat.save();
    console.log("💾 Saved image_url to chat:", chat._id);

    // 5. Return
    res.json({ image_url: chat.image_url });

  } catch (err) {
    console.error("❌ Error in /:id/image:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/*router.post("/:id/image", authMiddleware, async (req, res) => {
  try {
    const { person, role } = req.body;
    const { id } = req.params;

    let chat = await Chat.findOne({ _id: id, userId: req.user.id });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    if (chat.image_url) {
      return res.json({ image_url: chat.image_url });
    }

    const response = await fetch(`http://127.0.0.1:8001/chats/${id}/image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: id, person, role })
    });

    const data = await response.json();

    if (!data.image_url) {
      return res.status(500).json({ error: "Image generation failed" });
    }

    // ⬇️ Save base64 to file locally
    const base64Data = data.image_url.replace(/^data:image\/png;base64,/, "");
    const fileName = `${id}-${Date.now()}.png`;
    const filePath = path.join("uploads", fileName);

    fs.writeFileSync(filePath, base64Data, "base64");

    // Create a URL pointing to this file
    const publicUrl = `http://localhost:5000/uploads/${fileName}`;

    chat.image_url = publicUrl;
    await chat.save();

    res.json({ image_url: chat.image_url });

  } catch (err) {
    console.error("❌ Error in /:id/image route:", err);
    res.status(500).json({ error: "Server error" });
  }
});*/


export default router;
