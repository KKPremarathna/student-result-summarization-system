import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  MessageSquare, 
  FileText, 
  User, 
  ChevronRight
} from "lucide-react";
import "../styles/AdminLayout.css";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/adminhome", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/adduser", icon: <UserPlus size={20} />, label: "Manage Access" },
    { path: "/studentlist", icon: <Users size={20} />, label: "Students" },
    { path: "/lecturelist", icon: <Users size={20} />, label: "Lecturers" },
    { path: "/admincomplaint", icon: <MessageSquare size={20} />, label: "Complaints" },
    { path: "/adminresults", icon: <FileText size={20} />, label: "Senate Submissions" },
    { path: "/adminprofile", icon: <User size={20} />, label: "My Profile" },
  ];

  return (
    <div className="sb-container">
      <nav className="sb-nav">
        <div className="sb-nav-section">ADMINISTRATION</div>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sb-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <div className="sb-item-icon">{item.icon}</div>
            <span className="sb-item-label">{item.label}</span>
            {location.pathname === item.path && <ChevronRight size={16} className="sb-item-chevron" />}
          </Link>
        ))}
      </nav>

      {/* Footer and branding removed to match InnerNavbar style */}
    </div>
  );
};

export default AdminSidebar;
