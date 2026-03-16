import React, { useState, useEffect } from "react";
import "../styles/StudentList.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/admin";

function StudentList() {
  // Allowed emails state
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [loadingAllowed, setLoadingAllowed] = useState(true);
  const [allowedError, setAllowedError] = useState("");

  // Registered students state
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(false);
  const [registeredError, setRegisteredError] = useState("");
  const [showRegistered, setShowRegistered] = useState(false);

  // Toast
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

  // Fetch allowed student emails
  const fetchAllowedEmails = async () => {
    setLoadingAllowed(true);
    setAllowedError("");
    try {
      const res = await fetch(`${API_BASE}/students/allowed`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) {
        setAllowedEmails(data.data);
      } else {
        setAllowedError(data.message || "Failed to load allowed emails.");
      }
    } catch {
      setAllowedError("Network error. Please check server connection.");
    } finally {
      setLoadingAllowed(false);
    }
  };

  // Fetch registered students
  const fetchRegisteredStudents = async () => {
    setLoadingRegistered(true);
    setRegisteredError("");
    try {
      const res = await fetch(`${API_BASE}/students/registered`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) {
        setRegisteredStudents(data.data);
      } else {
        setRegisteredError(data.message || "Failed to load registered students.");
      }
    } catch {
      setRegisteredError("Network error. Please check server connection.");
    } finally {
      setLoadingRegistered(false);
    }
  };

  useEffect(() => {
    fetchAllowedEmails();
  }, []);

  const handleToggleRegistered = () => {
    if (!showRegistered) {
      fetchRegisteredStudents();
    }
    setShowRegistered((prev) => !prev);
  };

  // Delete allowed email
  const handleDeleteAllowed = async (id, email) => {
    if (!window.confirm(`Remove "${email}" from allowed list?`)) return;
    try {
      const res = await fetch(`${API_BASE}/students/allowed/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setAllowedEmails((prev) => prev.filter((e) => e._id !== id));
        showToast("Allowed email removed successfully.");
      } else {
        showToast(data.message || "Delete failed.", "error");
      }
    } catch {
      showToast("Network error during delete.", "error");
    }
  };

  // Delete registered student
  const handleDeleteRegistered = async (id, email) => {
    if (!window.confirm(`Delete registered student "${email}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/students/registered/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok) {
        setRegisteredStudents((prev) => prev.filter((s) => s._id !== id));
        showToast("Student account deleted successfully.");
      } else {
        showToast(data.message || "Delete failed.", "error");
      }
    } catch {
      showToast("Network error during delete.", "error");
    }
  };

  return (
    <div className="studentlist-page">
      <Navbar />

      {/* Toast */}
      {toast.visible && (
        <div className={`sl-toast sl-toast--${toast.type}`}>{toast.message}</div>
      )}

      <div className="studentlist-content">
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

        {/* Main content */}
        <main className="studentlist-main">
          <div className="studentlist-main-content">

            {/* ──────────────────────────────────────
                SECTION 1: Allowed Emails
            ────────────────────────────────────── */}
            <div className="sl-section">
              <div className="sl-section-header">
                <div className="sl-section-header-left">
                  <span className="sl-section-icon">🎓</span>
                  <div>
                    <h2 className="sl-section-title">Allowed Student Emails</h2>
                    <p className="sl-section-sub">
                      Students permitted to sign up &mdash;{" "}
                      <strong>{allowedEmails.length}</strong> record{allowedEmails.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <button className="sl-refresh-btn" onClick={fetchAllowedEmails} title="Refresh">
                  ↻ Refresh
                </button>
              </div>

              {allowedError && (
                <div className="sl-alert sl-alert--error">{allowedError}</div>
              )}

              {loadingAllowed ? (
                <div className="sl-spinner-wrap">
                  <div className="sl-spinner" />
                  <span>Loading allowed emails…</span>
                </div>
              ) : (
                <div className="sl-table-wrapper">
                  {allowedEmails.length === 0 ? (
                    <div className="sl-empty">No allowed student emails found.</div>
                  ) : (
                    <table className="sl-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Email Address</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allowedEmails.map((item, idx) => (
                          <tr key={item._id}>
                            <td className="sl-td-num">{idx + 1}</td>
                            <td className="sl-td-email">{item.email}</td>
                            <td>
                              <span className="sl-badge sl-badge--student">Student</span>
                            </td>
                            <td>
                              <button
                                className="sl-delete-btn"
                                onClick={() => handleDeleteAllowed(item._id, item.email)}
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

            {/* ──────────────────────────────────────
                SECTION 2: Registered Students Toggle
            ────────────────────────────────────── */}
            <div className="sl-divider">
              <button
                className={`sl-toggle-btn ${showRegistered ? "sl-toggle-btn--active" : ""}`}
                onClick={handleToggleRegistered}
              >
                {showRegistered ? "▲ Hide Registered Students" : "▼ View Registered Students"}
              </button>
            </div>

            {showRegistered && (
              <div className="sl-section sl-section--registered">
                <div className="sl-section-header">
                  <div className="sl-section-header-left">
                    <span className="sl-section-icon">✅</span>
                    <div>
                      <h2 className="sl-section-title">Registered Students</h2>
                      <p className="sl-section-sub">
                        Students who have signed up &mdash;{" "}
                        <strong>{registeredStudents.length}</strong> record{registeredStudents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <button className="sl-refresh-btn" onClick={fetchRegisteredStudents} title="Refresh">
                    ↻ Refresh
                  </button>
                </div>

                {registeredError && (
                  <div className="sl-alert sl-alert--error">{registeredError}</div>
                )}

                {loadingRegistered ? (
                  <div className="sl-spinner-wrap">
                    <div className="sl-spinner" />
                    <span>Loading registered students…</span>
                  </div>
                ) : (
                  <div className="sl-table-wrapper">
                    {registeredStudents.length === 0 ? (
                      <div className="sl-empty">No registered students found.</div>
                    ) : (
                      <table className="sl-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registeredStudents.map((student, idx) => (
                            <tr key={student._id}>
                              <td className="sl-td-num">{idx + 1}</td>
                              <td className="sl-td-name">
                                {student.firstName} {student.lastName}
                              </td>
                              <td className="sl-td-email">{student.email}</td>
                              <td>
                                <button
                                  className="sl-delete-btn sl-delete-btn--danger"
                                  onClick={() =>
                                    handleDeleteRegistered(student._id, student.email)
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
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentList;