// FeaturesSection.jsx
import React from 'react';
import './FeaturesSection.css';

function FeaturesSection() {
  return (
    <div className="features-section" id="features">
      <h2>Funktionen von TaskHero</h2>
      <div className="features">
        <div className="feature">
          <img src="/Photo/Aufgaben.png" alt="Aufgabenverwaltung" />
          <h3>Aufgabenverwaltung</h3>
          <p>
            Behalte den Überblick über alle deine To-Dos, setze Prioritäten und erledige sie schneller als je zuvor.
          </p>
        </div>
        <div className="feature">
          <img src="/Photo/Erinnerung.png" alt="Erinnerungen" />
          <h3>Erinnerungen</h3>
          <p>Setze Erinnerungen, damit du nie wieder eine wichtige Deadline verpasst.</p>
        </div>
        <div className="feature">
          <img src="/Photo/Todo.png" alt="Teamarbeit" />
          <h3>Teamarbeit</h3>
          <p>Arbeite gemeinsam mit deinem Team an Projekten – alles an einem Ort.</p>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
