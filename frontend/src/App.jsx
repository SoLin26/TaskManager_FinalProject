import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

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
import AddMemberPopup from "./components/AddMemberPopup";
import NotificationsPage from "./page/NotificationsPage";
import MessagesPage from "./page/MessagesPage";
import ProfilePage from "./page/ProfilePage";

import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
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
    navigate("/");
  };

  const LoggedInLayout = ({ children }) => {
    // Kalender nur auf Dashboard anzeigen
    const showCalendar = location.pathname === "/dashboard";

    return (
      <div className="app">
        <TopNavBar user={user} onLogout={handleLogout} />
        <Header toggleDarkMode={() => setDarkMode(!darkMode)} />
        <div className="main-content">
          <Sidebar />
          <main className="content">
            <BackButton />
            {showCalendar && <CalendarComponent />}
            {children}
          </main>
        </div>
        <Footer />
      </div>
    );
  };

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

      {isLoggedIn && (
        <>
          <Route
            path="/dashboard"
            element={<LoggedInLayout><Dashboard /></LoggedInLayout>}
          />
          <Route
            path="/tasks"
            element={<LoggedInLayout><TaskList /></LoggedInLayout>}
          />
          <Route
            path="/forum"
            element={<LoggedInLayout><TaskForum /></LoggedInLayout>}
          />
          <Route
            path="/notifications"
            element={<LoggedInLayout><NotificationsPage /></LoggedInLayout>}
          />
          <Route
            path="/messages"
            element={<LoggedInLayout><MessagesPage /></LoggedInLayout>}
          />
          <Route
            path="/profile"
            element={<LoggedInLayout><ProfilePage /></LoggedInLayout>}
          />
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </>
      )}
          <Route path="/Add" element={<AddMemberPopup />} />
      {!isLoggedIn && (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
}

export default App;
