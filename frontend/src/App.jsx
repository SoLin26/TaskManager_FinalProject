import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Userdaten speichern

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optional: Hier Token prüfen, Userdaten aus Token holen
      // Für Demo nehmen wir an, User ist eingeloggt
      setIsLoggedIn(true);

      // Optional: User-Daten vom Backend holen oder aus Token extrahieren
      // Zum Beispiel aus localStorage oder Token payload decodieren
      // Hier Dummy-Daten:
      setUser({
        fullname: "Max Mustermann",
        username: "maxm",
        email: "max@beispiel.de",
        profileImage: "https://www.w3schools.com/howto/img_avatar.png",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setUser(userData);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/"); // Nach Logout auf LandingPage navigieren
  };

  const LoggedInLayout = () => (
    <div className="app">
      <TopNavBar user={user} onLogout={handleLogout} />
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );

  if (loading) {
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
