import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  MessageSquare,
  FileText,
  User,
  ChevronRight,
  ChevronLeft,
  Menu,
  ShieldCheck,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/AdminLayout.css";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/adminhome", icon: LayoutDashboard },
    { name: "Manage Access", path: "/adduser", icon: UserPlus },
    { name: "Students", path: "/studentlist", icon: Users },
    { name: "Lecturers", path: "/lecturelist", icon: Users },
    { name: "Complaints", path: "/admincomplaint", icon: MessageSquare },
    { name: "Senate Submissions", path: "/adminresults", icon: FileText },
    { name: "My Profile", path: "/adminprofile", icon: User },
  ];

  return (
    <div className={`sb-container ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShieldCheck size={24} className="logo-icon" />
          {isOpen && <span className="logo-text">Admin Portal</span>}
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

      <nav className="sb-nav">
        {isOpen && <div className="sb-nav-section">ADMINISTRATION</div>}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sb-item ${isActive ? "active" : ""}`}
            >
              <div className="sb-item-icon"><Icon size={20} /></div>
              {isOpen && <span className="sb-item-label">{item.name}</span>}
              {isOpen && isActive && <ChevronRight size={16} className="sb-item-chevron" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
