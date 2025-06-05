import React, { useState, useEffect, useRef } from "react";

function TaskList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newColumn, setNewColumn] = useState("⭐ Level 1");
  const [newDueDate, setNewDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editColumn, setEditColumn] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const textareaRef = useRef(null);

  const API_URL = "http://localhost:5000/api/todos";
  const token = localStorage.getItem("token");

  // Todos laden
 useEffect(() => {
  if (!token) return;

  setLoading(true);

  fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`); // z. B. 401 Unauthorized
      }
      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Unerwartetes Datenformat");
      }

      setTodos(data);
    })
    .catch((err) => {
      console.error("Fehler beim Laden der Todos:", err);
      setTodos([]); // Fallback: leeres Array setzen
    })
    .finally(() => {
      setLoading(false);
    });
}, [token]);


  // Textarea automatisch anpassen
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [newTitle]);

  // Neue Todo hinzufügen
  const handleAddTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, column: newColumn, dueDate: newDueDate || null }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      const savedTodo = await res.json();
      setTodos((prev) => [...prev, savedTodo]);
      setNewTitle("");
      setNewColumn("⭐ Level 1");
      setNewDueDate("");
    } catch (err) {
      alert(err.message);
    }
  };

  // Todo zum Bearbeiten auswählen
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditColumn(todo.column);
    setEditDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
  };

  // Bearbeitung abbrechen
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditColumn("");
    setEditDueDate("");
  };

  // Bearbeitung speichern
  const saveEditing = async (id) => {
    if (!editTitle.trim()) return alert("Titel darf nicht leer sein");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, column: editColumn, dueDate: editDueDate || null }),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      const updatedTodo = await res.json();
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      cancelEditing();
    } catch (err) {
      alert(err.message);
    }
  };

  // Todo löschen
  const deleteTodo = async (id) => {
    if (!window.confirm("Diese Aufgabe wirklich löschen?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Enter zum Hinzufügen (Shift+Enter für neue Zeile)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTodo();
    }
  };

  if (loading) return <div style={{ fontSize: 24, padding: 20 }}>Lädt Todos...</div>;

  return (
    <div
      style={{
        padding: 30,
        fontSize: 22,
        fontFamily: "Arial, sans-serif",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h2 style={{ fontSize: 30, marginBottom: 20 }}>Task List</h2>

      {/* Neue Aufgabe hinzufügen */}
      <div
        style={{
          marginBottom: 30,
          display: "flex",
          flexWrap: "wrap",
          gap: 15,
          alignItems: "flex-start",
        }}
      >
        <textarea
          ref={textareaRef}
          placeholder="Neue Aufgabe"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: "2 1 300px",
            padding: "14px 18px",
            fontSize: 22,
            borderRadius: 8,
            border: "2px solid #ccc",
            outline: "none",
            resize: "none",
            minHeight: 50,
            lineHeight: 1.3,
            boxSizing: "border-box",
          }}
        />
        <select
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
          style={{
            flex: "1 1 150px",
            padding: "14px 18px",
            fontSize: 22,
            borderRadius: 8,
            border: "2px solid #ccc",
            outline: "none",
            boxSizing: "border-box",
          }}
        >
          <option>⭐ Level 1</option>
          <option>😃 Level 2</option>
          <option>🦄 Level 3</option>
          <option>📚 Learning</option>
          <option>✅ Done</option>
        </select>
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          style={{
            flex: "1 1 150px",
            padding: "14px 18px",
            fontSize: 22,
            borderRadius: 8,
            border: "2px solid #ccc",
            outline: "none",
            boxSizing: "border-box",
          }}
          aria-label="Fälligkeitsdatum"
        />
        <button
          onClick={handleAddTodo}
          style={{
            flex: "0 1 100px",
            padding: "14px 0",
            fontSize: 22,
            borderRadius: 8,
            border: "none",
            backgroundColor: "#28a745",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: 100,
          }}
        >
          Hinzufügen
        </button>
      </div>

      {/* Liste der Todos */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              padding: "18px 24px",
              marginBottom: 12,
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
              fontSize: 24,
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 15,
            }}
          >
            {editingId === todo._id ? (
              <>
                <textarea
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    flex: "2 1 300px",
                    padding: "10px 14px",
                    fontSize: 20,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    outline: "none",
                    resize: "vertical",
                    minHeight: 50,
                    lineHeight: 1.3,
                    boxSizing: "border-box",
                  }}
                />
                <select
                  value={editColumn}
                  onChange={(e) => setEditColumn(e.target.value)}
                  style={{
                    flex: "1 1 150px",
                    padding: "10px 14px",
                    fontSize: 20,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option>⭐ Level 1</option>
                  <option>😃 Level 2</option>
                  <option>🦄 Level 3</option>
                  <option>📚 Learning</option>
                  <option>✅ Done</option>
                </select>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{
                    flex: "1 1 150px",
                    padding: "10px 14px",
                    fontSize: 20,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  aria-label="Fälligkeitsdatum bearbeiten"
                />

                <button
                  onClick={() => saveEditing(todo._id)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 18,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Speichern
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    padding: "10px 16px",
                    fontSize: 18,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#6c757d",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Abbrechen
                </button>
              </>
            ) : (
              <>
                <div style={{ flex: "2 1 300px" }}>
                  {todo.title}{" "}
                  <span style={{ fontSize: 18, fontStyle: "italic", color: "#555" }}>
                    – {todo.column}
                  </span>
                  {todo.dueDate && (
                    <div
                      style={{
                        fontSize: 16,
                        color: todo.dueDate < new Date().toISOString() ? "red" : "#333",
                        fontWeight: "normal",
                        marginTop: 4,
                      }}
                    >
                      Fällig: {new Date(todo.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => startEditing(todo)}
                  style={{
                    padding: "8px 14px",
                    fontSize: 18,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#ffc107",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  style={{
                    padding: "8px 14px",
                    fontSize: 18,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Löschen
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
