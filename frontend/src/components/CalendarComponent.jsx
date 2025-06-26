import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../components/Calendar.css";

function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Fehler beim Laden der Todos");
        const todos = await res.json();

        const todoEvents = todos
          .filter((todo) => todo.dueDate)
          .map((todo) => ({
            title: `📌 ${todo.title}`,
            date: todo.dueDate.slice(0, 10),
            className:
              todo.column.includes("Done")
                ? "done"
                : todo.column.includes("Learning")
                ? "learning"
                : todo.column.includes("Level 2")
                ? "level2"
                : todo.column.includes("Level 3")
                ? "level3"
                : "task",
          }));

        setEvents(todoEvents);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchTodos();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📆 Mon calendrier pro</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}

export default CalendarComponent;