import express from "express";
import authenticate from "../middleware/authenticate.js";
import Board from "../models/Board.js";

const router = express.Router();

// ==============================
// GET /api/dash
// ==============================
// Holt alle Boards, bei denen der User Owner oder Member ist
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const boards = await Board.find({
      $or: [
        { owner: userId },
        { "members.user": userId }
      ]
    })
      .populate("owner", "username")
      .populate("members.user", "username");

    res.json(boards);
  } catch (error) {
    console.error("Fehler beim Laden der Dashboards:", error);
    res.status(500).json({ message: "Fehler beim Laden der Dashboards" });
  }
});

// ==============================
// POST /api/dash
// ==============================
// Erstellt ein neues Board für den User
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Titel ist erforderlich" });
    }

    const newBoard = new Board({
      title,
      description: description || "",
      owner: userId,
      members: [{ user: userId, role: "editor" }]
    });

    await newBoard.save();

    res.status(201).json({ message: "Board erfolgreich erstellt", board: newBoard });
  } catch (error) {
    console.error("Fehler beim Erstellen des Boards:", error);
    res.status(500).json({ message: "Serverfehler beim Erstellen des Boards" });
  }
});

export default router;
