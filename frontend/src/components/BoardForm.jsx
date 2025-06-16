import React, { useState } from "react";
import axios from "axios";

const BoardForm = ({ onBoardCreated }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Kein Token gefunden");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/boards",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      onBoardCreated();
    } catch (err) {
      console.error("Fehler beim Erstellen des Boards:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Board Titel"
        required
        style={{ padding: "0.5rem", marginRight: "1rem", width: "60%" }}
      />
      <button type="submit" style={{ padding: "0.5rem 1rem" }}>
        Erstellen
      </button>
    </form>
  );
};

export default BoardForm;
