import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import TaskForum from "./components/TaskForum";
import TaskList from "./components/TaskList";
import BackButton from "./components/BackButton";
import TopNavBar from "./components/TopNavbar";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import CalendarComponent from "./components/CalendarComponent";
import NotificationsPage from "./page/NotificationsPage";
import MessagesPage from "./page/MessagesPage";
import ProfilePage from "./page/ProfilePage";

import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // neu

  // ✅ Token aus localStorage beim Start prüfen
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optional: Hier kannst du prüfen, ob der Token noch gültig ist
      setIsLoggedIn(true);
    }
    setLoading(false); // Ladezustand beenden
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleLogin = (token) => {
    localStorage.setItem("token", token); // Token speichern
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const LoggedInLayout = () => (
    <div className="app">
      <TopNavBar onLogout={handleLogout} />
      <Header toggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <BackButton />
          <CalendarComponent />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/forum" element={<TaskForum />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );

  if (loading) {
    // Optional: Ladeanzeige, bis geprüft ist ob token da ist
    return <div>Lädt...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/*"
        element={isLoggedIn ? <LoggedInLayout /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
