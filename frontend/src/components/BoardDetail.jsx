import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BoardDetail = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/boards/${id}`, {
          withCredentials: true,
        });
        setBoard(response.data);
        setNewTitle(response.data.title);
      } catch {
        setError("Fehler beim Laden des Boards");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  const handleInvite = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/boards/${id}/invite`,
        { email: emailToInvite },
        { withCredentials: true }
      );
      alert("Einladung gesendet!");
      setEmailToInvite("");
    } catch (err) {
      alert(err.response?.data?.message || "Fehler beim Einladen");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/boards/${id}`,
        { title: newTitle },
        { withCredentials: true }
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
      await axios.delete(`http://localhost:5000/api/boards/${id}`, {
        withCredentials: true,
      });
      alert("Board gelöscht");
      // Hier ggf. redirect
    } catch {
      alert("Fehler beim Löschen");
    }
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>{error}</p>;
  if (!board) return <p>Kein Board gefunden</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Board: {board.title}</h2>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Boardtitel ändern"
      />
      <button onClick={handleUpdate}>Ändern</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
        Löschen
      </button>

      <p>
        <strong>Owner:</strong> {board.owner?.fullname} ({board.owner?.email})
      </p>

      <h3>Mitglieder</h3>
      <ul>
        {board.members.map((member) => (
          <li key={member.user._id}>
            {member.user.fullname} ({member.user.email}) - Rolle: {member.role}
          </li>
        ))}
      </ul>

      <div>
        <h4>Mitglied einladen</h4>
        <input
          type="email"
          value={emailToInvite}
          onChange={(e) => setEmailToInvite(e.target.value)}
          placeholder="E-Mail eingeben"
        />
        <button onClick={handleInvite}>Einladen</button>
      </div>
    </div>
  );
};

export default BoardDetail;