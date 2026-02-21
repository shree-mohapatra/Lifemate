import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="logo-container">
            <img
              className="Logo-img"
              src="/LifeMateLogo.jpeg"
              alt="Lifemate Logo"
            />
            <h2 className="logo-text">Lifemate</h2>
          </div>

          <nav className="nav">
            <NavLink to="/dashboard" end className="nav-item" onClick={closeMenu}>
              📊 Overview
            </NavLink>

            <NavLink to="/dashboard/profile" className="nav-item" onClick={closeMenu}>
              👤 Profile
            </NavLink>

            <NavLink to="/dashboard/habits" className="nav-item" onClick={closeMenu}>
              ✅ Habits
            </NavLink>

            <NavLink to="/dashboard/progress" className="nav-item" onClick={closeMenu}>
              📈 Progress
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Overlay (click outside to close) */}
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}

      {/* Mobile Header */}
      <header className="mobile-header">
        <h2 className="logo">Lifemate</h2>
        <button className="menu-btn" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
