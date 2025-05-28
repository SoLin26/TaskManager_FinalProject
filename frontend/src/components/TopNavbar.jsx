import React, { useState } from "react";
import "../components/TopNavbar.css"; 

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

      {/* Popups */}
      {activePopup === "notifications" && (
        <div className="popup">📩 Du hast keine neuen Benachrichtigungen.</div>
      )}
      {activePopup === "addMember" && (
        <div className="popup">
          <input type="text" placeholder="Mitgliedsname eingeben" />
          <button>Hinzufügen</button>
        </div>
      )}
      {activePopup === "search" && (
        <div className="popup">
          <input type="text" placeholder="Suchen..." />
        </div>
      )}
      {activePopup === "help" && (
        <div className="popup">
          <p>Brauchst du Hilfe? Besuche unser <a href="#">monday.com</a>.</p>
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
