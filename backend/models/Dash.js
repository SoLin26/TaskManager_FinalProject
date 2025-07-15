// Dash.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import Board from "./models/Board.js";
import { mockAuth } from "./middleware/auth.js";

const app = express();
const PORT = 8080;

// Initiales Board, wenn User neu ist
const initialBoard = {
  "⭐ Level 1": [
    { title: "Basic Terminal Usage", tagColor: "purple" },
    { title: "Setup Guide", tagColor: "green" },
  ],
  "😃 Level 2": [],
  "🦄 Level 3": [],
  "📚 Learning": [],
  "✅ Done": [],
};

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "geheim", resave: false, saveUninitialized: true }));
app.use(mockAuth); // Test-Auth

// MongoDB verbinden
mongoose
  .connect("mongodb://127.0.0.1:27017/dash-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err));

// ----------- Routen -----------

// Hole das Board
app.get("/api/board", async (req, res) => {
  const board = await Board.findOne({ userId: req.user._id });

  if (!board) {
    const newBoard = new Board({
      userId: req.user._id,
      columns: initialBoard,
    });
    await newBoard.save();
    return res.json(newBoard);
  }

  res.json(board);
});

// Füge eine neue Karte hinzu
app.post("/api/board/:column", async (req, res) => {
  const { column } = req.params;
  const { title, tagColor } = req.body;

  const board = await Board.findOne({ userId: req.user._id });

  if (!board.columns.has(column)) {
    board.columns.set(column, []);
  }

  board.columns.get(column).push({ title, tagColor });
  await board.save();

  res.json(board);
});

// Verschiebe Karte zwischen Spalten
app.put("/api/board/move", async (req, res) => {
  const { task, from, to, fromIndex, toIndex } = req.body;
  const board = await Board.findOne({ userId: req.user._id });

  const fromTasks = board.columns.get(from);
  const toTasks = board.columns.get(to);

  fromTasks.splice(fromIndex, 1);
  toTasks.splice(toIndex, 0, task);

  board.columns.set(from, fromTasks);
  board.columns.set(to, toTasks);

  await board.save();

  res.json(board);
});

// Starte Server
app.listen(PORT, () => {
  console.log(`🚀 Backend läuft auf http://localhost:${PORT}`);
});
