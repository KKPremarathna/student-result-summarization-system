import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/AddStudent.css";
import { 
  UserPlus, 
  Users, 
  ChevronRight, 
  GraduationCap, 
  PlusCircle, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Info,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

function AddStudent() {
  const [studentId, setStudentId] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [deleteStartId, setDeleteStartId] = useState("");
  const [deleteEndId, setDeleteEndId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Session expired. Please login again." });
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleAddSingleStudent = async () => {
    if (!studentId) {
      setMessage({ type: "error", text: "Please enter a Student ID" });
      return;
    }
    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-allowed-email",
        { regNum: studentId, role: "student" },
        { headers }
      );
      setMessage({ type: "success", text: response.data.message });
      setStudentId("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding student",
      });
    }
  };

  const handleAddBulkStudents = async () => {
    if (!startId || !endId) {
      setMessage({ type: "error", text: "Please enter both Start and End ID" });
      return;
    }
    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-bulk-allowed-emails",
        { startRegNum: startId, endRegNum: endId, role: "student" },
        { headers }
      );
      setMessage({ type: "success", text: response.data.message });
      setStartId("");
      setEndId("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding bulk students",
      });
    }
  };

  const handleDeleteBulkStudents = async () => {
    if (!deleteStartId || !deleteEndId) {
      setMessage({ type: "error", text: "Please enter both Start and End ID" });
      return;
    }
    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await axios.delete("http://localhost:5000/api/admin/delete-bulk-allowed-emails", {
        headers,
        data: {
          startRegNum: deleteStartId,
          endRegNum: deleteEndId,
        },
      });
      setMessage({ type: "success", text: response.data.message });
      setDeleteStartId("");
      setDeleteEndId("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error deleting bulk students",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="as-page">
        {/* Header */}
        <header className="as-header">
          <div className="as-breadcrumb">
             <Link to="/adduser" className="as-back-link"><ArrowLeft size={14} /> Back to Management</Link>
             <ChevronRight size={14} />
             <span className="as-breadcrumb-current">Authorize Students</span>
          </div>
          <h1 className="as-title">Student Access</h1>
          <p className="as-subtitle">Manage the whitelist of students permitted to register.</p>
        </header>

        {message.text && (
          <div className={`as-status-bar ${message.type}`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
            <button className="as-status-close" onClick={() => setMessage({ type: "", text: "" })}>×</button>
          </div>
        )}

        <div className="as-grid">
           {/* Column 1: Add Operations */}
           <div className="as-column">
              <section className="as-card">
                 <div className="as-card-header">
                    <PlusCircle size={20} className="as-card-icon" />
                    <h3 className="as-card-title">Single Authorization</h3>
                 </div>
                 <div className="as-form-group">
                    <label>Registration Number</label>
                    <div className="as-input-row">
                       <input 
                         type="text" 
                         placeholder="20XX/E/XXX" 
                         value={studentId}
                         onChange={(e) => setStudentId(e.target.value)}
                       />
                       <button className="as-btn as-btn-primary" onClick={handleAddSingleStudent}>Authorize</button>
                    </div>
                 </div>
              </section>

              <section className="as-card">
                 <div className="as-card-header">
                    <Users size={20} className="as-card-icon" />
                    <h3 className="as-card-title">Bulk Authorization</h3>
                 </div>
                 <p className="as-card-desc">Authorize a range of registration numbers in one action.</p>
                 <div className="as-form-grid">
                    <div className="as-form-group">
                       <label>Start ID</label>
                       <input 
                         type="text" 
                         placeholder="20XX/E/001" 
                         value={startId}
                         onChange={(e) => setStartId(e.target.value)}
                       />
                    </div>
                    <div className="as-form-group">
                       <label>End ID</label>
                       <input 
                         type="text" 
                         placeholder="20XX/E/050" 
                         value={endId}
                         onChange={(e) => setEndId(e.target.value)}
                       />
                    </div>
                 </div>
                 <button className="as-btn as-btn-primary as-full-width mt-1" onClick={handleAddBulkStudents}>Authorize Range</button>
              </section>
           </div>

           {/* Column 2: Delete & Info */}
           <div className="as-column">
              <section className="as-card as-card-danger">
                 <div className="as-card-header">
                    <Trash2 size={20} className="as-card-icon" />
                    <h3 className="as-card-title">Bulk Revocation</h3>
                 </div>
                 <p className="as-card-desc">Remove authorization for a range of students.</p>
                 <div className="as-form-grid">
                    <div className="as-form-group">
                       <label>Start ID</label>
                       <input 
                         type="text" 
                         placeholder="20XX/E/001" 
                         value={deleteStartId}
                         onChange={(e) => setDeleteStartId(e.target.value)}
                       />
                    </div>
                    <div className="as-form-group">
                       <label>End ID</label>
                       <input 
                         type="text" 
                         placeholder="20XX/E/050" 
                         value={deleteEndId}
                         onChange={(e) => setDeleteEndId(e.target.value)}
                       />
                    </div>
                 </div>
                 <button className="as-btn as-btn-danger as-full-width mt-1" onClick={handleDeleteBulkStudents}>Revoke Authorization</button>
              </section>

              <section className="as-card as-card-info">
                 <div className="as-card-header">
                    <Info size={20} />
                    <h3 className="as-card-title">Quick Action</h3>
                 </div>
                 <p className="as-card-desc">View and manage the existing whitelist to see authorized students.</p>
                 <Link to="/studentlist" className="as-btn as-btn-outline as-full-width">
                    View Student Whitelist
                 </Link>
              </section>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddStudent;
