import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { 
  getLecturerComplaints, 
  getCourseCodes, 
  getBatches, 
  getSubjectByCodeAndBatch,
  createComplaint,
  updateComplaintStatus 
} from "../services/lecturerApi";
import "../styles/LecturerComplaints.css";
import {
  MessageSquare,
  Users,
  Send,
  LayoutDashboard,
  ChevronRight,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  User,
  Info,
  ArrowRight,
  Shield,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

function LecturerComplaints() {
  const [activeTab, setActiveTab] = useState("student");
  const [complaints, setComplaints] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [showReportForm, setShowReportForm] = useState(false);

  // Form state for reporting to admin
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    courseCode: "",
    batch: "",
    subjectId: ""
  });

  useEffect(() => {
    fetchComplaints();
    fetchCourseCodes();
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getLecturerComplaints();
      setComplaints(res.data.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setLoading(true);
      await updateComplaintStatus(id, newStatus);
      setStatus({ type: "success", message: `Complaint marked as ${newStatus}.` });
      fetchComplaints(); // Refresh list
    } catch (err) {
      console.error("Failed to update status", err);
      setStatus({ type: "error", message: "Failed to update complaint status." });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseCodes = async () => {
    try {
      const res = await getCourseCodes();
      setCourseCodes(res.data);
    } catch (err) {
      console.error("Failed to fetch course codes", err);
    }
  };

  const handleCourseChange = async (code) => {
    setReportForm(prev => ({ ...prev, courseCode: code, batch: "", subjectId: "" }));
    if (!code) {
      setBatches([]);
      return;
    }
    try {
      const res = await getBatches(code);
      setBatches(res.data);
    } catch (err) {
      console.error("Failed to fetch batches", err);
    }
  };

  const handleBatchChange = async (batch) => {
    setReportForm(prev => ({ ...prev, batch }));
    if (!batch || !reportForm.courseCode) return;
    try {
      const res = await getSubjectByCodeAndBatch(reportForm.courseCode, batch);
      if (res.data.length > 0) {
        setReportForm(prev => ({ ...prev, subjectId: res.data[0]._id }));
      }
    } catch (err) {
      console.error("Failed to fetch subject details", err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.description) {
      setStatus({ type: "error", message: "Title and description are required." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      await createComplaint({
        title: reportForm.title,
        description: reportForm.description,
        subjectId: reportForm.subjectId || undefined, // Optional for admin reports
      });
      setStatus({ type: "success", message: "Complaint reported to admin successfully." });
      setReportForm({ title: "", description: "", courseCode: "", batch: "", subjectId: "" });
      setShowReportForm(false);
      fetchComplaints(); // Refresh list to show new report
    } catch (err) {
      console.error("Reporting failed", err);
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to report complaint." });
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints based on tab
  const filteredComplaints = complaints.filter(comp => {
    if (activeTab === "student") return !comp.isAdminRecipient;
    if (activeTab === "admin") return comp.isAdminRecipient;
    return true;
  });

  return (
    <LecturerLayout>
      <div className="lc-page">
        {/* Header */}
        <header className="lc-header">
          <div className="lc-breadcrumb">
            <Link to="/lecturer/home">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="lc-breadcrumb__current">Complaints</span>
          </div>
          <div className="lc-header__main">
            <h2 className="lc-title">
              <MessageSquare size={32} className="lc-title__icon" />
              Complaints Center
            </h2>
            {activeTab === "admin" && !showReportForm && (
              <button 
                className="sc-add-btn"
                onClick={() => setShowReportForm(true)}
              >
                <Send size={18} />
                New Admin Report
              </button>
            )}
            {activeTab === "admin" && showReportForm && (
              <button 
                className="sc-add-btn active"
                onClick={() => setShowReportForm(false)}
              >
                <X size={18} />
                Cancel Report
              </button>
            )}
          </div>
        </header>

        {status.message && (
          <div className={`lc-status-bar ${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="lc-tabs">
          <button 
            className={`lc-tab ${activeTab === "student" ? "active" : ""}`}
            onClick={() => setActiveTab("student")}
          >
            <Users size={18} />
            Student Queries
          </button>
          <button 
            className={`lc-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            <Shield size={18} />
            My Admin Reports
          </button>
        </div>

        {/* View Content */}
        {activeTab === "student" ? (
          <div className="lc-students-view">
            {loading && complaints.length === 0 ? (
              <div className="lc-empty">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading complaints...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="lc-empty">
                <MessageSquare className="lc-empty__icon" size={64} />
                <p>No student complaints found.</p>
              </div>
            ) : (
              <div className="lc-complaints-grid">
                {filteredComplaints.map((comp) => (
                  <div key={comp._id} className="lc-complaint-card">
                    <div className="lc-complaint-card__header">
                      <div className="lc-complaint-card__user">
                        <div className="lc-complaint-card__avatar">
                          <User size={24} />
                        </div>
                        <div className="lc-complaint-card__info">
                          <span className="lc-complaint-card__name">
                            {comp.studentId?.firstName} {comp.studentId?.lastName}
                          </span>
                          <span className="lc-complaint-card__eno">
                            {comp.studentId?.studentENo}
                          </span>
                          {comp.subjectId && (
                            <span className="lc-complaint-card__subject-inline">
                              {comp.subjectId.courseCode}: {comp.subjectId.courseName}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`lc-status-badge ${comp.status.toLowerCase()}`}>
                        {comp.status}
                      </span>
                    </div>

                    <div className="lc-complaint-card__content">
                      <h4 className="lc-complaint-card__title">{comp.title}</h4>
                      <p className="lc-complaint-card__desc">{comp.description}</p>
                    </div>

                    <div className="lc-complaint-card__footer">
                      <div className="lc-complaint-card__meta">
                        <span className="lc-complaint-card__date">
                          <Clock size={14} />
                          {new Date(comp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {comp.status !== "Resolved" && (
                        <div className="lc-complaint-card__actions">
                          {comp.status === "Pending" && (
                            <button 
                              className="lc-action-btn lc-action-btn--process"
                              onClick={() => handleStatusUpdate(comp._id, "In Progress")}
                              title="Set In Progress"
                            >
                              <Clock size={16} />
                            </button>
                          )}
                          <button 
                            className="lc-action-btn lc-action-btn--resolve"
                            onClick={() => handleStatusUpdate(comp._id, "Resolved")}
                            title="Mark Resolved"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="lc-admin-view">
            {showReportForm ? (
              <div className="lc-form-card">
                <div className="lc-form-header">
                  <h3 className="lc-form-title">Report Issue to Admin</h3>
                  <p className="lc-form-subtitle">Submit technical errors, policy disputes, or senate review requests.</p>
                  <p className="lc-form-hint">Note: Linking a course/batch is optional and only required for mark-specific queries.</p>
                </div>

                <form onSubmit={handleReportSubmit} className="sc-form">
                  <div className="sc-field">
                    <label className="sc-label">Course Code (Optional)</label>
                    <select 
                      className="sc-select"
                      value={reportForm.courseCode}
                      onChange={(e) => handleCourseChange(e.target.value)}
                    >
                      <option value="">Select Course</option>
                      {courseCodes.map(c => (
                        <option key={c.courseCode} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sc-field">
                    <label className="sc-label">Batch (Optional)</label>
                    <select 
                      className="sc-select"
                      value={reportForm.batch}
                      onChange={(e) => handleBatchChange(e.target.value)}
                      disabled={!reportForm.courseCode}
                    >
                      <option value="">Select Batch</option>
                      {batches.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sc-field">
                    <label className="sc-label">Complaint Title</label>
                    <input 
                      type="text" 
                      className="sc-input"
                      placeholder="e.g. Discrepancy in Final Result Calculation"
                      value={reportForm.title}
                      onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="sc-field" style={{ gridColumn: 'span 2' }}>
                    <label className="sc-label">Detailed Description</label>
                    <textarea 
                      className="sc-textarea"
                      placeholder="Explain the issue in detail..."
                      value={reportForm.description}
                      onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="sc-submit-btn"
                    disabled={loading}
                    style={{ gridColumn: 'span 2' }}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    Submit Report to Admin
                  </button>
                </form>
              </div>
            ) : (
              <div className="lc-reports-list">
                {loading && complaints.length === 0 ? (
                  <div className="lc-empty">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Loading your reports...</p>
                  </div>
                ) : filteredComplaints.length === 0 ? (
                  <div className="lc-empty">
                    <MessageSquare className="lc-empty__icon" size={64} />
                    <p>You haven't sent any reports to the admin yet.</p>
                    <button 
                      className="sc-add-btn" 
                      style={{ marginTop: '2rem', marginInline: 'auto' }}
                      onClick={() => setShowReportForm(true)}
                    >
                      Send Your First Report
                    </button>
                  </div>
                ) : (
                  <div className="lc-complaints-grid">
                    {filteredComplaints.map((comp) => (
                      <div key={comp._id} className="lc-complaint-card">
                        <div className="lc-complaint-card__header">
                          <div className="lc-complaint-card__user">
                            <div className="lc-complaint-card__avatar lc-complaint-card__avatar--admin">
                              <Shield size={24} />
                            </div>
                            <div className="lc-complaint-card__info">
                              <span className="lc-complaint-card__name">Report to Admin</span>
                              <span className="lc-complaint-card__eno">ID: {comp._id.substring(0, 8)}...</span>
                              {comp.subjectId && (
                                <span className="lc-complaint-card__subject-inline">
                                  {comp.subjectId.courseCode}: {comp.subjectId.courseName}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`lc-status-badge ${comp.status.toLowerCase()}`}>
                            {comp.status}
                          </span>
                        </div>

                        <div className="lc-complaint-card__content">
                          <h4 className="lc-complaint-card__title">{comp.title}</h4>
                          <p className="lc-complaint-card__desc">{comp.description}</p>
                        </div>

                        <div className="lc-complaint-card__footer">
                          <div className="lc-complaint-card__meta">
                            <span className="lc-complaint-card__date">
                              <Clock size={14} />
                              {new Date(comp.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default LecturerComplaints;
