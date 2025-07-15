import express from "express";
import Sprint from "../models/Sprint.js";

const router = express.Router();

// POST – Neuen Sprint speichern
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newSprint = new Sprint({ title, description });
    await newSprint.save();
    res.status(201).json(newSprint);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Speichern", error: err });
  }
});

// GET – Alle Sprints
router.get("/", async (req, res) => {
  try {
    const sprints = await Sprint.find().sort({ createdAt: -1 });
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Laden", error: err });
  }
});

export default router;
