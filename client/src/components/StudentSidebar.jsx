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
    { name: "Dashboard", path: "/student/home", icon: Home },
    { name: "Subject Results", path: "/student/subject-wise", icon: BookOpen },
    { name: "My Results", path: "/student/student-wise", icon: FileText },
    { name: "Complaints", path: "/student/complaints", icon: MessageSquare },
    { name: "Profile Settings", path: "/student/profile", icon: Settings },
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

export default StudentSidebar;
