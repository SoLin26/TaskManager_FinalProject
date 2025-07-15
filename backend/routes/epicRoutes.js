
import express from "express";
import Epic from "../models/Epic.js";

const router = express.Router();

// GET all epics
router.get("/", async (req, res) => {
  try {
    const epics = await Epic.find().sort({ createdAt: -1 });
    res.json(epics);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Laden der Epics", error: err });
  }
});

// POST new epic
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const newEpic = new Epic({ title });
    await newEpic.save();
    res.status(201).json(newEpic);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Speichern", error: err });
  }
});

export default router;
