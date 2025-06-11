import React, { useState } from "react";
import axios from "axios";

const BoardForm = ({ onBoardCreated }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/boards",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle(""); // Eingabe zurücksetzen
      if (onBoardCreated) {
        onBoardCreated(response.data); // Neues Board  zurückgeben
      }
    } catch (err) {
      setError("Fehler beim Erstellen des Boards");
      console.error("Fehler beim Erstellen des Boards:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        type="text"
        placeholder="Neues Board eingeben"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: "1rem",
          fontSize: "1.2rem",
          width: "400px", // etwas breiter für besseres sehen
        }}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Erstelle..." : "Erstellen"}
      </button>
      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </p>
      )}
    </form>
  );
};

export default BoardForm;
