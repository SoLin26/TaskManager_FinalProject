import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

// Komponenten
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
import BoardsPage from "./page/BoardsPage";
import BoardDetail from "./components/BoardDetail";

import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Auth-Status beim Laden prüfen
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("Nicht eingeloggt:", error.message);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // Dark Mode anwenden
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  // Login erfolgreich
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    navigate("/dashboard");
  };

  // Logout durchführen
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.error("Logout fehlgeschlagen", e);
    }
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // Layout für eingeloggte Nutzer
  const LoggedInLayout = ({ children }) => {
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

  // Während Auth-Status geladen wird
  if (loading) {
    return <div>Lädt...</div>;
  }

  return (
    <Routes>
      {/* LandingPage öffentlich */}
      <Route path="/" element={<LandingPage onLogin={handleLogin} />} />

      {/* Geschützte Routen */}
      {isLoggedIn ? (
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
            path="/boards"
            element={<LoggedInLayout><BoardsPage /></LoggedInLayout>}
          />
          <Route
            path="/boards/:id"
            element={<LoggedInLayout><BoardDetail /></LoggedInLayout>}
          />

          {/* Fallback für eingeloggte Nutzer */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        // Fallback für nicht eingeloggte Nutzer
        <Route path="*" element={<Navigate to="/" replace />} />
      )}

      {/* Öffentlich zugänglicher Popup-Test */}
      <Route path="/Add" element={<AddMemberPopup />} />
    </Routes>
  );
}

export default App;
