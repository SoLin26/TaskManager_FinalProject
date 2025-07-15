import React, { useState } from "react";
import "./Sidebar.css";

function Sprints() {
  const [sprints, setSprints] = useState([
    { id: 1, title: "📅 Sprint 1: Planung", description: "Planung aller Aufgaben für die Woche." },
    { id: 2, title: "✅ Sprint 2: Umsetzung", description: "Umsetzung der Kernfunktionen." },
    { id: 3, title: "🐞 Sprint 3: Bugfixing", description: "Behebung von Bugs & Testing." },
  ]);

  const handleCreateSprint = () => {
    const name = prompt("Gib einen Namen für den neuen Sprint ein:");
    if (!name || name.trim() === "") return;

    const newSprint = {
      id: sprints.length + 1,
      title: `🆕 ${name}`,
      description: "Benutzerdefinierter Sprint erstellt.",
    };
    setSprints([...sprints, newSprint]);
  };

  const handleShowAll = () => {
    alert("Alle Sprints anzeigen");
  };

  return (
    <div className="sprints-page">
      <h1 className="animated-title">🚀 Sprints</h1>
      <p className="intro-text">Organisiere und plane deine Sprints hier.</p>

      <div className="button-group">
        <button className="create-btn" onClick={handleCreateSprint}>
          ➕ Sprint erstellen
        </button>
        <button className="all-btn" onClick={handleShowAll}>
          📋 Alle Sprints
        </button>
      </div>

      <div className="sprint-list">
        {sprints.map((sprint) => (
          <div key={sprint.id} className="sprint-card">
            <h3>{sprint.title}</h3>
            <p>{sprint.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sprints;

