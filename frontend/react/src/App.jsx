import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import TaskForum from "./components/TaskForum";
import TaskList from "./components/TaskList";
import BackButton from "./components/BackButton";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={darkMode ? "app dark" : "app"}>
        <Header toggleDarkMode={() => setDarkMode(!darkMode)} />
        <div className="main-content">
          <Sidebar />
          <main className="content">
            <BackButton />
            <Routes>
              <Route path="/" element={<TaskForum />} />
              <Route path="/tasks" element={<TaskList />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
