import React, { useState, useEffect, useRef } from "react";

function TaskList() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newColumn, setNewColumn] = useState("⭐ Level 1");
  const [newDueDate, setNewDueDate] = useState("");
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editColumn, setEditColumn] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const textareaRef = useRef(null);
  const token = localStorage.getItem("token");

  const API_BOARDS = "http://localhost:8080/api/boards";
  const API_TODOS = "http://localhost:8080/api/todos";

  // Boards laden beim Start
  useEffect(() => {
    if (!token) return;
    setLoadingBoards(true);

    fetch(API_BOARDS, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Fehler beim Laden der Boards: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unerwartetes Datenformat bei Boards");
        setBoards(data);
        if (data.length > 0) setSelectedBoardId(data[0]._id); // erstes Board auswählen
      })
      .catch((err) => {
        console.error(err);
        setBoards([]);
      })
      .finally(() => setLoadingBoards(false));
  }, [token]);

  // Todos laden, wenn Board gewechselt wird
  useEffect(() => {
    if (!token || !selectedBoardId) {
      setTodos([]);
      return;
    }
    setLoadingTodos(true);

    fetch(`${API_TODOS}?boardId=${selectedBoardId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Fehler beim Laden der Todos: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unerwartetes Datenformat bei Todos");
        setTodos(data);
      })
      .catch((err) => {
        console.error(err);
        setTodos([]);
      })
      .finally(() => setLoadingTodos(false));
  }, [token, selectedBoardId]);

  // Textarea auto-height
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
      const res = await fetch(API_TODOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          column: newColumn,
          dueDate: newDueDate || null,
          boardId: selectedBoardId,
        }),
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

  // Bearbeiten starten
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditColumn(todo.column);
    setEditDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
  };

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
      const res = await fetch(`${API_TODOS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          column: editColumn,
          dueDate: editDueDate || null,
          boardId: selectedBoardId,
        }),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      const updatedTodo = await res.json();
      setTodos((prev) => prev.map((todo) => (todo._id === id ? updatedTodo : todo)));
      cancelEditing();
    } catch (err) {
      alert(err.message);
    }
  };

  // Todo löschen
  const deleteTodo = async (id) => {
    if (!window.confirm("Diese Aufgabe wirklich löschen?")) return;
    try {
      const res = await fetch(`${API_TODOS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

  if (loadingBoards) return <div>Lädt Boards...</div>;
  if (!selectedBoardId) return <div>Bitte wähle ein Board aus.</div>;

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

      {/* Board Auswahl */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="boardSelect" style={{ marginRight: 10, fontWeight: "bold" }}>
          Board auswählen:
        </label>
        <select
          id="boardSelect"
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
          style={{
            fontSize: 20,
            padding: "8px 12px",
            borderRadius: 6,
            border: "2px solid #ccc",
          }}
        >
          {boards.map((board) => (
            <option key={board._id} value={board._id}>
              {board.title}
            </option>
          ))}
        </select>
      </div>

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
        />
        <button
          onClick={handleAddTodo}
          style={{
            flex: "0 0 auto",
            padding: "16px 25px",
            fontSize: 22,
            borderRadius: 8,
            border: "none",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Hinzufügen
        </button>
      </div>

      {/* Todos anzeigen */}
      {loadingTodos ? (
        <div>Lädt Todos...</div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 15,
          }}
        >
          {todos.map((todo) => (
            <li
              key={todo._id}
              style={{
                backgroundColor: "#f7f7f7",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 3px 5px rgb(0 0 0 / 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {editingId === todo._id ? (
                <>
                  <textarea
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      fontSize: 22,
                      borderRadius: 6,
                      border: "2px solid #ccc",
                      padding: 10,
                      resize: "vertical",
                      minHeight: 70,
                      outline: "none",
                    }}
                  />
                  <select
                    value={editColumn}
                    onChange={(e) => setEditColumn(e.target.value)}
                    style={{
                      fontSize: 20,
                      borderRadius: 6,
                      border: "2px solid #ccc",
                      padding: 10,
                      outline: "none",
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
                      fontSize: 20,
                      borderRadius: 6,
                      border: "2px solid #ccc",
                      padding: 10,
                      outline: "none",
                    }}
                  />
                  <div>
                    <button onClick={() => saveEditing(todo._id)} style={{ marginRight: 10 }}>
                      Speichern
                    </button>
                    <button onClick={cancelEditing}>Abbrechen</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ margin: 0 }}>{todo.title}</h3>
                  <p style={{ margin: "4px 0" }}>{todo.column}</p>
                  <p style={{ margin: "4px 0", color: "#666" }}>
                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "Kein Datum"}
                  </p>
                  <div>
                    <button onClick={() => startEditing(todo)} style={{ marginRight: 10 }}>
                      Bearbeiten
                    </button>
                    <button onClick={() => deleteTodo(todo._id)} style={{ color: "red" }}>
                      Löschen
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;