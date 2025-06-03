import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registrierung
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }

    const newUser = new User({ fullname, username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "Benutzer erfolgreich registriert",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registrierungsfehler:", error);
    res.status(500).json({ message: "Interner Serverfehler", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });
    }

    // JWT Token erstellen
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Anmeldung erfolgreich",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        roles: user.roles
      },
      token // Token zurückgeben
    });
  } catch (error) {
    console.error("Login-Fehler:", error);
    res.status(500).json({ message: "Interner Serverfehler", error: error.message });
  }
});

export default router;
