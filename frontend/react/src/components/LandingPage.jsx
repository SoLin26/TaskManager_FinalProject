import React, { useState } from 'react';
import './LandingPage.css';

function LandingPage({ onLogin }) {
  const [isLoginOpen, setLoginOpen] = useState(false);

  const handleLoginToggle = () => {
    setLoginOpen(!isLoginOpen);
  };

  return (
    <div className="landing-page">
      <div className="top-bar-blue">
        <button className="login-button" onClick={handleLoginToggle}>
          🔑 Login
        </button>
      </div>
      <div className="top-bar-gray"></div>

      <div className="landing-wrapper">
        <div className="landing-content">
          <h1 className="landing-title">
            Erfasse, organisiere und erledige deine Aufgaben von überall aus.
          </h1>
          <p className="landing-subtitle">
            Entfliehe der Unordnung und entfessle deine Produktivität mit <strong>TaskHero</strong>.
          </p>
          <input
            type="email"
            placeholder="E-Mail-Adresse eingeben"
            className="landing-input"
          />
          <button className="landing-button" onClick={onLogin}>
            🚀 Jetzt registrieren – es ist kostenlos!
          </button>
          <p className="landing-terms">
            Durch Eingabe meiner E-Mail-Adresse erkenne ich die
            <a href="#"> Datenschutzrichtlinie</a> an.
          </p>
          <button className="landing-video-button">🎥 Video ansehen</button>
        </div>

        <div className="landing-image">
          <img
            src="https://placekitten.com/420/300"
            alt="Produktivitätstool Vorschau"
          />
        </div>
      </div>

      {isLoginOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleLoginToggle}>&times;</span>
            <h2>Login</h2>
            <input type="email" placeholder="E-Mail-Adresse" className="modal-input" />
            <input type="password" placeholder="Passwort" className="modal-input" />
            <button className="modal-button" onClick={onLogin}>Einloggen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
