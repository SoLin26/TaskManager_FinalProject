import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../components/Calendar.css";
import blumen from "../../Photo/fleure12.png";

function CalendarComponent() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [events, setEvents] = useState([]);

  // Boards laden
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/boards", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Fehler beim Laden der Boards");
        const boardsData = await res.json();
        setBoards(boardsData);

        // Wenn noch kein Board ausgewählt, das erste automatisch setzen
        if (boardsData.length > 0 && !selectedBoardId) {
          setSelectedBoardId(boardsData[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBoards();
  }, [selectedBoardId]);

  // Todos / Tasks für ausgewähltes Board laden
  useEffect(() => {
    if (!selectedBoardId) return;

    const fetchTodos = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/todos?boardId=${selectedBoardId}`,
          {
            credentials: "include",
          }
        );
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

    fetchTodos();
  }, [selectedBoardId]);

  return (
    <div style={styles.pageBackground}>
      <h2>📆 Mon calendrier pro</h2>

      {/* Dropdown für Board-Auswahl */}
      <label htmlFor="boardSelect" style={{ fontWeight: "bold" }}>
        Board auswählen:{" "}
      </label>
      <select
        id="boardSelect"
        value={selectedBoardId}
        onChange={(e) => setSelectedBoardId(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.3rem" }}
      >
        {boards.map((board) => (
          <option key={board._id} value={board._id}>
            {board.title}
          </option>
        ))}
      </select>

      {/* Kalender mit den Events */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundImage: `url(${blumen})`,
    backgroundColor: "pink",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  },
};

export default CalendarComponent;
