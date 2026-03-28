import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getCalendars, uploadCalendar, deleteCalendar } from "../services/calendarApi";
import { Calendar, FileText, Upload, Trash2, ExternalLink, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/AcademicCalendar.css";

function AdminAcademicCalendar() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadLoading, setUploadLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    year: "",
    pdfFile: null
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    calendarId: null,
    calendarTitle: ""
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const { data } = await getCalendars();
      setCalendars(data.data || []);
    } catch (err) {
      console.error("Error fetching calendars", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "pdfFile") {
      setFormData({ ...formData, pdfFile: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.year || !formData.pdfFile) {
      setMessage({ type: "error", text: "Please provide all required fields." });
      return;
    }

    const yearRegex = /^\d{4}\/\d{4}$/;
    if (!yearRegex.test(formData.year)) {
      setMessage({ type: "error", text: "Academic Year must be in YYYY/YYYY format (e.g., 2025/2026)." });
      return;
    }

    setUploadLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    data.append("title", formData.title);
    data.append("year", formData.year);
    data.append("pdfFile", formData.pdfFile);

    try {
      await uploadCalendar(data);
      setMessage({ type: "success", text: "Calendar uploaded successfully." });
      setFormData({ title: "", year: "", pdfFile: null });
      if (document.getElementById('pdfFileInput')) {
        document.getElementById('pdfFileInput').value = '';
      }
      fetchCalendars();
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || "Failed to upload.";
      const errorDetail = err.response?.data?.error ? `: ${err.response.data.error}` : "";
      setMessage({ type: "error", text: serverMsg + errorDetail });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteClick = (id, title) => {
    setDeleteModal({
      isOpen: true,
      calendarId: id,
      calendarTitle: title
    });
  };

  const confirmDelete = async () => {
    const { calendarId } = deleteModal;
    setDeleteModal({ ...deleteModal, isOpen: false });
    
    try {
      await deleteCalendar(calendarId);
      setMessage({ type: "success", text: "Calendar deleted successfully." });
      fetchCalendars();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete from storage." });
    }
  };

  return (
    <AdminLayout>
      <div className="ac-page">
        {/* Hero Section */}
        <section className="ac-hero">
          <div className="ac-hero__content">
            <div className="ac-breadcrumb-alt">
              <span>Admin Portal</span>
              <span>/</span>
              <span>Academic Calendar</span>
            </div>
            <h2 className="ac-hero__title">
              <Calendar size={40} />
              Manage Calendars
            </h2>
            <p className="ac-hero__subtitle">
              Upload, view, and organize academic schedules for students and faculty. 
              Ensure all files are in PDF format for consistent accessibility.
            </p>
          </div>
        </section>

        {/* Status Alerts */}
        {message.text && (
          <div className={`ac-alert-new ac-alert-new--${message.type}`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="ac-section">
          <div className="ac-form-grid" style={{ gridTemplateColumns: "1fr" }}>
            {/* Upload Card */}
            <div className="ac-dashboard-card">
              <div className="ac-section-header">
                <h3 className="ac-section-title">Upload New Schedule</h3>
              </div>
              
              <form onSubmit={handleUpload} className="ac-form">
                <div className="ac-form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                  <div className="ac-form-group">
                    <label className="ac-form-label">Schedule Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., 2024/25 Semester I"
                      className="ac-form-input"
                      required
                    />
                  </div>
                  <div className="ac-form-group">
                    <label className="ac-form-label">Academic Year</label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="e.g., 2024/2025"
                      className="ac-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="ac-form-group">
                  <label className="ac-form-label">Calendar Document (PDF)</label>
                  <div className="ac-file-upload-wrapper" onClick={() => document.getElementById('pdfFileInput').click()}>
                    <Upload size={32} style={{ marginBottom: '12px', color: '#6366f1' }} />
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      {formData.pdfFile ? formData.pdfFile.name : "Click here or drag file to upload"}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Support only PDF files (Max 10MB)</p>
                    <input
                      type="file"
                      id="pdfFileInput"
                      name="pdfFile"
                      onChange={handleChange}
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button type="submit" className="ac-primary-btn" disabled={uploadLoading}>
                    {uploadLoading ? <Plus size={20} className="animate-spin" /> : <Upload size={20} />}
                    {uploadLoading ? "Processing..." : "Publish Calendar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="ac-section">
          <div className="ac-section-header">
            <h3 className="ac-section-title">Published Schedules</h3>
            <span className="ac-tag" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              {calendars.length} Documents
            </span>
          </div>

          {loading ? (
            <div className="ac-empty-container">
              <p>Fetching documents...</p>
            </div>
          ) : calendars.length > 0 ? (
            <div className="ac-items-grid">
              {calendars.map(cal => (
                <div key={cal._id} className="ac-calendar-item">
                  <div className="ac-item-top">
                    <div className="ac-icon-box">
                      <FileText size={24} />
                    </div>
                    <div className="ac-item-main">
                      <h4>{cal.title}</h4>
                      <div className="ac-item-year">{cal.year}</div>
                    </div>
                  </div>
                  
                  <div className="ac-item-footer">
                    <span className="ac-tag">PDF Document</span>
                    <div className="ac-action-group">
                      <a href={cal.fileUrl} target="_blank" rel="noopener noreferrer" className="ac-icon-btn view" title="View Document">
                        <ExternalLink size={18} />
                      </a>
                      <button onClick={() => handleDeleteClick(cal._id, cal.title)} className="ac-icon-btn delete" title="Remove Document">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ac-empty-container">
              <div className="ac-empty-icon">
                <FileText size={48} />
              </div>
              <p className="ac-empty-text">No academic calendars have been published yet.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Academic Calendar"
        message={`Are you sure you want to delete "${deleteModal.calendarTitle}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
}

export default AdminAcademicCalendar;
