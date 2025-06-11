import express from "express";
import Board from "../models/Board.js";
import User from "../models/User.js";
import auth from "../middleware/authenticate.js";

const router = express.Router();

// Alle Boards, auf die der Nutzer Zugriff hat - werden korrekt angezeigt
router.get("/", auth, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { owner: req.user.id },
        { "members.user": req.user.id }
      ]
    }).populate("owner members.user", "fullname email");

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden der Boards" });
  }
});

// Einzelnes Board per ID laden - muss Einladung erste klappen
router.get("/:id", auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("owner", "fullname email")
      .populate("members.user", "fullname email");

    if (!board) {
      return res.status(404).json({ message: "Board nicht gefunden" });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden des Boards" });
  }
});

// Neues Board erstellen  klappt
router.post("/", auth, async (req, res) => {
  try {
    const board = new Board({
      title: req.body.title,
      owner: req.user.id
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Erstellen des Boards" });
  }
});

// Einladung eines Viewers  klappt noch nicht!!!
router.post("/:id/invite", auth, async (req, res) => {
  const { email } = req.body;
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board nicht gefunden" });

    if (!board.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Keine Berechtigung" });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) return res.status(404).json({ message: "User nicht gefunden" });

    const alreadyMember = board.members.find(m => m.user.equals(userToInvite._id));
    if (alreadyMember) return res.status(400).json({ message: "Benutzer ist bereits Mitglied" });

    board.members.push({ user: userToInvite._id, role: "viewer" });
    await board.save();

    res.status(200).json({ message: "Benutzer eingeladen", board });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Einladen" });
  }
});

export default router;
