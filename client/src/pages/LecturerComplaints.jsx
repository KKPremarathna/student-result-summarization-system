import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { 
  getLecturerComplaints, 
  getCourseCodes, 
  getBatches, 
  getSubjectByCodeAndBatch,
  createComplaint 
} from "../services/lecturerApi";
import "../styles/LecturerComplaints.css";
import {
  MessageSquare,
  Users,
  Send,
  LayoutDashboard,
  ChevronRight,
  Search,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  User,
  Info
} from "lucide-react";

function LecturerComplaints() {
  const [activeTab, setActiveTab] = useState("student");
  const [complaints, setComplaints] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

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
    if (!reportForm.title || !reportForm.description || !reportForm.subjectId) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      // For now, we reuse the createComplaint API. 
      // Note: Backend might need to handle lecturer-to-admin Specifically.
      // But we pass the subjectId and the user role is 'lecturer'.
      await createComplaint({
        title: reportForm.title,
        description: reportForm.description,
        subjectId: reportForm.subjectId,
        // Since we don't have a specific admin ID in current schema, 
        // we might leave lecturerId as current user or handled by backend
      });
      setStatus({ type: "success", message: "Complaint reported to admin successfully." });
      setReportForm({ title: "", description: "", courseCode: "", batch: "", subjectId: "" });
    } catch (err) {
      console.error("Reporting failed", err);
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to report complaint." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LecturerLayout>
      <div className="lc-page">
        {/* Header */}
        <div className="lc-header">
          <div className="lc-breadcrumb">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="lc-breadcrumb__current">Complaints</span>
          </div>
          <h2 className="lc-title">
            <MessageSquare size={32} className="lc-title__icon" />
            Complaints Management
          </h2>
        </div>

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
            Student Complaints
          </button>
          <button 
            className={`lc-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            <Send size={18} />
            Report to Admin
          </button>
        </div>

        {/* View Content */}
        {activeTab === "student" ? (
          <div className="lc-students-view">
            {loading ? (
              <div className="lc-empty">
                <Loader2 className="animate-spin lc-empty__icon" size={48} />
                <p>Loading complaints...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="lc-empty">
                <MessageSquare className="lc-empty__icon" size={48} />
                <p>No student complaints found.</p>
              </div>
            ) : (
              <div className="lc-complaints-grid">
                {complaints.map((comp) => (
                  <div key={comp._id} className="lc-complaint-card">
                    <div className="lc-complaint-card__header">
                      <div className="lc-complaint-card__user">
                        <div className="lc-complaint-card__avatar">
                          <User size={20} />
                        </div>
                        <div className="lc-complaint-card__info">
                          <span className="lc-complaint-card__name">
                            {comp.studentId?.firstName} {comp.studentId?.lastName}
                          </span>
                          <span className="lc-complaint-card__eno">
                            {comp.studentId?.studentENo}
                          </span>
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
                      <span className="lc-complaint-card__subject">
                        {comp.subjectId?.courseCode}
                      </span>
                      <span className="lc-complaint-card__date">
                        <Clock size={12} />
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="lc-admin-view">
            <div className="lc-form-card">
              <div className="lc-form-header">
                <h3 className="lc-form-title">Report Issue to Admin</h3>
                <p className="lc-form-subtitle">Submit technical errors, policy disputes, or senate review requests.</p>
              </div>

              <form onSubmit={handleReportSubmit}>
                <div className="lc-form-grid">
                  <div className="lc-field">
                    <label className="lc-label">
                      <BookOpen size={14} />
                      Course Code
                    </label>
                    <select 
                      className="lc-select"
                      value={reportForm.courseCode}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      required
                    >
                      <option value="">Select Course</option>
                      {courseCodes.map(c => (
                        <option key={c.courseCode} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lc-field">
                    <label className="lc-label">
                      <Users size={14} />
                      Batch
                    </label>
                    <select 
                      className="lc-select"
                      value={reportForm.batch}
                      onChange={(e) => handleBatchChange(e.target.value)}
                      disabled={!reportForm.courseCode}
                      required
                    >
                      <option value="">Select Batch</option>
                      {batches.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lc-field lc-field--full">
                    <label className="lc-label">
                      <Info size={14} />
                      Complaint Title
                    </label>
                    <input 
                      type="text" 
                      className="lc-input"
                      placeholder="e.g. Discrepancy in Final Result Calculation"
                      value={reportForm.title}
                      onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="lc-field lc-field--full">
                    <label className="lc-label">
                      <MessageSquare size={14} />
                      Detailed Description
                    </label>
                    <textarea 
                      className="lc-textarea"
                      placeholder="Explain the issue in detail..."
                      value={reportForm.description}
                      onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="lc-form-actions">
                  <button 
                    type="button" 
                    className="lc-btn lc-btn--secondary"
                    onClick={() => setReportForm({ title: "", description: "", courseCode: "", batch: "", subjectId: "" })}
                  >
                    Clear Form
                  </button>
                  <button 
                    type="submit" 
                    className="lc-btn lc-btn--primary"
                    disabled={loading || !reportForm.subjectId}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    Submit Report
                  </button>
                </div>
              </form>
            </div>

            <div className="lc-hint" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <div className="lc-status-item pr-status-item--info" style={{ display: 'inline-flex', background: '#eff6ff', padding: '1rem', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                <AlertCircle size={20} color="#3b82f6" />
                <span style={{ marginLeft: '10px', color: '#1e40af', fontSize: '0.9rem' }}>
                  Complaints sent to the admin will be reviewed by the dean's office for senate validation.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default LecturerComplaints;
