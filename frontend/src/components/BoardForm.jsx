import React, { useState } from "react";
import axios from "axios";

const BoardForm = ({ onBoardCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Titel darf nicht leer sein.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/boards",
        { title, description },
         { withCredentials: true }
      );
      setTitle("");
      setDescription("");
      if (onBoardCreated) {
        onBoardCreated();
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des Boards:", error);
      alert("Fehler beim Erstellen");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "2rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        flexWrap: "wrap", // damit es auf kleinen Screens umbricht
      }}
    >
      <input
        type="text"
        placeholder="Board Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "40%",
          borderRadius: "4px",
          border: "1px solid #ccc",
          height: "4rem",
        }}
      />
      <textarea
        placeholder="Beschreibung (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        style={{
          padding: "0.5rem",
          width: "40%",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "none",
          height: "4rem",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          height: "4rem",
        }}
      >
        Erstellen
      </button>
    </form>
  );
};

export default BoardForm;