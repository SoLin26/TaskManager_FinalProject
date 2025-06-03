import express from "express";
import Todo from "../models/Todo.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /todos – alle Todos des Users abrufen
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Laden der Todos" });
  }
});

// POST /neues Todo speichern
router.post("/", auth, async (req, res) => {
  const { title, column } = req.body;
  try {
    const todo = new Todo({ userId: req.user.id, title, column });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Speichern" });
  }
});

// PUT / Todo aktualisieren
router.put("/:id", auth, async (req, res) => {
  const { title, column } = req.body;
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, column },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Todo nicht gefunden" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Aktualisierung fehlgeschlagen" });
  }
});

// DELETE / – Todo löschen
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Todo nicht gefunden" });
    res.json({ message: "Todo gelöscht" });
  } catch (err) {
    res.status(500).json({ message: "Löschen fehlgeschlagen" });
  }
});

export default router;
