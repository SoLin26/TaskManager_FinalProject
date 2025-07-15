import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Sidebar.css"; // ou "./Sprints.css" si tu préfères

function Sprints() {
  const [sprints, setSprints] = useState([]);

  // Charger tous les Sprints depuis le Backend au démarrage
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/sprints");
        setSprints(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Sprints:", err);
      }
    };

    fetchSprints();
  }, []);

  const handleCreateSprint = async () => {
    const name = prompt("Gib einen Namen für den neuen Sprint ein:");
    if (!name || name.trim() === "") return;

    try {
      const res = await axios.post("http://localhost:8080/api/sprints", {
        title: `🆕 ${name}`,
        description: "Benutzerdefinierter Sprint erstellt.",
      });

      setSprints([...sprints, res.data]);
    } catch (error) {
      alert("Fehler beim Speichern");
      console.error(error);
    }
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
          <div key={sprint._id} className="sprint-card">
            <h3>{sprint.title}</h3>
            <p>{sprint.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sprints;
