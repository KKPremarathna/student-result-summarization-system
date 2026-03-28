import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LecturerLayout from "../components/LecturerLayout.jsx";
import StudentLayout from "../components/StudentLayout.jsx";
import { getCalendars } from "../services/calendarApi.js";
import { Calendar, FileText, ExternalLink, ShieldAlert, LogIn, UserPlus, Info } from "lucide-react";
import "../styles/AcademicCalendar.css";

function ViewAcademicCalendar() {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Stylish Guest View
  if (!user || !user.role) {
    return (
      <div className="ac-auth-wall">
        <div className="ac-auth-card">
          <div className="ac-auth-icon">
            <ShieldAlert size={40} />
          </div>
          <h2 className="ac-auth-title">Welcome Guest</h2>
          <p className="ac-auth-text">
            To view the official Academic Calendar and stay updated with campus schedules, 
            please sign in to your student or faculty account.
          </p>
          <div className="ac-auth-btns">
            <Link to="/signin" className="ac-nav-btn primary">
              <LogIn size={20} />
              Sign In Now
            </Link>
            <Link to="/signup" className="ac-nav-btn outline">
              <UserPlus size={20} />
              Create Account
            </Link>
          </div>
          <p className="ac-auth-footer">
            <Info size={14} className="ac-auth-footer-icon" />
            Only registered members can access academic schedules.
          </p>
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
        {/* Hero Section */}
        <section className="ac-hero">
          <div className="ac-hero__content">
            <div className="ac-breadcrumb-alt">
              <span>Portal</span>
              <span>/</span>
              <span>Academic Schedule</span>
            </div>
            <h2 className="ac-hero__title">
              <Calendar size={40} />
              Academic Calendar
            </h2>
            <p className="ac-hero__subtitle">
              Stay organized and never miss a deadline. Access all official academic 
              schedules, semester dates, and holiday calendars here.
            </p>
          </div>
        </section>

        <div className="ac-section">
          <div className="ac-section-header">
            <h3 className="ac-section-title">Available Documents</h3>
            <div className="ac-tag ac-tag--official">Official Records</div>
          </div>

          {loading ? (
            <div className="ac-empty-container">
              <p>Loading schedules...</p>
            </div>
          ) : calendars.length > 0 ? (
            <div className="ac-items-grid">
              {calendars.map(cal => (
                <div key={cal._id} className="ac-calendar-item">
                  <div className="ac-item-top">
                    <div className="ac-icon-box ac-icon-box--blue">
                      <FileText size={24} />
                    </div>
                    <div className="ac-item-main">
                      <h4>{cal.title}</h4>
                      <div className="ac-item-year">Year: {cal.year}</div>
                    </div>
                  </div>
                  
                  <div className="ac-item-footer">
                    <span className="ac-tag">PDF View</span>
                    <div className="ac-action-group">
                      <a href={cal.fileUrl} target="_blank" rel="noopener noreferrer" className="ac-btn-view">
                        <ExternalLink size={18} /> Open Schedule
                      </a>
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
              <p className="ac-empty-text">No official calendars have been published for your role yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ViewAcademicCalendar;
