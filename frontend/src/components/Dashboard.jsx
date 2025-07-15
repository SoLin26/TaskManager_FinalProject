import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import fleure12 from "../../Photo/fleure12.png";


const initialBoard = {
  "⭐ Level 1": [
    { title: "Basic Terminal Usage", tagColor: "purple" },
    { title: "Setup Guide", tagColor: "green" },
  ],
  "😃 Level 2": [{ title: "Basic Terminal Usage", tagColor: "purple" },
    { title: "Setup Guide", tagColor: "green" },],
  "🦄 Level 3": [{ title: "Basic Terminal Usage", tagColor: "purple" },
    { title: "Setup Guide", tagColor: "green" },],
  "📚 Learning": [{ title: "Basic Terminal Usage", tagColor: "purple" },
    { title: "Setup Guide", tagColor: "green" },],
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
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
      async function fetchUser() {
         try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      credentials: "include",
    })
     
        if (!res.ok) {
          navigate("/");
        } else {
          const data = await res.json();
          setUser(data.user);
        }
    
      
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
      fetchUser();
  }, []);

  const descriptions = {
    "⭐ Level 1": "📱 Première étape : apprendre les bases, installer l’environnement, créer une app simple.",
    "😃 Level 2": "🛠️ Améliorer la qualité de ton code et soumettre une app plus fiable.",
    "🦄 Level 3": "🚀 Automatiser, distribuer, et étendre tes connaissances Swift.",
  };

  const getColor = (colorName) => {
    const colors = {
      purple: "#a259ff",
      green: "#2ecc71",
      blue: "#3498db",
      red: "#e74c3c",
      orange: "#e67e22",
      gray: "#7f8c8d",
    };
    return colors[colorName] || "#ccc";
  };

  const handleLogout = () => {
    fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => navigate("/"))
      .catch(() => navigate("/"));
  };

  const handleAddTask = async (column) => {
    const task = newTasks[column];
    if (!task.trim()) return;

    const newTaskObject = { title: task, tagColor: "gray" };

    const updatedColumn = [...board[column], newTaskObject];
    setBoard({ ...board, [column]: updatedColumn });
    setNewTasks({ ...newTasks, [column]: "" });
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
          👤 Eingeloggt als: <strong>{user?.username || "Benutzer"}</strong>
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
                              borderLeft: `6px solid ${getColor(task.tagColor)}`,
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task.title}
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
    backgroundImage: `url(${fleure12})`,
    backgroundColor: "pink",
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
    boxShadow: "0 4px 10px rgba(82, 180, 210, 0.88)",
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
    boxShadow: "0 2px 6px rgba(200, 123, 123, 0.89)",
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
};

export default Dashboard;