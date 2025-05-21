import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authenticateRoute from './routes/authenticateRoute.js'
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB erfolgreich verbunden");
})
.catch((err) => {
  console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err.message);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


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


app.get( "/", (req, res) => {
  res.send("Server is ready");
});

app.use("/user", authenticateRoute);
// 🔵 GET /api/tasks
app.get("/login", (req, res) => {
  res.json(tasks);
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
