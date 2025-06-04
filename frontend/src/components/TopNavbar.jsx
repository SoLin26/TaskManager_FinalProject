import React, { useState, useEffect } from "react";
import AddMemberPopup from "./AddMemberPopup";
import "./TopNavbar.css";
import "./AddMemberPopup.css";

function TopNavBar({ onLogout }) {
  const [activePopup, setActivePopup] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // User-Daten aus localStorage laden
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const togglePopup = (popupName) => {
    if (popupName === "profile") {
      setShowProfileDetails(false);
    }
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const closeProfilePopup = () => {
    setShowProfileDetails(false);
    setActivePopup(null);
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
        <div className="popup profile-popup">
          {!showProfileDetails && (
            <>
              <p>👋 Hallo, {user?.fullname || "Nutzer"}!</p>
              <button onClick={() => setShowProfileDetails(true)}>Profil ansehen</button>
              <button
                onClick={() => {
                  closeProfilePopup();
                  onLogout();
                }}
              >
                Logout
              </button>
              <button onClick={closeProfilePopup}>Schließen</button>
            </>
          )}

          {showProfileDetails && (
            <>
              <h3>Profil Details</h3>
              <p><strong>Vollständiger Name:</strong> {user?.fullname || "-"}</p>
              <p><strong>Username:</strong> {user?.username || "-"}</p>
              <p><strong>Email:</strong> {user?.email || "-"}</p>
              <button onClick={() => setShowProfileDetails(false)}>Zurück</button>
              <button onClick={closeProfilePopup}>Schließen</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TopNavBar;
