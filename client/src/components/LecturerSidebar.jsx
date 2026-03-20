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
  ChevronLeft
} from 'lucide-react';

function Sidebar({ isOpen, toggleSidebar }) {
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
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
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

      {isOpen && (
        <div className="sidebar-footer">
          <p className="footer-version">v2.1.0-winter</p>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;