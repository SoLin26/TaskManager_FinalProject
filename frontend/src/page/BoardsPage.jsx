import React, { useState, useEffect } from "react";
import BoardForm from "../components/BoardForm";
import InviteForm from "../components/InviteForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Benutzer-ID aus dem Token auslesen
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setCurrentUserId(decoded.id); // Passe dies an deine Tokenstruktur an
      } catch (err) {
        console.error("Token decode Fehler:", err);
      }
    }
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Kein Token gefunden");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/boards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBoards(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Boards:", err.message);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardCreated = () => {
    fetchBoards();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Boards</h2>
      <BoardForm onBoardCreated={handleBoardCreated} />
      {boards.length === 0 ? (
        <p>Noch keine Boards vorhanden.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {boards.map((board) => {
            const ownerId = board.owner?._id || board.owner;

            return (
              <li
                key={board._id}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                }}
              >
                <strong>{board.title}</strong>
                {currentUserId && ownerId === currentUserId && (
                  <InviteForm
                    boardId={board._id}
                    onInviteSuccess={fetchBoards}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BoardsPage;
