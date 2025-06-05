import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaListUl, FaRocket } from "react-icons/fa";

const categories = {}; // kannst du später befüllen, wenn du willst

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Kategorien</h2>

      <Link to="/tasks">
        <FaTasks /> Aufgaben
      </Link>
      <Link to="/epics">
        <FaListUl /> Epics
      </Link>
      <Link to="/sprints">
        <FaRocket /> Sprints
      </Link>
      <Link to="/dashboard">📋 Übersicht (Dashboard)</Link>

      {Object.entries(categories).map(([cat, subs]) => (
        <div key={cat}>
          <strong>{cat}</strong>
          <ul>
            {subs.map((sub) => (
              <li key={sub}>
                <Link to={`/tasks?cat=${cat}&sub=${sub}`}>{sub}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
