// routes/search.js
import express from "express";
const router = express.Router();

// Données fictives pour test
const data = [
  { type: "Aufgaben", title: "React lernen" },
  { type: "Epic", title: "Final Project" },
  { type: "Sprint", title: "Sprint 3" },
  { type: "Aufgabe", title: "CSS verbessern" },
  { type: "Übersicht", title: "Dashboard" },
];

// Route GET /api/search?q=...
router.post("/", (req, res) => {
  
const search =req.body.search.toLowerCase()
console.log(search);

  // Recherche dans `title` et `type`
  const results = data.filter((item) =>
    item.title.toLowerCase().includes(search) ||
    item.type.toLowerCase().includes(search)
  );
console.log(results);

  res.json({ results });
});

export default router;
