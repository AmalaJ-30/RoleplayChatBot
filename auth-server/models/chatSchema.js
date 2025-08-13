import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true }
}, { _id: false }); // no need for _id on each message

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  person: { type: String, required: true },
  role: { type: String, required: true },
  messages: [messageSchema]
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
