import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BoardDetail = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/boards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(response.data);
      } catch (err) {
        setError("Fehler beim Laden des Boards");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>{error}</p>;
  if (!board) return <p>Kein Board gefunden</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{board.title}</h2>
      <p>
        <strong>Owner:</strong>{" "}
        {board.owner ? `${board.owner.fullname} (${board.owner.email})` : "Unbekannt"}
      </p>

      <h3>Mitglieder:</h3>
      {Array.isArray(board.members) && board.members.length > 0 ? (
        <ul>
          {board.members.map((member) => (
            <li key={member.user._id}>
              {member.user.fullname} ({member.user.email}) - Rolle: {member.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine Mitglieder hinzugefügt.</p>
      )}
    </div>
  );
};

export default BoardDetail;
