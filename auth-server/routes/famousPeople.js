import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Resolve the file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../famousPeople.json");

// Load JSON synchronously (safe here because it’s tiny)
const famousPeopleArray = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// GET all famous people
router.get("/famous-people", (req, res) => {
  res.json(famousPeopleArray);
});

export default router;
