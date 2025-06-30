import express from "express";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import Board from "../models/Board.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/accept", async (req, res) => {
  const { token, fullname, password } = req.body;

  try {
    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      return res.status(400).json({ message: "Einladung ungültig oder abgelaufen" });
    }

    let user = await User.findOne({ email: invitation.email });

    if (!user) {
      if (!fullname || !password) {
        return res.status(400).json({ message: "Benutzer nicht gefunden, Registrierung erforderlich" });
      }
      user = new User({
        email: invitation.email,
        fullname,
        password,
      });
      await user.save();
    }

    const board = await Board.findById(invitation.boardId);
    if (!board) return res.status(404).json({ message: "Board nicht gefunden" });

    const alreadyMember = board.members.find(m => m.user.equals(user._id));
    if (!alreadyMember) {
      board.members.push({ user: user._id, role: invitation.role });
      await board.save();
    }

    await invitation.deleteOne();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token: jwtToken, boardId: board._id });
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Annehmen der Einladung" });
  }
});

export default router;
