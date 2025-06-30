import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/boards/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoard(response.data);
        setNewTitle(response.data.title);
        setError(null);
      } catch (error) {
        setError("Fehler beim Laden des Boards");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);
  



  

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080api/boards/${id}/invite`,
        { email: emailToInvite },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Einladung gesendet!");
      setEmailToInvite("");
    } catch (err) {
      alert(err.response?.data?.message || "Fehler beim Einladen");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/boards/${id}`,
        { title: newTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBoard(response.data);
      alert("Board aktualisiert");
    } catch {
      alert("Fehler beim Aktualisieren");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Board wirklich löschen?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Board gelöscht");
      navigate("/boards");
    } catch {
      alert("Fehler beim Löschen");
    }
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!board) return <p>Kein Board gefunden</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Board: {board.title}</h2>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Boardtitel ändern"
        style={{
          padding: "8px",
          fontSize: "1rem",
          width: "60%",
          marginRight: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleUpdate}
        style={{
          padding: "8px 16px",
          fontSize: "1rem",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
      >
        Ändern
      </button>
      <button
        onClick={handleDelete}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          fontSize: "1rem",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
      >
        Löschen
      </button>

      <p style={{ marginTop: "20px" }}>
        <strong>Owner:</strong> {board.owner?.fullname} ({board.owner?.email})
      </p>

      <h3>Mitglieder</h3>
      {board.members && board.members.length > 0 ? (
        <ul>
          {board.members.map((member) => (
            <li key={member.user._id}>
              {member.user.fullname} ({member.user.email}) - Rolle: {member.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine Mitglieder gefunden.</p>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h4>Mitglied einladen</h4>
        <input
          type="email"
          value={emailToInvite}
          onChange={(e) => setEmailToInvite(e.target.value)}
          placeholder="E-Mail eingeben"
          style={{
            padding: "8px",
            fontSize: "1rem",
            width: "60%",
            marginRight: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleInvite}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
        >
          Einladen
        </button>
      </div>
    </div>
  );
};

export default BoardDetail;