import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="privacy" className="site-footer">
      <div className="footer-inner">
        {/* Spalte 1 – Brand & Social */}
        <div className="footer-column brand">
          <h2 className="logo">TaskHero</h2>
          <p>
            Erfasse, organisiere und erledige deine Aufgaben ohne Chaos –
            mit klarer Struktur und moderner Oberfläche.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

        {/* Spalte 2 – Service-Links */}
        <div className="footer-column">
          <h3>Service</h3>
          <a href="#features">✨ Funktionen</a>
          <a href="#pricing">💰 Preise</a>
          <a href="#testimonials">✅ Bewertungen</a>
        </div>

        {/* Spalte 3 – Company-Links */}
        <div className="footer-column">
          <h3>Unternehmen</h3>
          <a href="#privacy">📜 Datenschutz</a>
          <a href="/impressum">🧾 Impressum</a>
          <a href="mailto:support@taskhero.de">📧 Kontakt</a>
          <a href="#">AGB</a>
        </div>
      </div>

      <div className="copyright">
        © {new Date().getFullYear()} TaskHero. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default Footer;
