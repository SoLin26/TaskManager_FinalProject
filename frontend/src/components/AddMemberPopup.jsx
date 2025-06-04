import { useState } from "react";
import './AddMemberPopup.css';

function AddMemberPopup({ onClose, onAdd }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Anna Müller",
    "Sonja Linhard",
    "Se-a",
    "Chaima Mnasri",
    "Emma Wagner",
    "Fatima Ali",
  ]);

  const filteredUsers = suggestions.filter(user =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selected) return;

    try {
      const response = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: selected }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("❌ Fehler: " + errorData.error);
        return;
      }

      const data = await response.json();
      console.log("✅ Mitglied gespeichert:", data);

      if (!suggestions.includes(selected)) {
        setSuggestions([...suggestions, selected]);
      }

      onAdd(selected);
      setConfirmation(true);
      setSearch("");
      setSelected(null);

      setTimeout(() => {
        setConfirmation(false);
        onClose();
      }, 1000);
    } catch (err) {
      alert("❌ Fehler beim Speichern");
      console.error(err);
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <span>👤 Mitglied hinzufügen</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="popup-body">
        {confirmation && (
          <div className="confirmation-message">✅ Mitglied hinzugefügt!</div>
        )}

        <input
          type="text"
          placeholder="Mitgliedsname eingeben"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(null);
          }}
        />

        {search && (
          <ul className="suggestion-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearch(user);
                    setSelected(user);
                  }}
                  className={selected === user ? "selected" : ""}
                >
                  {user}
                </li>
              ))
            ) : (
              <li className="no-result">Kein Ergebnis</li>
            )}
          </ul>
        )}

        <button className="add-btn" disabled={!selected} onClick={handleAdd}>
          ➕ Hinzufügen
        </button>
      </div>
    </div>
  );
}

export default AddMemberPopup;
