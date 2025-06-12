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

// ✅ Pages
import NotificationsPage from "./page/NotificationsPage";
import MessagesPage from "./page/MessagesPage";
import ProfilePage from "./page/ProfilePage";
import BoardsPage from "./page/BoardsPage";
import AddCardPage from "../src/page/AddCardPage";
import CopyListPage from "../src/page/CopyListPage";
import MoveListPage from "../src/page/MoveListPage";
import MoveAllCardsPage from "../src/page/MoveAllCardsPage";
import ArchiveListPage from "../src/page/ArchiveListPage";
import CreateRulePage from "../src/page/CreateRulePage";

// ✅ Components
import BoardDetail from "./components/BoardDetail";

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

      {isLoggedIn ? (
        <>
          <Route path="/dashboard" element={<LoggedInLayout><Dashboard /></LoggedInLayout>} />
          <Route path="/tasks" element={<LoggedInLayout><TaskList /></LoggedInLayout>} />
          <Route path="/forum" element={<LoggedInLayout><TaskForum /></LoggedInLayout>} />
          <Route path="/notifications" element={<LoggedInLayout><NotificationsPage /></LoggedInLayout>} />
          <Route path="/messages" element={<LoggedInLayout><MessagesPage /></LoggedInLayout>} />
          <Route path="/profile" element={<LoggedInLayout><ProfilePage /></LoggedInLayout>} />
          <Route path="/boards" element={<LoggedInLayout><BoardsPage /></LoggedInLayout>} />
          <Route path="/boards/:id" element={<LoggedInLayout><BoardDetail /></LoggedInLayout>} />

          {/* Pages liées aux actions de colonnes */}
          <Route path="/add-card" element={<LoggedInLayout><AddCardPage /></LoggedInLayout>} />
          <Route path="/copy-list" element={<LoggedInLayout><CopyListPage /></LoggedInLayout>} />
          <Route path="/move-list" element={<LoggedInLayout><MoveListPage /></LoggedInLayout>} />
          <Route path="/move-all-cards" element={<LoggedInLayout><MoveAllCardsPage /></LoggedInLayout>} />
          <Route path="/archive-list" element={<LoggedInLayout><ArchiveListPage /></LoggedInLayout>} />
          <Route path="/create-rule" element={<LoggedInLayout><CreateRulePage /></LoggedInLayout>} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <>
          {/* Page publique pour ajout de membres */}
          <Route path="/add" element={<AddMemberPopup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
