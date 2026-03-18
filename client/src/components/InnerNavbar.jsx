import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, LogOut, X } from "lucide-react";
import academetLogo from "../assets/images/academet-logo.png";
import "../styles/InnerNavbar.css";

function InnerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Complaint", message: "A student filed a complaint about marks.", time: "2 mins ago", selected: false },
    { id: 2, title: "Course Update", message: "CS3042 marks have been updated.", time: "1 hour ago", selected: false },
    { id: 3, title: "System Alert", message: "Maintenance scheduled for tonight.", time: "3 hours ago", selected: false },
  ]);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const authPaths = ["/signin", "/signup"];
  const isAuthPage = authPaths.includes(location.pathname);
  const showUserActions = user && !isAuthPage;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileOpen(false);
    navigate("/signin");
  };

  const markAsRead = () => {
    setNotifications([]);
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const second = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + second;
  };

  return (
    <header className="inner-navbar">
      <div className="inner-navbar__brand">
        <Link to="/" className="inner-navbar__logo-link">
          <img
            src={academetLogo}
            alt="Academet Logo"
            className="inner-navbar__logo"
          />
          <h1 className="inner-navbar__title">Academet</h1>
        </Link>
      </div>

      <nav className="inner-navbar__nav">
        <div className="home-navbar__links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/calendar">Academic Calendar</Link>
        </div>

        {showUserActions && (
          <div className="inner-navbar__user-actions">
            <div className="notification-wrapper">
              <button 
                className="navbar-icon-btn" 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Notifications"
              >
                <Bell size={24} />
                {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
              </button>
              
              {isNotifOpen && (
                <div className="navbar-dropdown notif-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <button onClick={() => setIsNotifOpen(false)}><X size={18} /></button>
                  </div>
                  <div className="notif-dropdown-content">
                    {notifications.length === 0 ? (
                      <div className="empty-notifs">
                        <p>No new notifications</p>
                      </div>
                    ) : (
                      <>
                        <div className="notif-list">
                          {notifications.map(n => (
                            <div key={n.id} className="notif-item">
                              <div className="notif-content">
                                <p className="notif-title">{n.title}</p>
                                <p className="notif-msg">{n.message}</p>
                                <p className="notif-time">{n.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="notif-footer">
                          <button 
                            className="notif-mark-btn" 
                            onClick={markAsRead}
                          >
                            Mark As Read
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-wrapper">
              <button 
                className="navbar-profile-btn" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="navbar-avatar">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              </button>

              {isProfileOpen && (
                <div className="navbar-dropdown profile-dropdown">
                  <div className="dropdown-user-info">
                    <p className="user-name">{user.firstName} {user.lastName}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default InnerNavbar;