import { useState } from "react";
import './AddMemberPopup.css';

export default function AddMemberPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Mitglied");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.includes("@")) {
      setMessage("❌ Ungültige E-Mail-Adresse");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        setMessage("❌ Fehler: " + error.message);
      } else {
        setMessage("✅ Einladung gesendet an " + email);
        setEmail("");
      }
    } catch (err) {
      setMessage("❌ Netzwerkfehler");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-container">
      <h2>👥 Mitglied einladen</h2>

      <input
        type="email"
        placeholder="E-Mail-Adresse eingeben"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Mitglied">Mitglied</option>
        <option value="Admin">Admin</option>
      </select>

      <button onClick={handleInvite} disabled={loading || !email}>
        📩 Einladung senden
      </button>

      {message && <p className="info-message">{message}</p>}
    </div>
  );
}