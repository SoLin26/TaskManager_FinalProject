import React, { useState } from "react";
import axios from "axios";

const InviteForm = ({ boardId, onInviteSuccess }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Kein Token gefunden, bitte anmelden");
        return;
      }

      const res = await axios.post(
        `http://localhost:8080api/boards/${boardId}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setEmail("");
      if (onInviteSuccess) onInviteSuccess();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Fehler beim Einladen des Benutzers"
      );
    }
  };

  return (
    <form onSubmit={handleInvite} style={{ marginTop: "1rem" }}>
      <input
        type="email"
        placeholder="Email des Benutzers einladen"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button type="submit">Einladen</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default InviteForm;
