import { NavLink, Outlet } from 'react-router-dom';

import "../styles/DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
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
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>📊</span> Overview
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>👤</span> Profile
            </NavLink>

             <NavLink
              to="/dashboard/habits"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>✅</span> Habits
            </NavLink>

           
              <NavLink
              to="/dashboard/progress"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
               <span>📈</span> Progress 
            </NavLink>

           

          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <h2 className="logo">Lifemate</h2>
        <button className="menu-btn">☰</button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

