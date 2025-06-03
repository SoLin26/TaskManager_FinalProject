import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authenticateRoute from "./routes/authenticateRoute.js";
import authenticate from "./middleware/authenticate.js";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB erfolgreich verbunden");
  })
  .catch((err) => {
    console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err.message);
  });

const app = express(); // **WICHTIG: Erst hier express app erstellen**

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Beispiel: Alle Tasks-Routen sind nur für authentifizierte U
app.use("/api/tasks", authenticate);

// Simulierter Speicher für Aufgaben (später mit DB ersetzen)
let tasks = [];

// 🟢 POST /api/tasks → Neue Aufgabe hinzufügen
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
  console.log("Neue Aufgabe gespeichert:", newTask);

  res.status(201).json({ message: "Aufgabe erfolgreich gespeichert!", task: newTask });
});

// 🔵 GET /api/tasks → Alle Aufgaben anzeigen
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Test-Route
app.get("/", (req, res) => {
  res.send("Server is ready");
});

// ** Authentifizierungs-Route **
// => Hier sind deine Register/Login-Routen mit JWT-Logik
app.use("/user", authenticateRoute);

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
