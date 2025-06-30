// backend/routes/boards.js
import express from "express";
import crypto from "crypto";

import Board from "../models/Board.js";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";       //  neu
import { sendemail } from "../utils/sendemail.js";    //  neu
import auth from "../middleware/authenticate.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* Alle Boards holen, auf die der angemeldete Nutzer Zugriff hat              */
/* -------------------------------------------------------------------------- */
router.get("/", auth, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user.id }, { "members.user": req.user.id }],
    }).populate("owner members.user", "fullname email");

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden der Boards" });
  }
});

/* -------------------------------------------------------------------------- */
/* Einzelnes Board per ID                                                     */
/* -------------------------------------------------------------------------- */
router.get("/:id", auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("owner", "fullname email")
      .populate("members.user", "fullname email");

    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden des Boards" });
  }
});

/* -------------------------------------------------------------------------- */
/* Neues Board erstellen                                                      */
/* -------------------------------------------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const board = new Board({
      title: req.body.title,
      description: req.body.description,
      owner: req.user.id,
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Erstellen des Boards" });
  }
});

/* -------------------------------------------------------------------------- */
/* Board aktualisieren                                                        */
/* -------------------------------------------------------------------------- */
router.put("/:id", auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });

    if (!board.owner.equals(req.user.id))
      return res.status(403).json({ message: "Keine Berechtigung" });

    board.title = req.body.title || board.title;
    board.description = req.body.description || board.description;
    await board.save();

    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Aktualisieren des Boards" });
  }
});

/* -------------------------------------------------------------------------- */
/* Einladung eines Nutzers (registriert ODER nicht registriert)               */
/* -------------------------------------------------------------------------- */
router.post("/:id/invite", auth, async (req, res) => {
  const { email, role = "viewer" } = req.body;

  try {
    /* Board‑ und Owner‑Checks */
    const board = await Board.findById(req.params.id);
    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });
    if (!board.owner.equals(req.user.id))
      return res.status(403).json({ message: "Keine Berechtigung" });

    /* Prüfen, ob der Benutzer bereits existiert */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      /* ── Registrierter Nutzer ──────────────────────────────────────────── */
      const alreadyMember = board.members.find((m) =>
        m.user.equals(existingUser._id)
      );
      if (alreadyMember)
        return res
          .status(400)
          .json({ message: "Benutzer ist bereits Mitglied" });

      board.members.push({ user: existingUser._id, role });
      await board.save();

      return res
        .status(200)
        .json({ message: "Registrierten Benutzer hinzugefügt", board });
    }

    /* ── Nicht registrierter Nutzer: Einladung erstellen & Mail senden ─── */
    const token = crypto.randomBytes(32).toString("hex");

    await Invitation.findOneAndUpdate(
      { email, boardId: board._id },           // Suchkriterium
      { email, role, token, boardId: board._id, createdAt: new Date() },
      { upsert: true }
    );

    await sendemail(email, token, board.title);

    res.status(200).json({ message: "Einladung per E‑Mail gesendet" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Einladen" });
  }
});

/* -------------------------------------------------------------------------- */
/* Board löschen                                                              */
/* -------------------------------------------------------------------------- */
router.delete("/:id", auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board)
      return res.status(404).json({ message: "Board nicht gefunden" });

    if (!board.owner.equals(req.user.id))
      return res
        .status(403)
        .json({ message: "Keine Berechtigung zum Löschen" });

    await board.deleteOne();

    res.status(200).json({ message: "Board gelöscht" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen des Boards" });
  }
});

export default router;
