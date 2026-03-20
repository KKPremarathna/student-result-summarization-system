import React, { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import { 
  getStudentDetails, 
  getMyComplaints, 
  submitComplaint,
  getMyIncourseSubjects 
} from "../services/studentApi";
import { extractRegNoFromEmail, formatRegNo } from "../utils/regUtils";
import "../styles/StudentComplaints.css";
import {
  MessageSquare,
  Send,
  LayoutDashboard,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  BookOpen,
  User,
  Award,
  Info
} from "lucide-react";

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentInfo, setStudentInfo] = useState({ name: "", eNumber: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const [form, setForm] = useState({
    subjectId: "",
    title: "",
    description: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Student Details
      const userRes = await getStudentDetails();
      const userData = userRes.data.data;
      const rawENo = userData.studentENo || extractRegNoFromEmail(userData.email);
      setStudentInfo({
        name: `${userData.firstName} ${userData.lastName}`,
        eNumber: formatRegNo(rawENo)
      });

      // 2. Complaints History
      const compRes = await getMyComplaints();
      setComplaints(compRes.data.data);

      // 3. Subject List for Form
      const subRes = await getMyIncourseSubjects();
      setSubjects(subRes.data || []);

    } catch (err) {
      console.error("Failed to fetch complaints data", err);
      setStatus({ type: "error", message: "Failed to load complaints history." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectId || !form.title || !form.description) {
      setStatus({ type: "error", message: "Please fill all required fields." });
      return;
    }

    setSubmitting(true);
    try {
      await submitComplaint(form);
      setStatus({ type: "success", message: "Complaint submitted successfully!" });
      setForm({ subjectId: "", title: "", description: "" });
      setShowForm(false);
      // Refresh history
      const compRes = await getMyComplaints();
      setComplaints(compRes.data.data);
    } catch (err) {
      console.error("Submission failed", err);
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to submit complaint." });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved": return <CheckCircle2 size={16} className="sc-status-icon--resolved" />;
      case "In Progress": return <Clock size={16} className="sc-status-icon--progress" />;
      default: return <Clock size={16} className="sc-status-icon--pending" />;
    }
  };

  return (
    <StudentLayout>
      <div className="sc-page">
        {/* Simplified Header */}
        <div className="sc-header">
          <div className="sc-header__main">
            <h1 className="sc-title">
              <MessageSquare size={32} className="sc-title__icon" />
              Academic Concerns
            </h1>
            <button 
              className={`sc-add-btn ${showForm ? 'active' : ''}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? "Cancel" : "New Complaint"}
            </button>
          </div>
        </div>

        {status.message && (
          <div className={`sc-status-bar ${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="sc-content">
          {/* Form Side / Toggle Section */}
          {showForm && (
            <div className="sc-form-card animate-slide-down">
              <div className="sc-card-header">
                <h3 className="sc-card-title">Submit New Complaint</h3>
              </div>
              <form onSubmit={handleSubmit} className="sc-form">
                <div className="sc-field">
                  <label className="sc-label">Target Subject</label>
                  <select 
                    className="sc-select"
                    value={form.subjectId}
                    onChange={(e) => setForm({...form, subjectId: e.target.value})}
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(s => (
                      <option key={s.subject?._id} value={s.subject?._id}>
                        {s.subject?.courseCode}: {s.subject?.courseName} ({s.subject?.batch})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="sc-field">
                  <label className="sc-label">Complaint Title</label>
                  <input 
                    type="text"
                    className="sc-input"
                    placeholder="Brief summary of the issue"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    required
                  />
                </div>

                <div className="sc-field">
                  <label className="sc-label">Detailed Description</label>
                  <textarea 
                    className="sc-textarea"
                    placeholder="Provide details about why you are raising this concern..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="sc-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Send Complaint
                </button>
              </form>
            </div>
          )}

          {/* History Grid */}
          <div className="sc-history">
            <h3 className="sc-section-title">Submission History</h3>
            {loading ? (
              <div className="sc-empty">
                <Loader2 className="animate-spin" size={32} />
                <p>Retrieving history...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="sc-empty">
                <MessageSquare size={48} className="sc-empty-icon" />
                <p>No complaints sent yet. Your history will appear here.</p>
              </div>
            ) : (
              <div className="sc-grid">
                {complaints.map((comp) => (
                  <div key={comp._id} className="sc-complaint-card">
                    <div className="sc-complaint-card__header">
                      <div className={`sc-status-tag sc-status--${comp.status.replace(/\s+/g, '').toLowerCase()}`}>
                        {getStatusIcon(comp.status)}
                        {comp.status}
                      </div>
                      <span className="sc-date">{new Date(comp.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="sc-complaint-card__body">
                      {comp.subjectId && (
                        <div className="sc-subject-tag">
                          <BookOpen size={12} />
                          {comp.subjectId.courseCode}
                        </div>
                      )}
                      <h4 className="sc-complaint-title">{comp.title}</h4>
                      <p className="sc-complaint-desc">{comp.description}</p>
                    </div>

                    <div className="sc-complaint-card__footer">
                      <div className="sc-recipient">
                        <User size={14} />
                        <span>To: {comp.lecturerId?.title} {comp.lecturerId?.lastName || "Course Coordinator"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentComplaints;
