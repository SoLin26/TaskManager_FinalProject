import express from "express";
import Todo from "../models/Todo.js";
import auth from "../middleware/authenticate.js";

const router = express.Router();

// Hilfsfunktion zur Eingabevalidierung
function validateTodoInput(title, column, dueDate, boardId) {
  if (!title || !column) {
    return "Title und Column sind erforderlich.";
  }
  if (!boardId) {
    return "boardId ist erforderlich.";
  }
  if (dueDate && isNaN(Date.parse(dueDate))) {
    return "Ungültiges Datum.";
  }
  return null;
}

// GET /todos – Todos des Nutzers abrufen (optional gefiltert nach column und/oder boardId)
router.get("/", auth, async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.column) {
      filter.column = req.query.column;
    }
    if (req.query.boardId) {
      filter.boardId = req.query.boardId;
    }

    const todos = await Todo.find(filter);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Laden der Todos." });
  }
});

// POST / – Neues Todo erstellen (boardId wird benötigt)
router.post("/", auth, async (req, res) => {
  const { title, column, dueDate, boardId } = req.body;

  const validationError = validateTodoInput(title, column, dueDate, boardId);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const todo = new Todo({
      userId: req.user.id,
      boardId,
      title,
      column,
      dueDate,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Speichern des Todos." });
  }
});

// PUT /:id – Todo aktualisieren (boardId kann auch aktualisiert werden)
router.put("/:id", auth, async (req, res) => {
  const { title, column, dueDate, boardId } = req.body;

  const validationError = validateTodoInput(title, column, dueDate, boardId);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, column, dueDate, boardId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Todo nicht gefunden." });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Aktualisierung fehlgeschlagen." });
  }
});

// DELETE /:id – Todo löschen
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Todo nicht gefunden." });
    }

    res.json({ message: "Todo erfolgreich gelöscht." });
  } catch (err) {
    res.status(500).json({ message: "Löschen fehlgeschlagen." });
  }
});

export default router;