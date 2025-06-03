import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

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

  const descriptions = {
    "⭐ Level 1": "📱 Première étape : apprendre les bases, installer l’environnement, créer une app simple.",
    "😃 Level 2": "🛠️ Améliorer la qualité de ton code et soumettre une app plus fiable.",
    "🦄 Level 3": "🚀 Automatiser, distribuer, et étendre tes connaissances Swift.",
  };

  const handleAddTask = (column) => {
    if (!newTasks[column]) return;
    const updatedColumn = [...board[column], newTasks[column]];
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.board}>
        {Object.entries(board).map(([column, tasks]) => (
          <div key={column} style={styles.column}>
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
                onClick={() =>
                  setEditableTitles({ ...editableTitles, [column]: true })
                }
              >
                {column}
              </h3>
            )}

            {descriptions[column] && (
              <p style={styles.description}>{descriptions[column]}</p>
            )}

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
              onChange={(e) =>
                setNewTasks({ ...newTasks, [column]: e.target.value })
              }
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
