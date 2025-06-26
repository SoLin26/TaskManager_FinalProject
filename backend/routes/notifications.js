import express from "express";
const router = express.Router();

router.post("/marketing-consent", (req, res) => {
  const { consent } = req.body;
  console.log("Marketing Consent:", consent); // true oder false

  // ➕ Tu peux ici sauvegarder dans la DB si besoin
  res.json({ message: "Einstellung gespeichert", consent });
});

export default router;