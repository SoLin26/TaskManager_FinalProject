import React, { useEffect, useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        setError(data.message || "Fehler beim Laden der Aufgaben.");
      }
    } catch (err) {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Möchtest du diese Aufgabe wirklich löschen?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        alert("Fehler beim Löschen.");
      }
    } catch (error) {
      alert("Server nicht erreichbar.");
    }
  };

  const handleDone = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: true }),
      });

      if (res.ok) {
        fetchTasks();
      } else {
        alert("Fehler beim Aktualisieren.");
      }
    } catch (err) {
      alert("Server nicht erreichbar.");
    }
  };

  const handleEdit = (task) => {
    // Du kannst hier z.B. ein Modal öffnen oder auf /edit/:id weiterleiten
    alert("Bearbeiten von:\n" + JSON.stringify(task, null, 2));
  };

  if (loading) return <p>⏳ Lade Aufgaben...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div>
      <h2>📋 Aufgabenliste</h2>
      <li style={styles.card}>
  <div style={styles.header}>
    <span>{task.description}</span>
    <span className="badge">{task.priority}</span>
  </div>
  <p>📅 {task.date}</p>
  ...
</li>

      {tasks.length === 0 ? (
        <p>Keine Aufgaben gefunden.</p>
      ) : (
        
        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task._id} style={styles.item}>
              <strong>{task.description}</strong>
              <br />
              📅 {task.date} | 🏷️ {task.category}
              {task.subCategory && ` > ${task.subCategory}`}
              <br />
              🔥 Priorität: {task.priority}
              <br />
              {task.done ? "✅ Erledigt" : "⏳ Offen"}
              <div style={styles.buttonGroup}>
                {!task.done && (
                  <button onClick={() => handleDone(task._id)} style={styles.done}>
                    ✅ Erledigt
                  </button>
                )}
                <button onClick={() => handleEdit(task)} style={styles.edit}>
                  ✏️ Bearbeiten
                </button>
                <button onClick={() => handleDelete(task._id)} style={styles.delete}>
                  ❌ Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    background: "#f1f1f1",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  done: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  edit: {
    backgroundColor: "#ffc107",
    color: "black",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  delete: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default TaskList;
