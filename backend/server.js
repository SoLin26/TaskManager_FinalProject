// 📁 server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// 🔃 Routes & Models
import Member from "./models/Member.js";
import authenticateRoute from "./routes/authenticateRoute.js";
import todoRoutes from "./routes/todos.js";
import boardRoutes from "./routes/boards.js";
import columnRoutes from "./routes/column.js";
import ColumnDetails from "../frontend/src/page/ColumnDetails.jsx"; // ou où tu l'as placé

<Route path="/column/:columnName" element={<ColumnDetails />} />


// 📦 Chargement des variables d'environnement
dotenv.config();

// 📡 Configuration de la base de données MongoDB
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err.message));

// 🚀 Initialisation d'Express
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Authentification
app.use("/user", authenticateRoute);

// ✅ API Routes
app.use("/api/todos", todoRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/column", columnRoutes);

// 📋 Simulierte Aufgaben (en mémoire)
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

// 📬 Invitation simulée
app.post("/api/invite", (req, res) => {
  const { email, role } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Ungültige E-Mail" });
  }
  console.log(`📨 Einladung an ${email} als ${role} gesendet.`);
  res.status(200).json({ success: true });
});

// 👥 Membres
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
  if (!name) return res.status(400).json({ error: "Name ist erforderlich" });

  try {
    const exists = await Member.findOne({ name });
    if (exists) return res.status(409).json({ error: "Mitglied existiert bereits" });

    const newMember = new Member({ name });
    await newMember.save();
    res.status(201).json({ message: "Mitglied hinzugefügt", member: newMember });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Speichern" });
  }
});

// 🔍 Test-Route
app.get("/", (req, res) => {
  res.send("🚀 Server läuft");
});

// 🚀 Start du Serveur
app.listen(PORT, () => {
  console.log(`🚀 Backend läuft auf http://localhost:${PORT}`);
});