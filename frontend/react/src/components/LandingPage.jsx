import React, { useState } from 'react';
import './LandingPage.css';

function LandingPage({ onLogin }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
          <button
            className="landing-video-button"
            onClick={() => setShowVideo(true)}
          >
            🎥 Video ansehen
          </button>

          {showVideo && (
            <div className="landing-video">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="TaskHero Erklärvideo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        <div className="landing-image">
          <img
            src="TaskHandy.png"
            alt="TaskHero App Vorschau"
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

      {/* Neue Abschnitte beginnen hier */}

      <div className="features-section">
        <h2>Funktionen von TaskHero</h2>
        <div className="features">
          <div className="feature">
            <h3>Aufgabenverwaltung</h3>
            <p>Verwalte deine Aufgaben einfach und effizient.</p>
          </div>
          <div className="feature">
            <h3>Erinnerungen</h3>
            <p>Setze Erinnerungen, um keine Fristen zu verpassen.</p>
          </div>
          <div className="feature">
            <h3>Teamarbeit</h3>
            <p>Arbeite mit deinem Team zusammen und teile Aufgaben.</p>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2>Was unsere Nutzer sagen</h2>
        <div className="testimonial">
          <p>"TaskHero hat meine Produktivität enorm gesteigert!" - Max M.</p>
        </div>
        <div className="testimonial">
          <p>"Ein unverzichtbares Tool für mein Team." - Anna K.</p>
        </div>
      </div>

      <div className="pricing-section">
        <h2>Preise</h2>
        <div className="pricing-plan">
          <h3>Basisplan</h3>
          <p>Kostenlos für Einzelbenutzer.</p>
        </div>
        <div className="pricing-plan">
          <h3>Teamplan</h3>
          <p>Für Teams ab 5 Benutzern - 10€ pro Benutzer/Monat.</p>
        </div>
      </div>

      <div className="faq-section">
        <h2>Häufig gestellte Fragen</h2>
        <div className="faq">
          <h3>Wie kann ich mich registrieren?</h3>
          <p>Einfach auf den Registrieren-Button klicken und die E-Mail-Adresse eingeben.</p>
        </div>
        <div className="faq">
          <h3>Gibt es eine mobile App?</h3>
          <p>Ja, TaskHero ist sowohl für iOS als auch für Android verfügbar.</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Bereit, deine Produktivität zu steigern?</h2>
        <button className="cta-button" onClick={onLogin}>Jetzt registrieren!</button>
      </div>

      <footer className="footer">
        <p>&copy; 2023 TaskHero. Alle Rechte vorbehalten.</p>
        <a href="#">Datenschutzrichtlinie</a>
        <a href="#">Nutzungsbedingungen</a>
      </footer>
    </div>
  );
}

export default LandingPage;
