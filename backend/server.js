import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authenticateRoute from './routes/authenticateRoute.js';
import todoRoutes from './routes/todos.js'; // ✅ ToDo-Routen importieren

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verbindung zur MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB erfolgreich verbunden"))
  .catch((err) => console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err.message));

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use("/user", authenticateRoute);       // 🔐 Authentifizierung
app.use("/api/todos", todoRoutes);         // 📝 ToDo-API

// Test-Route
app.get("/", (req, res) => {
  res.send("🚀 Server läuft!");
});

// Server starten
app.listen(PORT, () => {
  console.log(`🌍 Server läuft auf http://localhost:${PORT}`);
});
