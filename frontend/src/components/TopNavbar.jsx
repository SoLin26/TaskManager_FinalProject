import React, { useState, useEffect } from "react";
import AddMemberPopup from "./AddMemberPopup";
import "./TopNavbar.css";
import "./AddMemberPopup.css";

function TopNavBar({ onLogout }) {
  const [activePopup, setActivePopup] = useState(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        console.log(response.statusText);
        
        throw new Error("Fehler bei der Suche: " + response.statusText);
      }
      const data = await response.json();
      console.log('data line 38: ',data);
      
     // setSearchResults(data.results || []);
    } catch (error) {
      console.error("Fehler bei der Suche:", error);
    }
  };

  const sendMarketingConsent = async (consent) => {
    try {
      const response = await fetch("/api/notifications/marketing-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent }),
      });

      const result = await response.json();
      alert(`Danke! Deine Auswahl wurde gespeichert: ${consent ? "Ja, gerne!" : "Nein, danke"}`);
      setActivePopup(null);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
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
        <div className="popup notification-popup">
          <div className="notification-header">
            <h3>Benachrichtigungen</h3>
            <label className="switch-container">
              <span>Nur ungelesene anzeigen</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </label>
          </div>

          <hr />

          <div className="notification-body">
            <p><strong>Hallo!</strong></p>
            <p>
              Todoliste und Atlassian ( Mutterunternehmen) würden gerne mit Ihnen
              in Verbindung bleiben. Dürfen wir Ihnen gelegentlich Marketing-Mails senden?
            </p>
            <div className="notification-buttons">
              <button className="btn-secondary" onClick={() => sendMarketingConsent(false)}>
                Nein, danke
              </button>
              <button className="btn-primary" onClick={() => sendMarketingConsent(true)}>
                Ja, gerne!
              </button>
            </div>
            <div className="notification-image">
             <img src="Photo/fox1.jpg" alt="Fox" />

            </div>
            <p className="no-unread">Keine ungelesenen Benachrichtigungen</p>
          </div>
        </div>
      )}

      {activePopup === "addMember" && (
        <AddMemberPopup
          onClose={() => setActivePopup(null)}
          onAdd={(member) => console.log("Mitglied hinzugefügt:", member)}
        />
      )}

      {activePopup === "search" && (
        <div className="popup search-popup">
          <input
            type="text"
            placeholder="Suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>🔍 Suchen</button>

          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <div key={index} className="search-item">
                  <strong>{item.type}</strong>: {item.title}
                </div>
              ))
            ) : (
              <p>Keine Ergebnisse</p>
            )}
          </div>
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
          {!showProfileDetails ? (
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
          ) : (
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
