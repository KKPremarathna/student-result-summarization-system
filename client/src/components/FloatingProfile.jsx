import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/FloatingProfile.css";

function FloatingProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Define admin paths (case-insensitive)
  const adminPaths = [
    "/adminhome",
    "/adduser",
    "/addstudent",
    "/studentlist",
    "/addlecture",
    "/lecturelist",
    "/admincomplaint",
    "/adminresults",
    "/adminprofile",
    "/setting"
  ];

  const currentPath = location.pathname.toLowerCase();
  const isAdminRoute = adminPaths.some(path => currentPath === path) || currentPath.startsWith("/admin");

  if (!user || user.role !== "admin" || !isAdminRoute) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const second = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + second;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="admin-profile-floating">
      <div className="admin-profile-floating__icon" onClick={toggleDropdown}>
        {getInitials(user.firstName, user.lastName)}
      </div>
      
      {isDropdownOpen && (
        <div className="admin-profile-floating__dropdown">
          <div className="admin-profile-floating__header">
            <p className="admin-profile-floating__name">{user.firstName} {user.lastName}</p>
            <p className="admin-profile-floating__email">{user.email}</p>
          </div>
          <div className="admin-profile-floating__divider"></div>
          <button className="admin-profile-floating__logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default FloatingProfile;
