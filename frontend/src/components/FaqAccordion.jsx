import React, { useState } from "react";
import './FaqAccordion.css';

const faqs = [
  {
    question: "Wie funktioniert TaskHero?",
    answer:
      "TaskHero hilft dir, Aufgaben zu erstellen, zu organisieren und zu priorisieren mit einem intuitiven Interface.",
  },
  {
    question: "Ist TaskHero kostenlos?",
    answer:
      "TaskHero bietet eine kostenlose Basisversion. Premium-Funktionen sind kostenfrei",
  },
  {
    question: "Kann ich meine Daten exportieren?",
    answer: "Ja, du kannst deine Aufgaben als CSV oder PDF exportieren.",
  },
  {
    question: "Gibt es eine mobile App von TaskHero?",
    answer: "Ja, TaskHero ist für iOS und Android verfügbar und synchronisiert deine Aufgaben automatisch.",
  },
  {
    question: "Wie sicher sind meine Daten bei TaskHero?",
    answer: "Wir verwenden moderne Verschlüsselungstechnologien, um deine Daten sicher zu speichern und zu übertragen.",
  },
  {
    question: "Kann ich TaskHero im Team nutzen?",
    answer: "Ja, mit unseren Premium-Tarifen kannst du Aufgaben mit Teammitgliedern teilen und gemeinsam bearbeiten.",
  },
  {
    question: "Wie kann ich meinen Account löschen?",
    answer: "Du kannst deinen Account jederzeit in den Einstellungen löschen. Dabei werden alle deine Daten gelöscht.",
  },
  {
    question: "Wie kann ich den Support kontaktieren?",
    answer: "Du erreichst unseren Support über das Kontaktformular auf unserer Webseite oder per E-Mail an support@taskhero.com.",
  },
];

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-container">
      {faqs.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggle(index)}
            aria-expanded={activeIndex === index}
            aria-controls={`faq-answer-${index}`}
            id={`faq-question-${index}`}
            type="button"
          >
            <span className="toggle-icon">{activeIndex === index ? "–" : "+"}</span>
            {item.question}
          </button>

          {activeIndex === index && (
  <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`}>
    {item.answer}
  </div>
)}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
