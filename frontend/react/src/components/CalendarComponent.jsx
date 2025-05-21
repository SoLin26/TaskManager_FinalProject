import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../components/Calendar.css"; // Pour les couleurs personnalisées

function CalendarComponent() {
  const [events, setEvents] = useState([
    { title: "🎯 Epic: Design", date: "2025-05-22", className: "epic" },
    { title: "📝 Task: Schreiben", date: "2025-05-25", className: "task" },
    { title: "📅 Meeting: Team", date: "2025-05-28", className: "meeting" },
  ]);

  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "epic" });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date) {
      setEvents([...events, { title: newEvent.title, date: newEvent.date, className: newEvent.type }]);
      setNewEvent({ title: "", date: "", type: "epic" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📆 Mon calendrier pro</h2>

      <form onSubmit={handleAddEvent} className="event-form">
  <input
    type="text"
    placeholder="📝 Titre de l’événement"
    value={newEvent.title}
    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
    required
  />
  <input
    type="date"
    value={newEvent.date}
    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
    required
  />
  <select
    value={newEvent.type}
    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
  >
    <option value="epic">Epic</option>
    <option value="task">Task</option>
    <option value="meeting">Meeting</option>
  </select>
  <button type="submit">➕ Ajouter</button>
</form>


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
