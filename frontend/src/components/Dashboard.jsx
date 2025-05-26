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
  const [editingTask, setEditingTask] = useState({ column: null, index: null });

  const handleAddTask = (column) => {
    if (!newTasks[column]) return;
    const updatedColumn = [...board[column], newTasks[column]];
    setBoard({ ...board, [column]: updatedColumn });
    setNewTasks({ ...newTasks, [column]: "" });
  };

  const handleMoveTask = (fromColumn, index, toColumn) => {
    const task = board[fromColumn][index];
    const updatedFrom = [...board[fromColumn]];
    updatedFrom.splice(index, 1);

    const updatedTo = [...board[toColumn], task]; // ajoute dans la nouvelle
    setBoard({ ...board, [fromColumn]: updatedFrom, [toColumn]: updatedTo });
    setEditingTask({ column: null, index: null }); // cache le menu 
  };

  return (
    <div style={styles.board}>
      {Object.keys(board).map((column) => (
        <div key={column} style={styles.column}>
          <h3>{column}</h3>

          {board[column].map((task, index) => (
            <div key={index} style={styles.card}>
              {editingTask.column === column && editingTask.index === index ? (
                <select
                  style={styles.select}
                  onChange={(e) => handleMoveTask(column, index, e.target.value)}
                  value=""
                >
                  <option value="" disabled>
                    ➤ Déplacer vers...
                  </option>
                  {Object.keys(board)
                    .filter((col) => col !== column)
                    .map((targetColumn) => (
                      <option key={targetColumn} value={targetColumn}>
                        {targetColumn}
                      </option>
                    ))}
                </select>
              ) : (
                <div onClick={() => setEditingTask({ column, index })}>
                  {task}
                </div>
              )}
            </div>
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
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "15px",
    width: "250px",
    minHeight: "300px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  card: {
    backgroundColor: "#fff",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    color: "#ff6600",
    backgroundColor: "white",
    fontWeight: "bold",
    fontSize: "16px",
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
  select: {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #aaa",
    fontWeight: "bold",
    backgroundColor: "#eef2ff",
    color: "#333",
  },
};

export default Dashboard;
