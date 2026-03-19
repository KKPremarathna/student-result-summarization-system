import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/StudentList.css";
import { 
  Users, 
  Search, 
  RotateCw, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  GraduationCap,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Filter
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/admin";

function StudentList() {
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [loadingAllowed, setLoadingAllowed] = useState(true);
  const [allowedError, setAllowedError] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(false);
  const [registeredError, setRegisteredError] = useState("");
  const [showRegistered, setShowRegistered] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [confirmModal, setConfirmModal] = useState({ visible: false, id: null, email: "" });
  
  // Filter state
  const [filterBatch, setFilterBatch] = useState("all");

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3000);
  };

  const fetchAllowedEmails = async () => {
    setLoadingAllowed(true);
    setAllowedError("");
    try {
      const res = await fetch(`${API_BASE}/allowed-emails?role=student`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setAllowedEmails(data.data);
      else setAllowedError(data.message || "Failed to load allowed emails.");
    } catch {
      setAllowedError("Network error. Please check server connection.");
    } finally {
      setLoadingAllowed(false);
    }
  };

  const fetchRegisteredStudents = async () => {
    setLoadingRegistered(true);
    setRegisteredError("");
    try {
      const res = await fetch(`${API_BASE}/registered-users?role=student`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setRegisteredStudents(data.data);
      else setRegisteredError(data.message || "Failed to load registered students.");
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
    if (!showRegistered) fetchRegisteredStudents();
    setShowRegistered((prev) => !prev);
  };

  const extractYearFromEmail = (email) => {
    if (!email) return "";
    const prefix = email.split("@")[0];
    const match = prefix.match(/^(\d{4})/);
    return match ? match[1] : "";
  };

  const extractRegNumFromEmail = (email) => {
    if (!email || !email.includes("@")) return "";
    const prefix = email.split("@")[0].toLowerCase();
    const match = prefix.match(/^(\d{4})([a-z])(\d{3,})$/);
    if (match) {
      const [, year, char, num] = match;
      return `${year}/${char.toUpperCase()}/${num}`;
    }
    return "";
  };

  // Get unique batches for filter dropdown
  const batches = useMemo(() => {
    const years = allowedEmails.map(e => extractYearFromEmail(e.email)).filter(y => y !== "");
    return ["all", ...new Set(years)].sort((a, b) => b.localeCompare(a));
  }, [allowedEmails]);

  // Filtered lists
  const filteredAllowed = useMemo(() => {
    if (filterBatch === "all") return allowedEmails;
    return allowedEmails.filter(e => extractYearFromEmail(e.email) === filterBatch);
  }, [allowedEmails, filterBatch]);

  const filteredRegistered = useMemo(() => {
    if (filterBatch === "all") return registeredStudents;
    return registeredStudents.filter(e => extractYearFromEmail(e.email) === filterBatch);
  }, [registeredStudents, filterBatch]);

  const handleDeleteAllowed = (id, email) => {
    setConfirmModal({ visible: true, id, email });
  };

  const confirmDelete = async () => {
    const { id, email } = confirmModal;
    setConfirmModal({ visible: false, id: null, email: "" });
    const regNum = extractRegNumFromEmail(email);
    if (!regNum) {
      showToast("Could not determine registration number for deletion.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/delete-allowed-email`, {
        method: "DELETE",
        headers: authHeaders,
        body: JSON.stringify({ regNum }),
      });
      if (res.ok) {
        setAllowedEmails((prev) => prev.filter((e) => e._id !== id));
        showToast("Allowed email removed successfully.");
      } else {
        const data = await res.json();
        showToast(data.message || "Delete failed.", "error");
      }
    } catch {
      showToast("Network error during delete.", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="sl-page">
        {/* Toast */}
        {toast.visible && (
          <div className={`sl-floating-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <header className="sl-header">
          <div className="sl-header-left">
            <div className="sl-breadcrumb">
              <Users size={14} />
              <span>Management</span>
              <ChevronRight size={14} />
              <span className="sl-breadcrumb-current">Students Whitelist</span>
            </div>
            <h1 className="sl-title">Student Access Control</h1>
          </div>
          <div className="sl-header-actions">
             <div className="sl-filter-group">
                <Filter size={16} className="sl-filter-icon" />
                <select 
                  className="sl-batch-select"
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                >
                   <option value="all">Global Batches</option>
                   {batches.filter(b => b !== "all").map(b => (
                     <option key={b} value={b}>Batch {b}</option>
                   ))}
                </select>
             </div>
             <button className="sl-action-btn sl-btn-refresh" onClick={fetchAllowedEmails}>
                <RotateCw size={18} className={loadingAllowed ? "animate-spin" : ""} />
                Refresh
             </button>
          </div>
        </header>

        {/* Allowed Emails Section */}
        <div className="sl-card">
          <div className="sl-card-header">
             <div className="sl-card-title-wrap">
                <div className="sl-card-icon-wrap">
                   <UserCheck size={20} />
                </div>
                <div>
                   <h3 className="sl-card-title">Pre-authorized Emails</h3>
                   <p className="sl-card-subtitle">
                     {filterBatch === "all" ? allowedEmails.length : filteredAllowed.length} students {filterBatch !== "all" && `in Batch ${filterBatch}`} authorized.
                   </p>
                </div>
             </div>
          </div>

          {allowedError && (
            <div className="sl-alert sl-alert-error">
              <AlertCircle size={18} />
              <span>{allowedError}</span>
            </div>
          )}

          <div className="sl-table-container">
            <table className="sl-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Email</th>
                  <th>Role Placement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingAllowed ? (
                  <tr>
                    <td colSpan="4">
                       <div className="sl-table-loading">
                          <RotateCw className="animate-spin" size={24} />
                          <span>Loading authorized records...</span>
                       </div>
                    </td>
                  </tr>
                ) : filteredAllowed.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                       <div className="sl-table-empty">
                          <Users size={48} />
                          <p>No authorized student emails found {filterBatch !== "all" && `for Batch ${filterBatch}`}.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredAllowed.map((item, idx) => (
                    <tr key={item._id}>
                      <td className="sl-td-num">#{idx + 1}</td>
                      <td className="sl-td-email">
                         <div className="sl-email-cell">
                            <span>{item.email}</span>
                         </div>
                      </td>
                      <td>
                        <span className="sl-role-tag student">AUTHORIZED STUDENT</span>
                      </td>
                      <td>
                        <button
                          className="sl-icon-btn sl-btn-delete"
                          onClick={() => handleDeleteAllowed(item._id, item.email)}
                          title="Remove Authorization"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Students Toggle Section */}
        <div className="sl-toggle-card">
           <button 
             className={`sl-toggle-trigger ${showRegistered ? "active" : ""}`}
             onClick={handleToggleRegistered}
           >
              <div className="sl-toggle-info">
                 <GraduationCap size={20} />
                 <span>Registered Students View {filterBatch !== "all" && `(Batch ${filterBatch})`}</span>
              </div>
              {showRegistered ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
           </button>

           {showRegistered && (
             <div className="sl-toggle-content">
                {registeredError && (
                  <div className="sl-alert sl-alert-error">
                    <AlertCircle size={18} />
                    <span>{registeredError}</span>
                  </div>
                )}
                
                <div className="sl-table-container">
                  <table className="sl-table sl-table-dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email Address</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingRegistered ? (
                        <tr>
                          <td colSpan="4">
                             <div className="sl-table-loading">
                                <RotateCw className="animate-spin" size={24} />
                                <span>Syncing registered users...</span>
                             </div>
                          </td>
                        </tr>
                      ) : filteredRegistered.length === 0 ? (
                        <tr>
                          <td colSpan="4">
                             <div className="sl-table-empty">
                                <p>No registered students found {filterBatch !== "all" && `for Batch ${filterBatch}`}.</p>
                             </div>
                          </td>
                        </tr>
                      ) : (
                        filteredRegistered.map((student, idx) => (
                          <tr key={student._id}>
                            <td className="sl-td-num">#{idx + 1}</td>
                            <td className="sl-td-name">
                              {student.firstName} {student.lastName}
                            </td>
                            <td className="sl-td-email">{student.email}</td>
                            <td>
                               <span className="sl-status-chip active">REGISTERED</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.visible && (
        <div className="sl-modal-overlay">
          <div className="sl-modal">
            <div className="sl-modal-header">
               <div className="sl-modal-icon warning">
                  <AlertCircle size={28} />
               </div>
               <h3>Revoke Access?</h3>
            </div>
            <p className="sl-modal-text">
              You are about to remove <strong>{confirmModal.email}</strong> from the authorized whitelist. They will no longer be able to register.
            </p>
            <div className="sl-modal-actions">
              <button 
                className="sl-modal-btn sl-btn-cancel" 
                onClick={() => setConfirmModal({ visible: false, id: null, email: "" })}
              >
                Keep Authorization
              </button>
              <button className="sl-modal-btn sl-btn-confirm" onClick={confirmDelete}>
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default StudentList;