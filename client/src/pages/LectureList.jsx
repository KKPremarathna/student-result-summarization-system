import React, { useState, useEffect, useCallback } from "react";
import "../styles/LectureList.css";
import Navbar from "../components/InnerNavbar";
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

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3000);
  };

  const fetchLecturers = useCallback(async (dept) => {
    setLoading(true);
    setError("");
    try {
      const params = dept ? `?department=${encodeURIComponent(dept)}` : "";
      const res = await fetch(`${API_BASE}/lecturers/registered${params}`, {
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

  // Auto-fetch when department changes (if already loaded once)
  useEffect(() => {
    if (hasFetched) {
      fetchLecturers(department);
    }
  }, [department]);

  const handleView = () => {
    fetchLecturers(department);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete lecturer "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/lecturers/registered/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setLecturers((prev) => prev.filter((l) => l._id !== id));
        showToast("Lecturer deleted successfully.");
      } else {
        showToast(data.message || "Delete failed.", "error");
      }
    } catch {
      showToast("Network error during delete.", "error");
    }
  };

  return (
    <div className="lecturelist-page">
      <Navbar />

      {/* Toast */}
      {toast.visible && (
        <div className={`ll-toast ll-toast--${toast.type}`}>{toast.message}</div>
      )}

      <div className="lecturelist-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/AdminHome">
                <span className="sidebar-icon">🏠</span>Admin Home
              </Link>
            </li>
            <li className="active">
              <Link to="/AddUser">
                <span className="sidebar-icon">👤</span>Add User
              </Link>
            </li>
            <li>
              <Link to="/AdminComplaint">
                <span className="sidebar-icon">📋</span>Complaint
              </Link>
            </li>
            <li>
              <Link to="/AdminResults">
                <span className="sidebar-icon">📊</span>Results
              </Link>
            </li>
            <li>
              <Link to="/AdminProfile">
                <span className="sidebar-icon">👤</span>Profile
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main */}
        <main className="lecturelist-main">
          <div className="lecturelist-main-content">

            {/* Section Header */}
            <div className="ll-section-header">
              <div className="ll-header-left">
                <span className="ll-header-icon">👨‍🏫</span>
                <div>
                  <h1 className="ll-title">Registered Lecturers</h1>
                  <p className="ll-subtitle">
                    Browse and manage signed-up academic staff
                  </p>
                </div>
              </div>
              {hasFetched && (
                <span className="ll-count-badge">
                  {lecturers.length} lecturer{lecturers.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Filter Row */}
            <div className="ll-filter-card">
              <div className="ll-filter-row">
                <div className="ll-filter-group">
                  <label className="ll-filter-label">Department</label>
                  <select
                    className="ll-filter-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <button className="ll-view-btn" onClick={handleView} disabled={loading}>
                  {loading ? (
                    <span className="ll-btn-spinner" />
                  ) : (
                    <>🔍 View</>
                  )}
                </button>

                {hasFetched && (
                  <button
                    className="ll-refresh-btn"
                    onClick={() => fetchLecturers(department)}
                    title="Refresh"
                  >
                    ↻ Refresh
                  </button>
                )}
              </div>

              {!hasFetched && (
                <p className="ll-hint">
                  Select a department (or leave blank for all) and click <strong>View</strong> to load lecturers.
                </p>
              )}
            </div>

            {/* Error */}
            {error && <div className="ll-alert ll-alert--error">{error}</div>}

            {/* Loading */}
            {loading && (
              <div className="ll-spinner-wrap">
                <div className="ll-spinner" />
                <span>Loading lecturers…</span>
              </div>
            )}

            {/* Table */}
            {hasFetched && !loading && (
              <div className="ll-table-wrapper">
                {lecturers.length === 0 ? (
                  <div className="ll-empty">
                    <span className="ll-empty-icon">👨‍🏫</span>
                    <p>No registered lecturers found{department ? ` in ${department}` : ""}.</p>
                  </div>
                ) : (
                  <table className="ll-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Department</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lecturers.map((lec, idx) => (
                        <tr key={lec._id}>
                          <td className="ll-td-num">{idx + 1}</td>
                          <td className="ll-td-name">
                            {lec.title && <span className="ll-title-badge">{lec.title}</span>}
                            {lec.firstName} {lec.lastName}
                          </td>
                          <td className="ll-td-email">{lec.email}</td>
                          <td>
                            {lec.department ? (
                              <span className="ll-dept-badge">{lec.department}</span>
                            ) : (
                              <span className="ll-dept-none">—</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="ll-delete-btn"
                              onClick={() =>
                                handleDelete(lec._id, `${lec.firstName} ${lec.lastName}`)
                              }
                            >
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default LectureList;