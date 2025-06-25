import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// ✅ Registrierung
router.post("/register", async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullname, username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 3600000,
      })
      .status(201)
      .json({
        message: "Benutzer erfolgreich registriert",
        user: {
          id: newUser._id,
          fullname: newUser.fullname,
          username: newUser.username,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.error("Registrierungsfehler:", error);
    next(error);
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: false,
      sameSite: "Lax",
    });

    res.status(200).json({
      message: "Anmeldung erfolgreich",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      token,
    });
  } catch (error) {
    console.error("Login-Fehler:", error);
    res.status(500).json({ message: "Interner Serverfehler", error: error.message });
  }
});

// ✅ Authentifizierter Zugriff über Cookie
router.get("/me", (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({ msg: "Kein Token vorhanden." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ msg: "Erfolgreich!", user: payload });
  } catch (error) {
    return res.status(403).json({ msg: "Token ungültig." });
  }
});

export default router;
