import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../components/Agb.css";
import logoImg from "../../Photo/Logo.png";
import underConstructionImg from "../../Photo/under-construction-sign.jpg";

// Logo für Header
// Under Construction Bild

const AGBPage = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleLoginToggle = () => {
    setLoginOpen(!isLoginOpen);
    setLoginMessage("");
  };

  const handleLogin = async () => {
    if (!usernameLogin || !passwordLogin) {
      setLoginMessage("❌ Bitte Benutzername und Passwort eingeben.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameLogin,
          password: passwordLogin,
        }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setLoginMessage("❌ Fehler: " + (data.message || "Unbekannter Fehler"));
      }
    } catch (err) {
      setLoginMessage("❌ Netzwerkfehler: " + err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isLoginOpen) handleLogin();
  };

  return (
    <div className="agb-page">
      {/* Header */}
      <div className="top-bar-blue">
        <div className="logo-container">
          <a href="/">
            <img src={logoImg} alt="TaskHero Logo" className="site-logo" />
          </a>
        </div>
        <button className="login-button" onClick={handleLoginToggle}>
          🔑 Login
        </button>
      </div>

      <div className="top-bar-gray">
        <a href="/#features" className="features-link">✨ Funktionen</a>
        <a href="/#testimonials" className="features-link">✅ Nutzerstimmen</a>
        <a href="/#pricing" className="features-link">💰 Preise</a>
        <a href="/#faq" className="features-link">❓ FAQ</a>
      </div>

      {/* Inhalt */}
      <main className="agb-content">
        <h1>AGB – Seite im Aufbau</h1>
        <p>Diese Seite befindet sich aktuell im Aufbau. Schau bald wieder vorbei!</p>
         <img src="./Photo/under-construction-sign.jpg" alt="Under construction sign" className="construction" />
      </main>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleLoginToggle}>&times;</span>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Benutzername"
              className="modal-input"
              value={usernameLogin}
              onChange={(e) => setUsernameLogin(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <input
              type="password"
              placeholder="Passwort"
              className="modal-input"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="modal-button" onClick={handleLogin}>Einloggen</button>
            {loginMessage && <p className="login-message">{loginMessage}</p>}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AGBPage;
