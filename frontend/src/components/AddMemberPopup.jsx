import { useState } from "react";
import './AddMemberPopup.css';

const users = [
  "Anna Müller",
  "Sonja Linhard",
  "Se-a",
  "Chaima Mnasri",
  "Emma Wagner",
  "Fatima Ali",
];

function AddMemberPopup({ onClose, onAdd }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmation, setConfirmation] = useState(false);

  const filteredUsers = users.filter(user =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (selected) {
      onAdd(selected);
      setConfirmation(true);
      setSearch("");
      setSelected(null);
      setTimeout(() => {
        setConfirmation(false);
        onClose();
      }, 1000);
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
          Hinzufügen
        </button>
      </div>
    </div>
  );
}

export default AddMemberPopup;
