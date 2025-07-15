import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import BoardForm from "../components/BoardForm";
import InviteForm from "../components/InviteForm";
import TaskListMini from "../components/TaskListMini";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  // 👤 Hole eingeloggten User vom Server
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.user.id);
    } catch (err) {
      console.error("Benutzer nicht eingeloggt oder Token ungültig:", err.message);
      navigate("/"); // Zurück zur Startseite, wenn nicht eingeloggt
    }
  };

  const fetchBoards = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/boards", {
        withCredentials: true,
      });
      setBoards(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Boards:", err.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchBoards();
  }, []);

  const handleBoardCreated = () => {
    fetchBoards();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Board wirklich löschen?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/boards/${id}`, {
        withCredentials: true,
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
      await axios.put(
        `http://localhost:8080/api/boards/${board._id}`,
        {
          title: newTitle,
          description: newDescription,
        },
        { withCredentials: true }
      );
      fetchBoards();
    } catch (error) {
      if (error.response) {
        alert(`Fehler: ${error.response.status} - ${error.response.data.message}`);
      } else {
        alert("Unbekannter Fehler beim Bearbeiten");
      }
      console.error("Fehler beim Bearbeiten:", error);
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

                <TaskListMini boardId={board._id} />

                {/* Bearbeiten/Löschen nur für Besitzer */}
                {currentUserId && currentUserId === ownerId && (
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
