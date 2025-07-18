import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
     <footer id="privacy" className="site-footer" role="contentinfo">
      <div className="footer-inner">
        {/* Spalte 1 – Brand & Social */}
        <div className="footer-column brand">
          <Link to="/" className="logo">
            TaskHero
          </Link>
          <p>
            Erfasse, organisiere und erledige deine Aufgaben ohne Chaos –
            mit klarer Struktur und moderner Oberfläche.
          </p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://wa.me/491234567890" // Ersetze mit deiner WhatsApp-Nummer
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Spalte 2 – Service-Links */}
        <div className="footer-column">
          <h3>Service</h3>
          <ul>
            <li><a href="#features">✨ Funktionen</a></li>
            <li><a href="#pricing">💰 Preise</a></li>
            <li><a href="#testimonials">✅ Nutzerstimmen</a></li>
          </ul>
        </div>

        {/* Spalte 3 – Company-Links */}
        <div className="footer-column">
          <h3>Unternehmen</h3>
          <ul>
            <li><Link to="/datenschutz">📜 Datenschutz</Link></li>
            <li><a href="/impressum">🧾 Impressum</a></li>
            <li><a href="mailto:support@taskhero.de">📧 Kontakt</a></li>
            <li><Link to="/agb">📄 AGB</Link></li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        © {new Date().getFullYear()} TaskHero. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default Footer;
