import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Wichtig für Navigation

const TaskForum = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("1");
  const [description, setDescription] = useState("");

  const categoryOptions = {
    Arbeit: ["Büro", "Termine", "Kita / Schule / etc"],
    "Privat/persönliches": ["Sport", "Einkauf", "Freizeitplanung"],
    "Bildung/Studium": [],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      category,
      subCategory,
      date,
      priority,
      description,
    };

    try {
      const response = await fetch("http://localhost:/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Aufgabe erfolgreich gespeichert!");
        setCategory("");
        setSubCategory("");
        setDate("");
        setPriority("1");
        setDescription("");
      } else {
        alert(data.message || "Fehler beim Speichern.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Server nicht erreichbar.");
    }
  };

  const handleShowTasks = () => {
    navigate("/tasks");
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>Kategorie:</label>
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setSubCategory(""); // Unterkategorie zurücksetzen
        }}
        required
        style={styles.select}
      >
        <option value="">-- Bitte wählen --</option>
        {Object.keys(categoryOptions).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {category && categoryOptions[category].length > 0 && (
        <>
          <label style={styles.label}>Unterkategorie:</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Bitte wählen --</option>
            {categoryOptions[category].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </>
      )}

      <label style={styles.label}>Datum:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        style={styles.input}
      />

      <label style={styles.label}>Priorität:</label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
        style={styles.select}
      >
        <option value="1">1 (Hoch)</option>
        <option value="2">2 (Mittel)</option>
        <option value="3">3 (Niedrig)</option>
      </select>

      <label style={styles.label}>Beschreibung:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Was soll erledigt werden?"
        style={styles.textarea}
      />

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.button}>
          ✅ Neue Aufgabe anlegen
        </button>
        <button
          type="button"
          onClick={handleShowTasks}
          style={{ ...styles.button, backgroundColor: "#28a745" }}
        >
          📋 Aufgaben anzeigen
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
  },
  textarea: {
    padding: "8px",
    fontSize: "16px",
    minHeight: "80px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    marginTop: "10px",
  },
};

export default TaskForum;
