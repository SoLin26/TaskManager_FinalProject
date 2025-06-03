import React, { useState } from "react";

const initialBoard = {
  "⭐ Level 1": [],
  "😃 Level 2": [],
  "🦄 Level 3": [],
  "📚 Learning": [],
  "✅ Done": [],
};

function Dashboard() {
  const [board, setBoard] = useState(initialBoard);
  const [newTasks, setNewTasks] = useState({
    "⭐ Level 1": "",
    "😃 Level 2": "",
    "🦄 Level 3": "",
    "📚 Learning": "",
    "✅ Done": "",
  });

  const [editingTask, setEditingTask] = useState({ column: null, index: null });
  const [editableTitles, setEditableTitles] = useState({
    "⭐ Level 1": false,
    "😃 Level 2": false,
    "🦄 Level 3": false,
    "📚 Learning": false,
    "✅ Done": false,
  });

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
    const updatedTo = [...board[toColumn], task];
    setBoard({ ...board, [fromColumn]: updatedFrom, [toColumn]: updatedTo });
    setEditingTask({ column: null, index: null });
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
    <div style={styles.board}>
      {Object.keys(board).map((column) => (
        <div key={column} style={styles.column}>
          {/* TITRE éditable */}
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
              onClick={() => setEditableTitles({ ...editableTitles, [column]: true })}
            >
              {column}
            </h3>
          )}

          {/* Description par niveau */}
          {column === "⭐ Level 1" && (
            <p style={styles.description}>
              📱 Première étape : apprendre les bases, installer l’environnement, créer une app simple.
            </p>
          )}
          {column === "😃 Level 2" && (
            <p style={styles.description}>
              🛠️ Améliorer la qualité de ton code et soumettre une app plus fiable.
            </p>
          )}
          {column === "🦄 Level 3" && (
            <p style={styles.description}>
              🚀 Automatiser, distribuer, et étendre tes connaissances Swift.
            </p>
          )}

          {/* Cartes */}
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
                <div onClick={() => setEditingTask({ column, index })}>{task}</div>
              )}
            </div>
          ))}

          <input
            type="text"
            placeholder="Nouvelle carte..."
            value={newTasks[column]}
            onChange={(e) => setNewTasks({ ...newTasks, [column]: e.target.value })}
            style={styles.input}
          />
          <button onClick={() => handleAddTask(column)} style={styles.addButton}>
            ➕ Ajouter
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    padding: "15px",
    width: "270px",
    minHeight: "350px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(4px)",
  },
  columnTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
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
    cursor: "pointer",
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
