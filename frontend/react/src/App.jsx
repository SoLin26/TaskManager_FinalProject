import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskForum from "./components/TaskForum";
import TaskList from "./components/TaskList"; // neue Komponente zum Anzeigen der Aufgaben

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <h1>🗂️ Mein Aufgabenplaner</h1>
        <Routes>
          <Route path="/" element={<TaskForum />} />
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
};

export default App;
