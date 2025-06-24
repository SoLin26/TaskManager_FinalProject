import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ onLogin }) {
  const navigate = useNavigate();

  // Login Modal öffnen/schließen
  const [isLoginOpen, setLoginOpen] = useState(false);
  // Video anzeigen
  const [showVideo, setShowVideo] = useState(false);

  // Registrierung-State
  const [fullname, setFullname] = useState('');
  const [usernameReg, setUsernameReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  // Login-State
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleLoginToggle = () => {
    setLoginOpen(!isLoginOpen);
    setLoginMessage('');
  };

  // Registrierung an Backend schicken mit Validierung
  const handleRegister = async () => {
    if (!fullname || !usernameReg || !emailReg || !passwordReg) {
      setRegisterMessage('❌ Bitte fülle alle Felder aus.');
      return;
    }

    // Simple E-Mail Validierung
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailReg)) {
      setRegisterMessage('❌ Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          username: usernameReg,
          email: emailReg,
          password: passwordReg,
        }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterMessage('✅ Registrierung erfolgreich! Du kannst dich jetzt einloggen.');
        setFullname('');
        setUsernameReg('');
        setEmailReg('');
        setPasswordReg('');
      } else {
        setRegisterMessage('❌ Fehler: ' + data.message);
      }
    } catch (err) {
      setRegisterMessage('❌ Netzwerkfehler: ' + err.message);
    }
  };

  // Login an Backend schicken
  const handleLogin = async () => {
    if (!usernameLogin || !passwordLogin) {
      setLoginMessage('❌ Bitte Benutzername und Passwort eingeben.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameLogin,
          password: passwordLogin,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setLoginMessage(`✅ Login erfolgreich! Willkommen, ${data.user.fullname}`);
        setLoginOpen(false);
        setUsernameLogin('');
        setPasswordLogin('');

        // WICHTIG: Token speichern
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // App informieren
        onLogin(data.token, data.user);

        navigate('/dashboard');
      } else {
        setLoginMessage('❌ Fehler: ' + (data.message || 'Unbekannter Fehler'));
      }
    } catch (err) {
      setLoginMessage('❌ Netzwerkfehler: ' + err.message);
    }
  };

  // "Enter" drücken im Login-Modal löst Login aus
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isLoginOpen) {
      handleLogin();
    }
  };

  return (
    <div className="landing-page">
      <div className="top-bar-blue">
        <button className="login-button" onClick={handleLoginToggle}>
          🔑 Login
        </button>
      </div>

      <div className="top-bar-gray">
        <a href="#features" className="features-link">✨ Funktionen</a>
        <a href="#testimonials" className="features-link">✅ Nutzerstimmen</a>
        <a href="#pricing" className="features-link">💰 Preise</a>
        <a href="#faq" className="features-link">❓ FAQ</a>
      </div>

      <div className="landing-wrapper">
        <div className="landing-content">
          <h1 className="landing-title">
            Erfasse, organisiere und erledige deine Aufgaben von überall aus.
          </h1>
          <p className="landing-subtitle">
            Entfliehe der Unordnung und entfessle deine Produktivität mit <strong>TaskHero</strong>.
          </p>

          {/* Registrierung */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Vollständiger Name"
              className="landing-input"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Benutzername"
              className="landing-input"
              value={usernameReg}
              onChange={e => setUsernameReg(e.target.value)}
            />
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              className="landing-input"
              value={emailReg}
              onChange={e => setEmailReg(e.target.value)}
            />
            <input
              type="password"
              placeholder="Passwort"
              className="landing-input"
              value={passwordReg}
              onChange={e => setPasswordReg(e.target.value)}
            />
            <button className="landing-button" onClick={handleRegister}>
              🚀 Jetzt registrieren – es ist kostenlos!
            </button>
            {registerMessage && <p>{registerMessage}</p>}
          </div>

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
              onChange={e => setUsernameLogin(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <input
              type="password"
              placeholder="Passwort"
              className="modal-input"
              value={passwordLogin}
              onChange={e => setPasswordLogin(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="modal-button" onClick={handleLogin}>Einloggen</button>
            {loginMessage && <p>{loginMessage}</p>}
          </div>
        </div>
      )}

      {/* Funktionen */}
      <div className="features-section" id="features">
        <h2>Funktionen von TaskHero</h2>
        <div className="features">
          <div className="feature">
            <img src="/Photo/Aufgaben.png" alt="Aufgabenverwaltung" style={{ width: '100%', borderRadius: '8px' }} />
            <h3>Aufgabenverwaltung</h3>
            <p>Verwalte deine Aufgaben einfach und effizient. Behalte den Überblick über alle deine To-Dos, setze Prioritäten und erledige sie schneller als je zuvor.</p>
          </div>
          <div className="feature">
            <img src="./Photo/Erinnerung.png" alt="Erinnerungen" style={{ width: '100%', borderRadius: '8px' }} />
            <h3>Erinnerungen</h3>
            <p>Setze personalisierte Erinnerungen, damit du nie wieder eine wichtige Deadline verpasst – ganz egal ob privat oder beruflich.</p>
          </div>
          <div className="feature">
            <img src="./Photo/Todo.png" alt="Teamarbeit" style={{ width: '100%', borderRadius: '8px' }} />
            <h3>Teamarbeit</h3>
            <p>Teile Aufgaben, arbeite gemeinsam an Projekten und bleibe mit deinem Team auf dem Laufenden – alles an einem Ort.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section" id="testimonials">
        <h2>Was unsere Nutzer sagen</h2>
        <div className="testimonial">
          <p>"TaskHero hat meine Produktivität enorm gesteigert! Ich kann jetzt meine Aufgaben viel effizienter verwalten und habe mehr Zeit für kreative Projekte." - Max M.</p>
        </div>
        <div className="testimonial">
          <p>"Ein unverzichtbares Tool für mein Team. Die Zusammenarbeit ist so viel reibungsloser geworden, und wir können unsere Ziele schneller erreichen." - Anna K.</p>
        </div>
        <div className="testimonial">
          <p>"Ich liebe die benutzerfreundliche Oberfläche von TaskHero! Es hat mir geholfen, den Überblick über meine täglichen Aufgaben zu behalten und Prioritäten besser zu setzen." - Lisa T.</p>
        </div>
        <div className="testimonial">
          <p>"TaskHero hat nicht nur meine persönliche Effizienz verbessert, sondern auch die Kommunikation innerhalb meines Teams optimiert. Ich kann es jedem empfehlen!" - Tom S.</p>
        </div>
      </div>

      {/* Preise */}
      <div className="pricing-section" id="pricing">
        <h2>Preise</h2>
        <div className="pricing-plan">
          <h3>Basisplan</h3>
          <p>Kostenlos für Einzelbenutzer.</p>
        </div>
        <div className="pricing-plan">
          <h3>Teamplan</h3>
          <p>Für Teams ab 5 Personen,xxxx pro Nutzer/Monat.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section" id="faq">
        <h2>Häufig gestellte Fragen</h2>
        <div className="faq-item">
          <h4>Ist TaskHero wirklich kostenlos?</h4>
          <p>Ja, der Basisplan ist komplett kostenlos und beinhaltet alle wichtigen Funktionen für Einzelpersonen.</p>
        </div>
        <div className="faq-item">
          <h4>Wie sicher sind meine Daten?</h4>
          <p>Wir verwenden modernste Sicherheitsstandards, um deine Daten zu schützen.</p>
        </div>
        <div className="faq-item">
          <h4>Welche Funktionen sind im kostenlosen Plan enthalten?</h4>
          <p>Der kostenlose Plan umfasst Aufgabenverwaltung, Team-Kollaboration, und grundlegende Analysefunktionen.</p>
        </div>
        <div className="faq-item">
          <h4>Gibt es eine mobile App für TaskHero?</h4>
          <p>Ja, TaskHero ist sowohl für iOS als auch für Android verfügbar, sodass du deine Aufgaben jederzeit und überall verwalten kannst.</p>
        </div>
        <div className="faq-item">
          <h4>Wie kann ich den Support kontaktieren?</h4>
          <p>Du kannst unseren Support über das Kontaktformular auf unserer Website oder per E-Mail erreichen. Wir sind hier, um dir zu helfen!</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

