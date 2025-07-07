import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authenticateRoute from "./routes/authenticateRoute.js";
import todoRoutes from "./routes/todos.js";
import boardRoutes from "./routes/boards.js";
import Member from "./models/Member.js";
import notificationsRoute from "./routes/notifications.js";
import searchRoutes from "./routes/search.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/notifications", notificationsRoute);
app.use("/api/auth", authenticateRoute);
app.use("/user", authenticateRoute);
app.use("/api/todos", todoRoutes);
app.use("/api/boards", boardRoutes);

app.use("/api/search", searchRoutes);



// Routes de test (membres, tâches, invitation)
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

app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/column/add-card", (req, res) => {
  const { column, task } = req.body;

  if (!column || !task) {
    return res.status(400).json({ message: "Spalte und Aufgabe sind erforderlich." });
  }

  console.log("📝 Neue Karte hinzugefügt:", { column, task });
  res.status(200).json({ message: "Karte erfolgreich hinzugefügt." });
});


app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Mitglieder" });
  }
});

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

// Test
app.get("/", (req, res) => res.send("🚀 Server läuft"));

// Erreur globale
app.use((err, req, res, next) => {
  console.error("❌ Fehler:", err);
  res.sendStatus(500);
});

// ✅ Lancer MongoDB + serveur
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB verbunden");
    app.listen(PORT, () =>
      console.log(`✅ Backend läuft auf http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err));