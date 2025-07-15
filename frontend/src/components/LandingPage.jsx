import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import FeaturesSection from './FeaturesSection'; 
import Footer from './Footer';
import FaqAccordion from './FaqAccordion';

function LandingPage({ onLogin }) {
  const navigate = useNavigate();

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Registrierung
  const [fullname, setFullname] = useState('');
  const [usernameReg, setUsernameReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  // Login
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleLoginToggle = () => {
    setLoginOpen(!isLoginOpen);
    setLoginMessage('');
  };

  const handleRegister = async () => {
    if (!fullname || !usernameReg || !emailReg || !passwordReg) {
      setRegisterMessage('❌ Bitte fülle alle Felder aus.');
      return;
    }

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
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        setRegisterMessage('✅ Registrierung erfolgreich!');
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

  const handleLogin = async () => {
    if (!usernameLogin || !passwordLogin) {
      setLoginMessage('❌ Bitte Benutzername und Passwort eingeben.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: usernameLogin,
          password: passwordLogin,
        }),
      });

      const data = await res.json();
      if (res.ok ) {
        setLoginMessage(`✅ Login erfolgreich! Willkommen, ${data.user.fullname}`);
        setLoginOpen(false);
        setUsernameLogin('');
        setPasswordLogin('');

      
        

        onLogin(data.user);
        navigate('/dashboard');
      } else {
        setLoginMessage('❌ Fehler: ' + (data.message || 'Unbekannter Fehler'));
      }
    } catch (err) {
      setLoginMessage('❌ Netzwerkfehler: ' + err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isLoginOpen) {
      handleLogin();
    }
  };

  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };


  return (
    <div className="landing-page">
      {/* Header mit Logo */}
      <div className="top-bar-blue">
        <div className="logo-container">
          <a href="/">
            <img src="./Photo/Logo.png" alt="TaskHero Logo" className="site-logo" />
          </a>
        </div>
        <button className="login-button" onClick={handleLoginToggle}>
          🔑 Login
        </button>
      </div>

      {/* Navigation */}
      <div className="top-bar-gray">
        <a href="#features" className="features-link">✨ Funktionen</a>
        <a href="#testimonials" className="features-link">✅ Nutzerstimmen</a>
        <a href="#pricing" className="features-link">💰 Preise</a>
        <a href="#faq" className="features-link">❓ FAQ</a>
      </div>

      {/* Landing Hauptinhalt */}
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
            <input type="text" placeholder="Vollständiger Name" className="landing-input" value={fullname} onChange={e => setFullname(e.target.value)} />
            <input type="text" placeholder="Benutzername" className="landing-input" value={usernameReg} onChange={e => setUsernameReg(e.target.value)} />
            <input type="email" placeholder="E-Mail-Adresse" className="landing-input" value={emailReg} onChange={e => setEmailReg(e.target.value)} />
            <input type="password" placeholder="Passwort" className="landing-input" value={passwordReg} onChange={e => setPasswordReg(e.target.value)} />
            <button className="landing-button" onClick={handleRegister}>🚀 Jetzt registrieren – es ist kostenlos!</button>
            {registerMessage && <p>{registerMessage}</p>}
          </div>

          <p className="landing-terms">
            Durch Eingabe meiner E-Mail-Adresse erkenne ich die
            <a href="#privacy"> Datenschutzrichtlinie</a> an.
          </p>

          <button className="landing-video-button" onClick={() => setShowVideo(true)}>🎥 Video ansehen</button>
          {showVideo && (
            <div className="landing-video">
              <iframe
                width="560"
                height="315"
                src="https://share.synthesia.io/1a7df56e-3c4a-4636-864c-2d53b0d52ac8"
                title="TaskHero Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="landing-image">
          <img src="TaskHandy.png" alt="TaskHero App Vorschau" />
        </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleLoginToggle}>&times;</span>
            <h2>Login</h2>
            <input type="text" placeholder="Benutzername" className="modal-input" value={usernameLogin} onChange={e => setUsernameLogin(e.target.value)} onKeyPress={handleKeyPress} autoFocus />
            <input type="password" placeholder="Passwort" className="modal-input" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} onKeyPress={handleKeyPress} />
            <button className="modal-button" onClick={handleLogin}>Einloggen</button>
            {loginMessage && <p>{loginMessage}</p>}
          </div>
        </div>
      )}

      {/* Funktionen */}
     <FeaturesSection />
     <div id="faq">
  
</div>

      {/* Testimonials */}
      <div className="testimonials-section" id="testimonials">
        <h2>Was unsere Nutzer sagen</h2>
        <div className="testimonial">"TaskHero hat meine Produktivität enorm gesteigert!" – Max M.</div>
        <div className="testimonial">"Unverzichtbar für mein Team." – Anna K.</div>
        <div className="testimonial">"Benutzerfreundlich und effizient." – Lisa T.</div>
      </div>

      {/* Preise */}
      <div className="pricing-section" id="pricing">
        <h2>Preise</h2>
        <div className="pricing-plan"><h3>Basisplan</h3><p>Kostenlos für Einzelbenutzer.</p></div>
        <div className="pricing-plan"><h3>Teamplan</h3><p>Für Teams ab 5 Personen – immer kostenfrei.</p></div>
      </div>

      {/* FAQ mit Akkordeon */}
      <h2>FAQ</h2>
     <FaqAccordion />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
