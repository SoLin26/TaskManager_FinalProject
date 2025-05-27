import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import NotificationsPage from "../src/page/NotificationsPage";
import MessagesPage from "../src/page/MessagesPage";
import ProfilePage from "../src/page/ProfilePage";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login-Zustand

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const LoggedInLayout = () => (
    <div className="app">
      <TopNavBar />
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

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <LandingPage onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />
      <Route
        path="/*"
        element={
          isLoggedIn ? <LoggedInLayout /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}
export default App;
