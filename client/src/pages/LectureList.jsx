import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/LectureList.css";
import { 
  Users, 
  Building2, 
  Search, 
  RotateCw, 
  ChevronRight, 
  UserCheck,
  Building,
  AlertCircle,
  Filter,
  ArrowRight,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/admin";

const DEPARTMENTS = [
  "Computer Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
];

function LectureList() {
  const [department, setDepartment] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchLecturers = useCallback(async (dept) => {
    setLoading(true);
    setError("");
    try {
      const roleParam = "role=lecturer";
      const deptParam = dept ? `&department=${encodeURIComponent(dept)}` : "";
      const res = await fetch(`${API_BASE}/registered-users?${roleParam}${deptParam}`, {
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setLecturers(data.data);
        setHasFetched(true);
      } else {
        setError(data.message || "Failed to load lecturers.");
      }
    } catch {
      setError("Network error. Please check server connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched) {
      fetchLecturers(department);
    }
  }, [department, fetchLecturers]);

  const handleView = () => {
    fetchLecturers(department);
  };

  return (
    <AdminLayout>
      <div className="ll-page">
        {/* Header */}
        <header className="ll-header">
           <div className="ll-breadcrumb">
              <Link to="/adduser" className="ll-back-link"><ArrowLeft size={14} /> Back to Management</Link>
              <ChevronRight size={14} />
              <span className="ll-breadcrumb-current">Faculty Directory</span>
           </div>
           <h1 className="ll-title">Registered Lecturers</h1>
           <p className="ll-subtitle">View and manage the academic staff directory across departments.</p>
        </header>

        <div className="ll-content">
           {/* Summary Stats Row */}
           <div className="ll-stats-row">
              <div className="ll-stat-small">
                 <div className="ll-stat-icon-sm">
                    <UserCheck size={18} />
                 </div>
                 <div className="ll-stat-info-sm">
                    <span className="ll-stat-label-sm">Total Faculty</span>
                    <span className="ll-stat-value-sm">{hasFetched ? lecturers.length : "—"}</span>
                 </div>
              </div>
              <div className="ll-stat-small">
                 <div className="ll-stat-icon-sm secondary">
                    <TrendingUp size={18} />
                 </div>
                 <div className="ll-stat-info-sm">
                    <span className="ll-stat-label-sm">Active Depts</span>
                    <span className="ll-stat-value-sm">4</span>
                 </div>
              </div>
           </div>

           {/* Filters Card */}
           <div className="ll-card ll-filter-card">
              <div className="ll-filter-header">
                 <div className="ll-filter-title">
                    <Filter size={20} />
                    <span>Filter Staff</span>
                 </div>
                 <button className="ll-refresh-btn" onClick={() => fetchLecturers(department)}>
                    <RotateCw size={16} className={loading ? "animate-spin" : ""} />
                    Sync Data
                 </button>
              </div>

              <div className="ll-filter-row">
                 <div className="ll-form-group">
                    <label>By Department</label>
                    <div className="ll-select-wrap">
                       <Building2 size={18} className="ll-select-icon" />
                       <select
                         className="ll-select"
                         value={department}
                         onChange={(e) => setDepartment(e.target.value)}
                       >
                         <option value="">All Departments</option>
                         {DEPARTMENTS.map((d) => (
                           <option key={d} value={d}>{d}</option>
                         ))}
                       </select>
                    </div>
                 </div>

                 <button className="ll-view-btn" onClick={handleView} disabled={loading}>
                    {loading ? <RotateCw className="animate-spin" size={20} /> : <><Search size={20} /> Load Faculty</>}
                 </button>
              </div>
           </div>

           {/* Error Alert */}
           {error && (
             <div className="ll-alert error">
                <AlertCircle size={20} />
                <span>{error}</span>
             </div>
           )}

           {/* Table Section */}
           <div className="ll-table-card">
              <div className="ll-table-container">
                 <table className="ll-table">
                    <thead>
                       <tr>
                          <th>#</th>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Departmental Affiliation</th>
                          <th>Status</th>
                       </tr>
                    </thead>
                    <tbody>
                       {!hasFetched && !loading ? (
                         <tr>
                            <td colSpan="5">
                               <div className="ll-empty">
                                  <Building size={48} />
                                  <p>Select a department and click <strong>Load Faculty</strong> to begin.</p>
                               </div>
                            </td>
                         </tr>
                       ) : loading ? (
                         <tr>
                            <td colSpan="5">
                               <div className="ll-loading">
                                  <RotateCw className="animate-spin" size={32} />
                                  <p>Gathering faculty profiles...</p>
                               </div>
                            </td>
                         </tr>
                       ) : lecturers.length === 0 ? (
                         <tr>
                            <td colSpan="5">
                               <div className="ll-empty">
                                  <Users size={48} />
                                  <p>No registered lecturers found{department ? ` in ${department}` : ""}.</p>
                               </div>
                            </td>
                         </tr>
                       ) : (
                         lecturers.map((lec, idx) => (
                           <tr key={lec._id}>
                              <td className="ll-td-num">#{String(idx + 1).padStart(2, '0')}</td>
                              <td className="ll-td-identity">
                                 <div className="ll-avatar-sm">
                                    {lec.firstName?.charAt(0)}{lec.lastName?.charAt(0)}
                                 </div>
                                 <div className="ll-name-wrap">
                                    <span className="ll-name">{lec.title} {lec.firstName} {lec.lastName}</span>
                                    <span className="ll-role-label">Academic Staff</span>
                                 </div>
                              </td>
                              <td className="ll-td-email">{lec.email}</td>
                              <td>
                                 <div className="ll-dept-badge">
                                    <span className="ll-dept-text">{lec.department || "General"}</span>
                                 </div>
                              </td>
                              <td>
                                 <span className="ll-status active">VERIFIED</span>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default LectureList;