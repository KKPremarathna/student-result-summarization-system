import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminComplaint.css";
import { 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  User, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  RotateCw,
  Search,
  Filter,
  CheckCircle,
  Calendar
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/admin";

function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/complaints`, { headers: authHeaders });
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      setError("Failed to fetch complaints");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReadToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Resolved" ? "Pending" : "Resolved";
    try {
      const res = await axios.put(`${API_BASE}/complaints/${id}`, { status: newStatus }, { headers: authHeaders });
      if (res.data.success) {
        setComplaints((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  const adminComplaints = complaints.filter(comp => comp.isAdminRecipient);

  return (
    <AdminLayout>
      <div className="ac-page">
        {/* Header */}
        <header className="ac-header">
           <div className="ac-header-left">
              <div className="ac-breadcrumb">
                 <MessageSquare size={14} />
                 <span>Management</span>
                 <ChevronRight size={14} />
                 <span className="ac-breadcrumb-current">Complaints</span>
              </div>
              <h1 className="ac-title">System Reports</h1>
           </div>
           <div className="ac-header-right">
              <button className="ac-refresh-btn" onClick={fetchComplaints}>
                 <RotateCw size={18} className={loading ? "animate-spin" : ""} />
                 Refresh List
              </button>
           </div>
        </header>

        {/* Stats Row */}
        <div className="ac-stats-row">
           <div className="ac-stat-card">
              <div className="ac-stat-info">
                 <span className="ac-stat-label">Unresolved</span>
                 <span className="ac-stat-value">{adminComplaints.filter(c => c.status !== "Resolved").length}</span>
              </div>
              <div className="ac-stat-icon pending">
                 <Clock size={24} />
              </div>
           </div>
           <div className="ac-stat-card">
              <div className="ac-stat-info">
                 <span className="ac-stat-label">Resolved</span>
                 <span className="ac-stat-value">{adminComplaints.filter(c => c.status === "Resolved").length}</span>
              </div>
              <div className="ac-stat-icon resolved">
                 <CheckCircle2 size={24} />
              </div>
           </div>
        </div>

        <div className="ac-content">
           {loading ? (
             <div className="ac-loading">
                <RotateCw className="animate-spin" size={40} />
                <p>Retrieving faculty reports...</p>
             </div>
           ) : error ? (
             <div className="ac-alert error">
                <AlertCircle size={20} />
                <span>{error}</span>
             </div>
           ) : adminComplaints.length === 0 ? (
             <div className="ac-empty">
                <MessageSquare size={64} />
                <h3>All clear!</h3>
                <p>No new complaints requiring administrator attention.</p>
             </div>
           ) : (
             <div className="ac-list">
                {adminComplaints.map((item) => (
                  <div 
                    key={item._id} 
                    className={`ac-card ${item.status === "Resolved" ? "resolved" : "pending"}`}
                  >
                     <div className="ac-card-main">
                        <div className="ac-card-header">
                           <div className="ac-status-badge">
                              {item.status === "Resolved" ? (
                                <><CheckCircle size={14}/> RESOLVED</>
                              ) : (
                                <><Clock size={14}/> PENDING REVIEW</>
                              )}
                           </div>
                           <span className="ac-date">
                              <Calendar size={14} />
                              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </span>
                        </div>
                        
                        <h3 className="ac-card-title">{item.title}</h3>
                        <p className="ac-card-desc">{item.description}</p>
                        
                        <div className="ac-card-footer">
                           <div className="ac-author">
                              <div className="ac-avatar">
                                 {item.lecturerId?.firstName?.charAt(0)}
                              </div>
                              <div className="ac-author-info">
                                 <span className="ac-author-name">{item.lecturerId?.firstName} {item.lecturerId?.lastName}</span>
                                 <span className="ac-author-role">Lecturer</span>
                              </div>
                           </div>

                           {item.subjectId && (
                             <div className="ac-subject">
                                <BookOpen size={16} />
                                <span>{item.subjectId.courseCode} - {item.subjectId.courseName}</span>
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="ac-card-actions">
                        <label className="ac-status-toggle">
                           <input
                             type="checkbox"
                             checked={item.status === "Resolved"}
                             onChange={() => handleReadToggle(item._id, item.status)}
                           />
                           <span className="ac-toggle-slider"></span>
                           <span className="ac-toggle-label">{item.status === "Resolved" ? "Resolved" : "Mark Resolved"}</span>
                        </label>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Complaint;