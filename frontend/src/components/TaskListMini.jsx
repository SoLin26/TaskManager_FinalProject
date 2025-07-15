import React, { useEffect, useState } from "react";

function TaskListMini({ boardId }) {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
   

    fetch(`http://localhost:8080/api/todos?boardId=${boardId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Aufgaben");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error(err);
        setTasks([]);
      });
  }, [boardId, token]);

  if (tasks.length === 0) return <p style={{ fontStyle: "italic", color: "#666" }}>Keine Aufgaben.</p>;

  return (
    <ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
      {tasks.map((task) => (
        <li key={task._id} style={{ fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>
          {task.title}{" "}
          {task.dueDate ? (
            <small style={{ color: "#888" }}>
              (bis {new Date(task.dueDate).toLocaleDateString()})
            </small>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default TaskListMini;
