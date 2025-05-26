import React from "react";

function Header({ toggleDarkMode }) {
  return (
    <header className="header">
      <h1>KOPFSACHE</h1>
      <button onClick={toggleDarkMode} className="darkmode-btn">
        🌓
      </button>
    </header>
  );
}

export default Header;
