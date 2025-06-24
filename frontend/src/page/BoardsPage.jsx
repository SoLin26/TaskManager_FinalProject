import React, { useState, useEffect } from "react";
import BoardForm from "../components/BoardForm";
import InviteForm from "../components/InviteForm";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  // Benutzer-ID aus dem Token auslesen
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
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

      const res = await axios.get("http://localhost:8080/api/boards", {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Board wirklich löschen?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBoards();
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Fehler beim Löschen");
    }
  };

  const handleEdit = async (board) => {
    const newTitle = prompt("Neuer Board-Titel:", board.title);
    const newDescription = prompt("Neue Beschreibung:", board.description || "");
    if (!newTitle) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/boards/${board._id}`,
        {
          title: newTitle,
          description: newDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBoards();
    } catch (error) {
      console.error("Fehler beim Bearbeiten:", error);
      alert("Fehler beim Bearbeiten");
    }
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
                <p style={{ margin: "0.5rem 0" }}>
                  {board.description || "Keine Beschreibung"}
                </p>

                {currentUserId && ownerId === currentUserId && (
                  <>
                    <InviteForm
                      boardId={board._id}
                      onInviteSuccess={fetchBoards}
                    />
                    <div style={{ marginTop: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(board)}
                        style={{
                          marginRight: "0.5rem",
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(board._id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Löschen
                      </button>
                    </div>
                  </>
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
