import React from "react";
import { Link } from "react-router-dom";

const categories = {
  Arbeit: ["Büro", "Termine", "Kita / Schule / etc"],
  "Privat/persönliches": ["Sport", "Einkauf", "Freizeitplanung"],
  "Bildung/Studium": [],
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Kategorien</h2>
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
