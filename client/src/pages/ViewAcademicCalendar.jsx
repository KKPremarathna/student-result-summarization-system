import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LecturerLayout from "../components/LecturerLayout.jsx";
import StudentLayout from "../components/StudentLayout.jsx";
import { getCalendars } from "../services/calendarApi.js";
import { Calendar, FileText, ExternalLink } from "lucide-react";
import "../styles/AcademicCalendar.css";

function ViewAcademicCalendar() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || !user.role) {
    return (
      <div className="ac-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', background: '#f8fafc' }}>
        <div className="ac-header" style={{ marginBottom: '2rem' }}>
          <h2 className="ac-title">
            <Calendar className="ac-title__icon" size={32} />
            Academic Calendar
          </h2>
        </div>
        <div className="ac-card" style={{ maxWidth: '500px', padding: '40px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#1e293b' }}>Access Denied</h3>
          <p style={{ fontSize: '16px', marginBottom: '32px', color: '#64748b', lineHeight: '1.5' }}>
            Please Sign Up or Sign In to view the academic calendar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/signup" className="ac-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px' }}>Sign Up</Link>
            <Link to="/signin" className="ac-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', background: '#3b82f6' }}>Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  const Layout = user.role === "lecturer" ? LecturerLayout : StudentLayout;

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

  return (
    <Layout>
      <div className="ac-page">
        <div className="ac-header">
          <h2 className="ac-title">
            <Calendar className="ac-title__icon" size={32} />
            Academic Calendar
          </h2>
        </div>

        <div className="ac-card">
          <div className="ac-card__header">
            <div className="ac-card__icon-wrap">
              <FileText size={24} />
            </div>
            <h3 className="ac-card__title">Available Calendars</h3>
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
                      <ExternalLink size={18} /> View PDF
                    </a>
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
    </Layout>
  );
}

export default ViewAcademicCalendar;
