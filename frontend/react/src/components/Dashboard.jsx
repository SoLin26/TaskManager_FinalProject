import React, { useState } from "react";

const initialBoard = {
  Upcoming: [],
  "In Progress": [],
  Done: [],
};

function Dashboard() {
  const [board, setBoard] = useState(initialBoard);
  const [newTasks, setNewTasks] = useState({
    Upcoming: "",
    "In Progress": "",
    Done: "",
  });

  const handleAddTask = (column) => {
    if (!newTasks[column]) return;
    const updatedColumn = [...board[column], newTasks[column]];
    setBoard({ ...board, [column]: updatedColumn });
    setNewTasks({ ...newTasks, [column]: "" });
  };

  return (
    <div style={styles.board}>
      {Object.keys(board).map((column) => (
        <div key={column} style={styles.column}>
          <h3>{column}</h3>
          {board[column].map((task, i) => (
            <div key={i} style={styles.card}>{task}</div>
          ))}
          <input
            type="text"
            placeholder="Neue Karte..."
            value={newTasks[column]}
            onChange={(e) =>
              setNewTasks({ ...newTasks, [column]: e.target.value })
            }
            style={styles.input}
          />
          <button onClick={() => handleAddTask(column)} style={styles.addButton}>
            ➕ Hinzufügen
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  board: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    overflowX: "auto",
  },
  column: {
    backgroundColor: "#f4f4f4",
    borderRadius: "6px",
    padding: "10px",
    width: "250px",
    minHeight: "300px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    color: "#ff6600",             // 🧡 texte orange vif
    backgroundColor: "white",     // fond clair
    fontWeight: "bold",           // texte gras = +visible
    fontSize: "16px",             // taille lisible
    outline: "none",
  },
  
  
  
  
  addButton: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Dashboard;

