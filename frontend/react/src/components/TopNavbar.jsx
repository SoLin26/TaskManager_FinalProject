import React from "react";
import { FaBell, FaEnvelope, FaUserPlus, FaSearch, FaQuestionCircle, FaTh } from "react-icons/fa";

function TopNavBar() {
  return (
    <div style={styles.navbar}>
      <div style={styles.left}></div>

      <div style={styles.right}>
        <FaBell style={styles.icon} title="Benachrichtigungen" />
        <div style={styles.iconWithBadge}>
          <FaEnvelope style={styles.icon} title="Nachrichten" />
          <span style={styles.badge}>1</span>
        </div>
        <FaUserPlus style={styles.icon} title="Mitglied hinzufügen" />
        <FaSearch style={styles.icon} title="Suche" />
        <FaQuestionCircle style={styles.icon} title="Hilfe" />
        <FaTh style={styles.icon} title="Apps" />
        <div style={styles.profile}>C</div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#1f1f2e",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    alignItems: "center",
  },
  right: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  icon: {
    fontSize: "18px",
    cursor: "pointer",
  },
  iconWithBadge: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "10px",
    padding: "2px 5px",
  },
  profile: {
    backgroundColor: "#ccc",
    color: "#333",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
};

export default TopNavBar;
