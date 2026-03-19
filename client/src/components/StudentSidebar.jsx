import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  Menu,
  GraduationCap
} from "lucide-react";
import "../styles/Sidebar.css";

function StudentSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: "/student/home", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/student/subject-wise", label: "Subject Results", icon: <BookOpen size={20} /> },
    { path: "/student/student-wise", label: "My Results", icon: <FileText size={20} /> },
    { path: "/student/complaints", label: "Complaints", icon: <MessageSquare size={20} /> },
    { path: "/student/profile", label: "Profile Settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`sidebar-premium ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <GraduationCap size={24} className="logo-icon" />
          {isOpen && <span className="logo-text">Student Portal</span>}
        </div>
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {isOpen && <div className="nav-label">Main Menu</div>}
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
              <Link to={item.path} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-text">{item.label}</span>}
              </Link>
            </li>
          ))}
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

export default StudentSidebar;
