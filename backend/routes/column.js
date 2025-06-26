// 📁 routes/column.js
import express from "express";
import Board from "../models/Board.js";

const router = express.Router();

// ➕ Ajouter une carte à une colonne
router.post("/add-card", async (req, res) => {
  const { column, task } = req.body;

  if (!column || !task || !task.trim()) {
    return res.status(400).json({ message: "'column' et 'task' sont requis" });
  }

  try {
    let board = await Board.findOne({ title: column });

    // Si la colonne (Board) n'existe pas encore, la créer
    if (!board) {
      board = new Board({
        title: column,
        tasks: [task],
        owner: null, // ✅ Remplace ou supprime si tu ne gères pas encore l'utilisateur
      });
    } else {
      board.tasks.push(task);
    }

    await board.save();

    console.log(`✅ Carte ajoutée à "${column}": ${task}`);
    res.status(200).json({ message: `Carte ajoutée à "${column}"`, board });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

export default router;


