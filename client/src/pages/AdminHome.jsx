import React, { useState, useEffect } from "react";
import "../styles/AdminHome.css";
import "../styles/AdminNotification.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/admin";

function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalEmails: 0,
    totalComplaints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        setLoading(true);
        // We can fetch these from the new endpoints and other existing ones
        // For counts, we might need a dedicated stats endpoint or just check the length of returned arrays
        // For now, let's fetch from the registered-users and allowed-emails
        const [studentsRes, lecturersRes, emailsRes, complaintsRes, subjectsRes] = await Promise.all([
          axios.get(`${API_BASE}/registered-users?role=student`, { headers }),
          axios.get(`${API_BASE}/registered-users?role=lecturer`, { headers }),
          axios.get(`${API_BASE}/allowed-emails`, { headers }),
          axios.get(`${API_BASE}/complaints`, { headers }),
          axios.get(`${API_BASE}/subjects`, { headers }),
        ]);

        setStats({
          totalStudents: studentsRes.data.data?.length || 0,
          totalLecturers: lecturersRes.data.data?.length || 0,
          totalCourses: subjectsRes.data.count || 0,
          totalEmails: emailsRes.data.data?.length || 0,
          totalComplaints: complaintsRes.data.count || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-content">
        {/* Left sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li className="active">
              <Link to="/adminhome">
                <span className="sidebar-icon"></span>
                Admin Home
              </Link>
            </li>
            <li>
              <Link to="/adduser">
                <span className="sidebar-icon"></span>
                Add User
              </Link>
            </li>
            <li>
              <Link to="/admincomplaint">
                <span className="sidebar-icon"></span>
                Complaint
              </Link>
            </li>
            <li >
              <Link to="/adminresults">
                <span className="sidebar-icon"></span>
                Results
              </Link>
            </li>
            <li>
              <Link to="/adminprofile">
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
                <div className="welcome-badge">Systems Administrator</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Students</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>{loading ? "..." : stats.totalStudents}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Lecturers</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>{loading ? "..." : stats.totalLecturers}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Courses</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>{loading ? "..." : stats.totalCourses}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Emails</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>{loading ? "..." : stats.totalEmails}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Complaints</h3>
                  <span className="stat-icon"></span>
                </div>
                <p>{loading ? "..." : stats.totalComplaints}</p>
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