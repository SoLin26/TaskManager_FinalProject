import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import papillion from "../../Photo/papillion.jpg";

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/boards/${id}`,
          { withCredentials: true } // ✅ Cookie senden
        );
        setBoard(response.data);
        setNewTitle(response.data.title);
        setError(null);
      } catch (error) {
        setError("Fehler beim Laden des Boards");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  const handleInvite = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/boards/${id}/invite`,
        { email: emailToInvite },
        { withCredentials: true } // ✅ Cookie senden
      );
      alert("Einladung gesendet!");
      setEmailToInvite("");
    } catch (err) {
      alert(err.response?.data?.message || "Fehler beim Einladen");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/boards/${id}`,
        { title: newTitle },
        { withCredentials: true } // ✅ Cookie senden
      );
      setBoard(response.data);
      alert("Board aktualisiert");
    } catch {
      alert("Fehler beim Aktualisieren");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Board wirklich löschen?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/boards/${id}`,
        { withCredentials: true } // ✅ Cookie senden
      );
      alert("Board gelöscht");
      navigate("/boards");
    } catch {
      alert("Fehler beim Löschen");
    }
  };

  // Animation keyframes (injected via JS)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const styles = {

    pageBackground: {
      backgroundColor: "lightblue",
      backgroundImage: `url(${papillion})`,
       backdropFilter: "blur(4px)",
       


      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      padding: "1rem",
      animation: "fadeIn 2s ease-in-out",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "rgba(227, 72, 191, 0.9)",
      padding: "20px",
      borderRadius: "12px",
    },
    input: {
      padding: "8px",
      fontSize: "1rem",
      width: "60%",
      marginRight: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    btn: {
      padding: "8px 16px",
      fontSize: "1rem",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    updateBtn: {
      backgroundColor: "#10b981",
    },
    deleteBtn: {
      backgroundColor: "#ef4444",
      marginLeft: "10px",
    },
    inviteBtn: {
      backgroundColor: "#3b82f6",
    },
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!board) return <p>Kein Board gefunden</p>;

  return (
<<<<<<< HEAD
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Board: {board.title}</h2>

      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Boardtitel ändern"
        style={{
          padding: "8px",
          fontSize: "1rem",
          width: "60%",
          marginRight: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleUpdate}
        style={{
          padding: "8px 16px",
          fontSize: "1rem",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#059669")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#10b981")
        }
      >
        Ändern
      </button>

      <button
        onClick={handleDelete}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          fontSize: "1rem",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#b91c1c")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#ef4444")
        }
      >
        Löschen
      </button>

      <p style={{ marginTop: "20px" }}>
        <strong>Owner:</strong> {board.owner?.fullname} ({board.owner?.email})
      </p>

      <h3>Mitglieder</h3>
      {board.members && board.members.length > 0 ? (
        <ul>
          {board.members.map((member) => (
            <li key={member.user._id}>
              {member.user.fullname} ({member.user.email}) - Rolle: {member.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>Keine Mitglieder gefunden.</p>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h4>Mitglied einladen</h4>
=======
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h2>Board: {board.title}</h2>
>>>>>>> 9e562dc (faux)
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Boardtitel ändern"
          style={styles.input}
        />
        <button
<<<<<<< HEAD
          onClick={handleInvite}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563eb")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#3b82f6")
          }
=======
          onClick={handleUpdate}
          style={{ ...styles.btn, ...styles.updateBtn }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
>>>>>>> 9e562dc (faux)
        >
          Ändern
        </button>
        <button
          onClick={handleDelete}
          style={{ ...styles.btn, ...styles.deleteBtn }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
        >
          Löschen
        </button>

        <p style={{ marginTop: "20px" }}>
          <strong>Owner:</strong> {board.owner?.fullname} ({board.owner?.email})
        </p>

        <h3>Mitglieder</h3>
        {board.members && board.members.length > 0 ? (
          <ul>
            {board.members.map((member) => (
              <li key={member.user._id}>
                {member.user.fullname} ({member.user.email}) - Rolle: {member.role}
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Mitglieder gefunden.</p>
        )}

        <div style={{ marginTop: "2rem" }}>
          <h4>Mitglied einladen</h4>
          <input
            type="email"
            value={emailToInvite}
            onChange={(e) => setEmailToInvite(e.target.value)}
            placeholder="E-Mail eingeben"
            style={styles.input}
          />
          <button
            onClick={handleInvite}
            style={{ ...styles.btn, ...styles.inviteBtn }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            Einladen
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
