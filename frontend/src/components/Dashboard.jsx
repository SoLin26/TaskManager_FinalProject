import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

const initialBoard = {
  "⭐ Level 1": [],
  "😃 Level 2": [],
  "🦄 Level 3": [],
  "📚 Learning": [],
  "✅ Done": [],
};

function Dashboard() {
  const [board, setBoard] = useState(initialBoard);
  const [newTasks, setNewTasks] = useState(
    Object.fromEntries(Object.keys(initialBoard).map((key) => [key, ""]))
  );
  const [editableTitles, setEditableTitles] = useState(
    Object.fromEntries(Object.keys(initialBoard).map((key) => [key, false]))
  );
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const close = () => setDropdownOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const descriptions = {
    "⭐ Level 1": "📱 Première étape : apprendre les bases, installer l’environnement, créer une app simple.",
    "😃 Level 2": "🛠️ Améliorer la qualité de ton code et soumettre une app plus fiable.",
    "🦄 Level 3": "🚀 Automatiser, distribuer, et étendre tes connaissances Swift.",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleAddTask = async (column) => {
    const task = newTasks[column];
    if (!task.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/column/add-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ column: column, task: task }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur d'ajout");
      }

      const data = await response.json();
      const updatedColumn = [...board[column], task];
      setBoard({ ...board, [column]: updatedColumn });
      setNewTasks({ ...newTasks, [column]: "" });
    } catch (err) {
      console.error("❌ Erreur API :", err.message);
      alert("Erreur lors de l’ajout de la tâche !");
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = [...board[source.droppableId]];
    const destColumn = [...board[destination.droppableId]];
    const [movedTask] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, movedTask);

    setBoard({
      ...board,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  const handleTitleChange = (oldTitle, newTitle) => {
    if (!newTitle.trim() || newTitle === oldTitle) {
      setEditableTitles({ ...editableTitles, [oldTitle]: false });
      return;
    }

    const updatedBoard = {};
    const updatedNewTasks = {};
    const updatedEditableTitles = {};

    Object.keys(board).forEach((key) => {
      const newKey = key === oldTitle ? newTitle : key;
      updatedBoard[newKey] = board[key];
      updatedNewTasks[newKey] = newTasks[key];
      updatedEditableTitles[newKey] = editableTitles[key];
    });

    setBoard(updatedBoard);
    setNewTasks(updatedNewTasks);
    setEditableTitles(updatedEditableTitles);
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.topbar}>
        <span style={styles.userInfo}>
          👤 Eingeloggt als: <strong>{localStorage.getItem("userEmail") || "Benutzer"}</strong>
        </span>
        <button onClick={handleLogout} style={styles.logoutButton}>🚪 Logout</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {Object.entries(board).map(([column, tasks]) => (
            <div key={column} style={styles.column}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {editableTitles[column] ? (
                  <input
                    type="text"
                    autoFocus
                    defaultValue={column}
                    onBlur={(e) => handleTitleChange(column, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTitleChange(column, e.target.value);
                      }
                    }}
                    style={styles.input}
                  />
                ) : (
                  <h3
                    style={styles.columnTitle}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditableTitles({ ...editableTitles, [column]: true });
                    }}
                  >
                    {column}
                  </h3>
                )}

                <div style={{ position: "relative" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(column);
                    }}
                    style={styles.menuButton}
                  >
                    ⋯
                  </button>

                  {dropdownOpen === column && (
                    <div style={styles.dropdownMenu}>
                      <button style={styles.dropdownMenuButton} onClick={() => navigate("/add-card")}>➕ Karte hinzufügen</button>
                      <button style={styles.dropdownMenuButton} onClick={() => navigate("/copy-list")}>📋 Liste kopieren</button>
                      <button style={styles.dropdownMenuButton} onClick={() => navigate("/move-list")}>↔️ Liste verschieben</button>
                      <button style={styles.dropdownMenuButton} onClick={() => navigate("/move-all-cards")}>📦 Alle Karten verschieben</button>
                      <button style={styles.dropdownMenuButton} onClick={() => navigate("/archive-list")}>🗃️ Liste archivieren</button>
                      <button style={styles.dropdownMenuButton} onClick={() => navigate("/create-rule")}>⚙️ Regel erstellen</button>
                    </div>
                  )}
                </div>
              </div>

              {descriptions[column] && <p style={styles.description}>{descriptions[column]}</p>}

              <Droppable droppableId={column}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ minHeight: "50px" }}
                  >
                    {tasks.map((task, index) => (
                      <Draggable
                        key={`${column}-${index}`}
                        draggableId={`${column}-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...styles.card,
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <input
                type="text"
                placeholder="Nouvelle carte..."
                value={newTasks[column]}
                onChange={(e) => setNewTasks({ ...newTasks, [column]: e.target.value })}
                style={styles.input}
              />
              <button
                onClick={() => handleAddTask(column)}
                style={styles.addButton}
              >
                ➕ Ajouter
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc",
  },
  userInfo: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#333",
  },
  logoutButton: {
    padding: "8px 14px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  board: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    overflowX: "auto",
    height: "calc(100vh - 60px)",
  },
  column: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: "15px",
    padding: "15px",
    width: "280px",
    minHeight: "350px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(4px)",
    position: "relative",
  },
  columnTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
    cursor: "pointer",
  },
  description: {
    fontSize: "13px",
    marginBottom: "12px",
    color: "#555",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
    cursor: "grab",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontWeight: "bold",
    fontSize: "15px",
    outline: "none",
  },
  addButton: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  menuButton: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    padding: "0 5px",
  },
  dropdownMenu: {
    position: "absolute",
    top: "30px",
    right: 0,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    padding: "10px",
    minWidth: "180px",
  },
  dropdownMenuButton: {
    width: "100%",
    padding: "8px",
    marginBottom: "6px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ccc",
    borderRadius: "6px",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default Dashboard;
