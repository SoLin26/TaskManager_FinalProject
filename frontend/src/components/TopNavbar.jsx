import React, { useState } from "react";
import AddMemberPopup from './AddMemberPopup';
import './TopNavbar.css';
import './AddMemberPopup.css';

function TopNavBar() {
  const [activePopup, setActivePopup] = useState(null);

  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  return (
    <div className="top-navbar">
      <button onClick={() => togglePopup("notifications")}>🔔 Benachrichtigungen</button>
      <button onClick={() => togglePopup("addMember")}>👥 Mitglied hinzufügen</button>
      <button onClick={() => togglePopup("search")}>🔍 Suche öffnen</button>
      <button onClick={() => togglePopup("help")}>❓ Hilfe anzeigen</button>
      <button onClick={() => togglePopup("apps")}>📱 Apps öffnen</button>
      <button onClick={() => togglePopup("profile")}>👤 Profil</button>

      {activePopup === "notifications" && (
        <div className="popup">📩 Du hast keine neuen Benachrichtigungen.</div>
      )}

      {activePopup === "addMember" && (
        <AddMemberPopup
          onClose={() => setActivePopup(null)}
          onAdd={(member) => console.log("Mitglied hinzugefügt:", member)}
        />
      )}

      {activePopup === "search" && (
        <div className="popup">
          <input type="text" placeholder="Suchen..." />
        </div>
      )}

      {activePopup === "help" && (
        <div className="popup">
          <p>
            🤔 Brauchst du Hilfe?{" "}
            <a href="https://monday.com" target="_blank" rel="noopener noreferrer">
              👉 Hier geht's zu monday.com
            </a>
          </p>
        </div>
      )}

      {activePopup === "apps" && (
        <div className="popup">
          <p>Apps: Kalender, Chat, Dokumente ...</p>
        </div>
      )}

      {activePopup === "profile" && (
        <div className="popup">
          <p>👋 Hallo, World!</p>
          <button>Profil ansehen</button>
          <button>Logout</button>
        </div>
      )}
    </div>
  );
}

export default TopNavBar;
