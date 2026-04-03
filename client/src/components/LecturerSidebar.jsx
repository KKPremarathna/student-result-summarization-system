import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import { 
  LayoutDashboard, 
  BarChart3, 
  PlusCircle, 
  ClipboardList, 
  MessageSquare, 
  CheckSquare, 
  Settings,
  Menu,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from "../context/ThemeContext";

function Sidebar({ isOpen, toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: "Lecturer Home", path: "/lecturer/home", icon: LayoutDashboard },
    { name: "View Results", path: "/lecturer/results", icon: BarChart3 },
    { name: "Manage Subjects", path: "/lecturer/addsubject", icon: PlusCircle },
    { name: "Incourse Marks", path: "/lecturer/addincourse", icon: ClipboardList },
    { name: "Complaints", path: "/lecturer/complaints", icon: MessageSquare },
    { name: "Final Result", path: "/lecturer/final", icon: CheckSquare },
    { name: "Profile Settings", path: "/lecturer/setting", icon: Settings },
  ];

  return (
    <aside className={`sidebar-premium ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <LayoutDashboard size={24} className="logo-icon" />
          {isOpen && <span className="logo-text">Lecturer Portal</span>}
        </div>
        <div className="sidebar-header-actions">
           <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
           </button>
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        {isOpen && <div className="nav-label">Main Menu</div>}
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className={isActive ? "active" : ""}>
                <Link to={item.path} className="nav-link">
                  <Icon size={20} className="nav-icon" />
                  {isOpen && <span className="nav-text">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;