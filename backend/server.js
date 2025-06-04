import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Member from "./models/Member.js";
import authenticateRoute from "./routes/authenticateRoute.js";
import authenticate from "./middleware/authenticate.js";

// 📦 Config
dotenv.config();
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3001;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB verbunden");
  })
  .catch((err) => {
    console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err.message);
  });

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 Authentifizierungs-Routen
app.use("/user", authenticateRoute);

// 🟢 Beispiel-Aufgabenrouten (mit auth)
app.use("/api/tasks", authenticate);
let tasks = [];

app.post("/api/tasks", (req, res) => {
  const { category, subCategory, date, priority, description } = req.body;
  if (!category || !date || !priority || !description) {
    return res.status(400).json({ message: "Bitte alle Pflichtfelder ausfüllen." });
  }
  const newTask = {
    id: Date.now(),
    category,
    subCategory,
    date,
    priority,
    description,
  };
  tasks.push(newTask);
  res.status(201).json({ message: "Aufgabe gespeichert!", task: newTask });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// 🔵 Liste aller Mitglieder
app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Mitglieder" });
  }
});

// 🟢 Neues Mitglied hinzufügen
app.post("/api/members", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name ist erforderlich" });
  }

  try {
    const exists = await Member.findOne({ name });
    if (exists) {
      return res.status(409).json({ error: "Mitglied existiert bereits" });
    }

    const newMember = new Member({ name });
    await newMember.save();
    res.status(201).json({ message: "Mitglied hinzugefügt", member: newMember });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// 🧪 Test-Route
app.get("/", (req, res) => {
  res.send("🚀 Server läuft");
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Backend läuft auf http://localhost:${PORT}`);
});
