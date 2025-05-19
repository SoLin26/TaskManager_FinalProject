import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import TaskForum from "./components/TaskForum";
import TaskList from "./components/TaskList";
import BackButton from "./components/BackButton";
import TopNavBar from "./components/TopNavbar";
import Dashboard from "./components/Dashboard";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <Router>
      <div className="app">
        <TopNavBar />
        <Header toggleDarkMode={() => setDarkMode(!darkMode)} />

        <div className="main-content">
          <Sidebar />
          <main className="content">
            <BackButton />
            
            {/* ✅ ALLE Routen gehören hier rein */}
            <Routes>
              <Route path="/" element={<TaskForum />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
