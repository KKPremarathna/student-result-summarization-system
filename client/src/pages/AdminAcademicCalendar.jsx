import { useState, useEffect } from "react";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import { getCalendars, uploadCalendar, deleteCalendar } from "../services/calendarApi";
import { Calendar, FileText, Upload, Trash2, ExternalLink } from "lucide-react";
import "../styles/AdminHome.css";
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
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to upload." });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this calendar?")) {
      try {
        await deleteCalendar(id);
        setMessage({ type: "success", text: "Calendar deleted successfully." });
        fetchCalendars();
      } catch (err) {
        setMessage({ type: "error", text: "Failed to delete from storage." });
      }
    }
  };

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-content">
        {/* Left sidebar - similar to AdminHome */}
        <aside className="adduser-sidebar">
          <ul className="sidebar-menu">
            <li>
              <Link to="/adminhome">Admin Home</Link>
            </li>
            <li>
              <Link to="/adduser">Add User</Link>
            </li>
            <li className="active">
              <Link to="/AdminCalendar">Calendar</Link>
            </li>
            <li>
              <Link to="/AdminComplaint">Complaint</Link>
            </li>
            <li>
              <Link to="/AdminResults">Results</Link>
            </li>
            <li>
              <Link to="/adminresetpassword">Reset Password</Link>
            </li>
          </ul>
        </aside>

        {/* Right main section */}
        <main className="admin-main" style={{ padding: '0', background: '#f8fafc' }}>
          <div className="admin-ac-wrapper ac-page">
            <div className="ac-header">
              <h2 className="ac-title">
                <Calendar className="ac-title__icon" size={32} />
                Manage Academic Calendars
              </h2>
            </div>

            {message.text && (
              <div className={`ac-alert ac-alert--${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Upload Form */}
            <div className="ac-card">
              <div className="ac-card__header">
                <div className="ac-card__icon-wrap">
                  <Upload size={24} />
                </div>
                <h3 className="ac-card__title">Upload New Calendar</h3>
              </div>

              <form onSubmit={handleUpload} className="ac-form">
                <div className="as-grid as-grid--2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="ac-field">
                    <label className="ac-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Fall Semester Schedule"
                      className="ac-input"
                      required
                    />
                  </div>
                  <div className="ac-field">
                    <label className="ac-label">Academic Year</label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="e.g. 2024/2025"
                      className="ac-input"
                      required
                    />
                  </div>
                </div>
                <div className="ac-field">
                  <label className="ac-label">PDF File</label>
                  <input
                    type="file"
                    id="pdfFileInput"
                    name="pdfFile"
                    onChange={handleChange}
                    accept="application/pdf"
                    className="ac-input"
                    required
                  />
                </div>
                <button type="submit" className="ac-submit-btn" disabled={uploadLoading}>
                  <Upload size={18} />
                  {uploadLoading ? "Uploading..." : "Upload Calendar"}
                </button>
              </form>
            </div>

            {/* Uploaded Calendars List */}
            <div className="ac-card">
              <div className="ac-card__header">
                <div className="ac-card__icon-wrap">
                  <FileText size={24} />
                </div>
                <h3 className="ac-card__title">Uploaded Calendars</h3>
              </div>

              {loading ? (
                <p>Loading calendars...</p>
              ) : calendars.length > 0 ? (
                <div className="ac-grid">
                  {calendars.map(cal => (
                    <div key={cal._id} className="ac-item-card">
                      <div className="ac-item-info">
                        <div className="ac-pdf-icon">
                          <FileText size={24} />
                        </div>
                        <div className="ac-item-details">
                          <h4>{cal.title}</h4>
                          <p>Year: {cal.year}</p>
                        </div>
                      </div>
                      <div className="ac-item-actions">
                        <a href={cal.fileUrl} target="_blank" rel="noopener noreferrer" className="ac-btn-view" title="Open PDF">
                          <ExternalLink size={18} />
                        </a>
                        <button onClick={() => handleDelete(cal._id)} className="ac-btn-delete" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ac-empty">
                  No academic calendars have been uploaded yet.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminAcademicCalendar;
