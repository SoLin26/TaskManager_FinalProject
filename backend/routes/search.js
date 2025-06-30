// routes/search.js
import express from "express";
const router = express.Router();

// Données fictives pour test
const data = [
  { type: "Aufgabe", title: "React lernen" },
  { type: "Epic", title: "Final Project" },
  { type: "Sprint", title: "Sprint 3" },
  { type: "Aufgabe", title: "CSS verbessern" },
];

// Route GET /api/search?q=...
router.get("/", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  // Recherche dans `title` et `type`
  const results = data.filter((item) =>
    item.title.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query)
  );

  res.json({ results });
});

export default router;
