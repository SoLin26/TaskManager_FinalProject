import React, { useState } from "react";
import "./FaqAccordion.css";

const faqs = [
  {
    question: "Wie funktioniert TaskHero?",
    answer: "TaskHero hilft dir, Aufgaben zu erstellen, zu organisieren und zu priorisieren mit einem intuitiven Interface.",
  },
  {
    question: "Ist TaskHero kostenlos?",
    answer: "TaskHero bietet eine kostenlose Basisversion. Premium-Funktionen sind kostenpflichtig.",
  },
  {
    question: "Kann ich meine Daten exportieren?",
    answer: "Ja, du kannst deine Aufgaben als CSV oder PDF exportieren.",
  },
];

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container" id="faq">
      
      {faqs.map((item, index) => (
        <div key={index} className="faq-item">
          <button className="faq-question" onClick={() => toggle(index)}>
            {item.question}
            <span className="faq-toggle">{activeIndex === index ? "–" : "+"}</span>
          </button>
          {activeIndex === index && (
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
