import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// Alle Aufgaben für einen bestimmten Nutzer abrufen
router.get("/:userId", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (error) {
    console.error("Fehler beim Abrufen der Aufgaben:", error);
    res.status(500).json({ message: "Fehler beim Abrufen der Aufgaben" });
  }
});

// Neue Aufgabe erstellen
router.post("/", async (req, res) => {
  try {
    const { userId, category, subCategory, date, priority, description } = req.body;
    const newTodo = new Todo({ userId, category, subCategory, date, priority, description });
    await newTodo.save();
    res.status(201).json({ message: "Aufgabe gespeichert", todo: newTodo });
  } catch (error) {
    console.error("Fehler beim Erstellen der Aufgabe:", error);
    res.status(500).json({ message: "Fehler beim Erstellen der Aufgabe" });
  }
});

// Aufgabe aktualisieren
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Aufgabe aktualisiert", todo: updatedTodo });
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    res.status(500).json({ message: "Fehler beim Aktualisieren der Aufgabe" });
  }
});

// Aufgabe löschen
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Aufgabe gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    res.status(500).json({ message: "Fehler beim Löschen der Aufgabe" });
  }
});

export default router;
