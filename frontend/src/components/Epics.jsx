import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Epics.css";

function Epics() {
  const [epics, setEpics] = useState([]);

  // Charger les Epics depuis le backend
  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/epics");
        setEpics(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Epics:", err);
      }
    };
    fetchEpics();
  }, []);

  const handleAddEpic = async () => {
    const name = prompt("Gib den Namen für das neue Epic ein:");
    if (!name || name.trim() === "") return;

    try {
      const res = await axios.post("http://localhost:8080/api/epics", {
        title: `🆕 ${name}`,
      });
      setEpics((prev) => [...prev, res.data]);
    } catch (err) {
      alert("Fehler beim Speichern");
      console.error(err);
    }
  };

  const handleShowAll = () => {
    alert("Alle Epics anzeigen");
  };

  return (
    <div className="epics-page">
      <h1 className="animated-title">🧩 Epics</h1>
      <p className="intro-text">Organisiere deine großen Themen hier.</p>

      <div className="button-group">
        <button className="create-btn" onClick={handleAddEpic}>
          ➕ Epic hinzufügen
        </button>
        <button className="all-btn" onClick={handleShowAll}>
          📋 Alle Epics
        </button>
      </div>

      <div className="epic-list">
        {epics.map((epic) => (
          <div key={epic._id} className="epic-card">
            <h3>{epic.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Epics;
