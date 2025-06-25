import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullname, username, email, password: hashedPassword });
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
    //res.status(500).json({ message: "Interner Serverfehler", error: error.message });
    next(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
   
    
    if (!user) {
      
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });
    }
    console.log(password,user.password);
    
    const validPassword = await bcrypt.compare(password, user.password);
  
    if (!validPassword) {
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
  // ✅ Définir le cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 heure
      secure: false, // true si HTTPS
      sameSite: "Lax",
    });

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

// Middleware zur Token-Authentifizierung (Optional, hier als Beispiel)
 const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
router.get('/me', (req, res, next) => {
  // Retrieve the token from the HTTP-only cookie
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  

  try {
    if (!token) {
      return res.status(401).json({ msg: 'No token provided!' });
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.SECRET_JWT);
    console.log(payload);

    if (!payload) {
      return res.status(401).json({ msg: 'Invalid token!' });
    }

    return res.json({ msg: 'Successful!', user: payload });
  } catch (error) {
    next(error);
  }
});

export default router;

 