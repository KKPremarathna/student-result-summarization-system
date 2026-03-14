import React from "react";
import "../styles/AdminHome.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg";
import { Link } from "react-router-dom";

function AdminHome() {
  return (
    <div className="admin-page">
      <Navbar/>

      <div className="admin-content">
        {/* Left sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li className="active">
              <Link to="/AdminHome">
                <span className="sidebar-icon">🏠</span>
                Admin Home
              </Link>
            </li>
            <li>
              <Link to="/AddUser">
                <span className="sidebar-icon">👤</span>
                Add User
              </Link>
            </li>
            <li>
              <Link to="/AdminComplaint">
                <span className="sidebar-icon">📋</span>
                Complaint
              </Link>
            </li>
            <li >
              <Link to="/AdminResults">
                <span className="sidebar-icon">📊</span>
                Results
              </Link>
            </li>
            <li>
              <Link to="/AdminResetPassword">
                <span className="sidebar-icon">🔒</span>
                Reset Password
              </Link>
            </li>
          </ul>
        </aside>

        {/* Right main section */}
        <main className="admin-main">
          <div className="admin-main-content">
            <div className="welcome-section">
              <div className="welcome-profile">
                <div className="profile-avatar">👤</div>
                <div className="welcome-text">
                  <h1>Welcome back,</h1>
                  <h2>Mrs K.B Ranathunga</h2>
                  <p className="admin-email">admin@academet.com</p>
                </div>
              </div>
              <div className="welcome-badge">Systems Administrator</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Students</h3>
                  <span className="stat-icon">👨‍🎓</span>
                </div>
                <p>4,200</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Lecturers</h3>
                  <span className="stat-icon">👨‍🏫</span>
                </div>
                <p>67</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Courses</h3>
                  <span className="stat-icon">📚</span>
                </div>
                <p>220</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Emails</h3>
                  <span className="stat-icon">📧</span>
                </div>
                <p>23</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Complaints</h3>
                  <span className="stat-icon">⚠️</span>
                </div>
                <p>06</p>
              </div>

              <div className="stat-card notice-card">
                <div className="stat-header">
                  <h3>Notices</h3>
                  <span className="stat-icon">📢</span>
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