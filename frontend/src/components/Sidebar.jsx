import React from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaListUl, FaRocket } from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Kategorien</h2>

      <Link to="/dashboard">📋 Übersicht (Dashboard)</Link>
      <Link to="/tasks"><FaTasks /> Aufgaben</Link>
      <Link to="/epics"><FaListUl /> Epics</Link>
      <Link to="/sprints"><FaRocket /> Sprints</Link>

      <h3>Boards</h3>
      <ul>
        <li><Link to="/add-card">➕ Karte hinzufügen</Link></li>
        <li><Link to="/copy-list">📋 Liste kopieren</Link></li>
        <li><Link to="/move-list">↔️ Liste verschieben</Link></li>
        <li><Link to="/move-all-cards">📦 Alle Karten verschieben</Link></li>
        <li><Link to="/archive-list">🗃️ Liste archivieren</Link></li>
        <li><Link to="/create-rule">⚙️ Regel erstellen</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
