import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Benutzerregistrierung
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Prüfen, ob Benutzer bereits existiert
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: "Benutzer existiert bereits"
      });
    }
    
    // Neuen Benutzer erstellen
    const newUser = new User({
      username,
      email,
      password
    });
    
    // In der Datenbank speichern (Passwort wird automatisch gehasht)
    await newUser.save();
    
    // Antwort ohne Passwort senden
    res.status(201).json({
      message: "Benutzer erfolgreich registriert",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registrierungsfehler:", error);
    res.status(500).json({
      message: "Interner Serverfehler",
      error: error.message
    });
  }
});

// Einloggen (Basic Auth Testen)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Benutzer in DB finden
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({
        message: "Ungültige Anmeldedaten"
      });
    }
    
    // Passwort überprüfen
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Ungültige Anmeldedaten"
      });
    }
    
    // Auth-Erfolg
    res.status(200).json({
      message: "Anmeldung erfolgreich",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login-Fehler:", error);
    res.status(500).json({
      message: "Interner Serverfehler",
      error: error.message
    });
  }
});

export default router;