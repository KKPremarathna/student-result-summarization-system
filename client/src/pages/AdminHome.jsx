import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminHome.css";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Mail, 
  MessageSquare, 
  Bell,
  TrendingUp,
  LayoutDashboard,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Clock,
  ArrowRight
} from "lucide-react";

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
    <AdminLayout>
      <div className="ah-page">
        {/* Header section */}
        <header className="ah-header">
          <div className="ah-header-left">
            <div className="ah-breadcrumb">
              <LayoutDashboard size={14} />
              <span>Admin Portal</span>
              <ChevronRight size={14} />
              <span className="ah-breadcrumb-current">Dashboard</span>
            </div>
            <h1 className="ah-title">System Overview</h1>
          </div>
          
          <div className="ah-header-right">
             <div className="ah-date-chip">
                <Clock size={16} />
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
             </div>
             <button className="ah-notice-btn">
                <Bell size={20} />
                <span className="ah-badge">4</span>
             </button>
          </div>
        </header>

        <div className="ah-grid">
          {/* Welcome Card */}
          <div className="ah-card ah-welcome-card">
            <div className="ah-welcome-content">
              <div className="ah-welcome-text">
                <div className="ah-welcome-tag">CORE ADMINISTRATION</div>
                <h2>Good Day, {user.firstName}!</h2>
                <p>The system is currently stable. You have {stats.totalComplaints} unresolved complaints needing attention.</p>
                <div className="ah-welcome-actions">
                  <button className="ah-btn ah-btn-white">System Logs</button>
                  <button className="ah-btn ah-btn-glass">Manage Roles</button>
                </div>
              </div>
              <div className="ah-welcome-icon">
                <ShieldCheck size={120} />
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="ah-stats-grid">
            <div className="ah-stat-card primary">
              <div className="ah-stat-icon-wrap">
                <GraduationCap size={24} />
              </div>
              <div className="ah-stat-info">
                <p className="ah-stat-label">Students</p>
                <h3 className="ah-stat-value">{loading ? "..." : stats.totalStudents}</h3>
                <div className="ah-stat-trend">Registered Members</div>
              </div>
            </div>

            <div className="ah-stat-card indigo">
              <div className="ah-stat-icon-wrap">
                <UserCheck size={24} />
              </div>
              <div className="ah-stat-info">
                <p className="ah-stat-label">Lecturers</p>
                <h3 className="ah-stat-value">{loading ? "..." : stats.totalLecturers}</h3>
                <div className="ah-stat-trend">Academic Staff</div>
              </div>
            </div>

            <div className="ah-stat-card teal">
              <div className="ah-stat-icon-wrap">
                <BookOpen size={24} />
              </div>
              <div className="ah-stat-info">
                <p className="ah-stat-label">Courses</p>
                <h3 className="ah-stat-value">{loading ? "..." : stats.totalCourses}</h3>
                <div className="ah-stat-trend">Active Curriculum</div>
              </div>
            </div>

            <div className="ah-stat-card orange">
              <div className="ah-stat-icon-wrap">
                <MessageSquare size={24} />
              </div>
              <div className="ah-stat-info">
                <p className="ah-stat-label">Complaints</p>
                <h3 className="ah-stat-value">{loading ? "..." : stats.totalComplaints}</h3>
                <div className="ah-stat-trend">Pending Review</div>
              </div>
            </div>
          </div>

          {/* Detailed Lists Summary - Multi-column layout */}
          <div className="ah-content-layout">
             <div className="ah-card ah-main-card">
                <div className="ah-card-header">
                   <div className="ah-card-title-wrap">
                      <TrendingUp size={20} className="ah-card-icon" />
                      <h3 className="ah-card-title">Recent Activity</h3>
                   </div>
                   <button className="ah-text-btn">View All <ArrowRight size={14}/></button>
                </div>
                <div className="ah-activity-list">
                   <div className="ah-activity-item">
                      <div className="ah-activity-indicator success"></div>
                      <div className="ah-activity-text">New student batch "2022" registered successfully.</div>
                      <div className="ah-activity-time">2 mins ago</div>
                   </div>
                   <div className="ah-activity-item">
                      <div className="ah-activity-indicator warning"></div>
                      <div className="ah-activity-text">Complaint #402 received from Lecturer: Dr. Perera.</div>
                      <div className="ah-activity-time">1 hour ago</div>
                   </div>
                   <div className="ah-activity-item">
                      <div className="ah-activity-indicator primary"></div>
                      <div className="ah-activity-text">System backup completed for Database Cluster A.</div>
                      <div className="ah-activity-time">5 hours ago</div>
                   </div>
                </div>
             </div>

             <div className="ah-card ah-side-card">
                <div className="ah-card-header">
                   <h3 className="ah-card-title">Access Stats</h3>
                </div>
                <div className="ah-access-summary">
                   <div className="ah-access-row">
                      <div className="ah-access-label">
                         <Mail size={16} />
                         <span>Allowed Emails</span>
                      </div>
                      <span className="ah-access-value">{stats.totalEmails}</span>
                   </div>
                   <div className="ah-access-progress-wrap">
                      <div className="ah-access-progress-bar" style={{ width: '75%' }}></div>
                   </div>
                   <p className="ah-access-hint">75% of allowed emails have registered</p>
                </div>
                <button className="ah-btn ah-btn-outline ah-full-width mt-1">Manage Whitelist</button>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHome;