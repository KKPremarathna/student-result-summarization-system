import React, { useState } from "react";
import "../styles/AdminHome.css";
import "../styles/AdminNotification.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg";
import { Link } from "react-router-dom";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Complaint", message: "A new complaint has been filed by a student.", time: "2 mins ago", selected: false },
    { id: 2, title: "Course Update", message: "Course CS3042 marks have been updated.", time: "1 hour ago", selected: false },
    { id: 3, title: "System Alert", message: "Database maintenance scheduled for 12 AM.", time: "3 hours ago", selected: false },
  ]);

  const toggleNotif = () => setIsNotifOpen(!isNotifOpen);

  const handleSelectNotif = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, selected: !n.selected } : n));
  };

  const markAsRead = () => {
    setNotifications(prev => prev.filter(n => !n.selected));
    setIsNotifOpen(false);
  };

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-content">
        {/* Left sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li className="active">
              <Link to="/AdminHome">
                <span className="sidebar-icon"></span>
                Admin Home
              </Link>
            </li>
            <li>
              <Link to="/AddUser">
                <span className="sidebar-icon"></span>
                Add User
              </Link>
            </li>
            <li>
              <Link to="/AdminComplaint">
                <span className="sidebar-icon"></span>
                Complaint
              </Link>
            </li>
            <li >
              <Link to="/AdminResults">
                <span className="sidebar-icon"></span>
                Results
              </Link>
            </li>
            <li>
              <Link to="/AdminProfile">
                <span className="sidebar-icon"></span>
                Profile
              </Link>
            </li>
          </ul>
        </aside>

        {/* Right main section */}
        <main className="admin-main">
          <div className="admin-main-content">
            <div className="welcome-section">
              <div className="welcome-profile">
                <div className="profile-avatar">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : ""}
                  {user.lastName ? user.lastName.charAt(0).toUpperCase() : ""}
                </div>
                <div className="welcome-text">
                  <h1>Welcome back,</h1>
                  <h2>{user.firstName} {user.lastName}</h2>
                  <p className="admin-email">{user.email}</p>
                </div>
              </div>

              <div className="welcome-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div className="notification-container">
                  <div className="bell-icon-wrapper" onClick={toggleNotif}>
                    <span style={{ fontSize: '1.5rem' }}>🔔</span>
                    {notifications.length > 0 && (
                      <span className="notification-badge">{notifications.length}</span>
                    )}
                  </div>

                  {isNotifOpen && (
                    <div className="notification-backdrop" onClick={(e) => { if(e.target.className === 'notification-backdrop') toggleNotif(); }}>
                      <div className="notification-popup">
                        <div className="notification-header">
                          <h3>Notifications</h3>
                          <button className="close-popup-btn" onClick={toggleNotif}>✕</button>
                        </div>
                        <div className="notification-list">
                          {notifications.length === 0 ? (
                            <div className="empty-notifications">
                              <span className="empty-icon">📭</span>
                              <p>All caught up!</p>
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className="notification-item">
                                <input 
                                  type="checkbox" 
                                  className="notification-checkbox"
                                  checked={n.selected}
                                  onChange={() => handleSelectNotif(n.id)}
                                />
                                <div className="notification-content">
                                  <p className="notification-title">{n.title}</p>
                                  <p className="notification-message">{n.message}</p>
                                  <small className="notification-time">{n.time}</small>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="notification-footer">
                            <button 
                              className="mark-read-btn" 
                              onClick={markAsRead}
                              disabled={!notifications.some(n => n.selected)}
                            >
                              Mark As Read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
                <div className="welcome-badge">Systems Administrator</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Students</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>4,200</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Lecturers</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>67</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Courses</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>220</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Emails</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>23</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Complaints</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>06</p>
              </div>

              <div className="stat-card notice-card">
                <div className="stat-header">
                  <h3>Notices</h3>
                  <span className="stat-icon"></span>
                </div>
                <button className="manage-notice-btn">Manage Notices</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminHome;

