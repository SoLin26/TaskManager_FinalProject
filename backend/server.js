import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authenticateRoute from "./routes/authenticateRoute.js";
import todoRoutes from "./routes/todos.js";
import boardRoutes from "./routes/boards.js";
import Member from "./models/Member.js";
import notificationsRoute from "./routes/notifications.js";
import helmet from "helmet";

dotenv.config();

const app = express();
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// MongoDB verbinden
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err.message));


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());




app.use("/api/notifications", notificationsRoute);
// ✅ Middleware vor den Routen definieren!



// ✅ Auth-Route
app.use("/api/auth", authenticateRoute);

// ✅ Geschützte Routen
app.use("/user", authenticateRoute);
app.use("/api/todos", todoRoutes);
app.use("/api/boards", boardRoutes);

// Aufgabenrouten (Testdaten)
let tasks = [];
app.post("/api/tasks", (req, res) => {
   console.log("Aufgabe empfangen:", req.body);
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
// Einladung
app.post("/api/invite", (req, res) => {
  const { email, role } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Ungültige E-Mail" });
  }

  console.log(`📨 Einladung an ${email} als ${role} gesendet.`);
  res.status(200).json({ success: true });
});

// Mitglieder-API
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
// Testroute
app.get("/", (req, res) => {
  res.send(":rocket: Server läuft");
});
app.use((err,req,res,next)=>{
  console.error('Error found',err)
  //res.status(500).json({msg : "Internal Server Error"})
  res.sendStatus(500)
})
app.listen(PORT, () => {
  console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
});
