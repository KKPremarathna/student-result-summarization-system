import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/StudentHome.css";
import { getStudentDetails } from "../services/studentApi";
import { 
  User, 
  BookOpen, 
  FileText, 
  Settings, 
  Loader2,
  GraduationCap,
  Building2,
  MapPin,
  ChevronRight,
  Award
} from "lucide-react";
import { extractRegNoFromEmail, formatRegNo } from "../utils/regUtils";

function StudentHome() {
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({ cgpa: "0.00", totalCredits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const res = await getStudentDetails();
      const data = res.data.data;
      const rawENo = data.studentENo || extractRegNoFromEmail(data.email);
      setStudent({
        name: `${data.firstName} ${data.lastName}`,
        indexNo: formatRegNo(rawENo) || "N/A",
        faculty: data.faculty || "Faculty of Engineering",
        university: "University of Jaffna"
      });

      try {
        const { getStudentFinalResults } = await import("../services/studentApi");
        const resultsRes = await getStudentFinalResults();
        if (resultsRes.data && resultsRes.data.summary) {
           setStats({ cgpa: resultsRes.data.summary.cgpa, totalCredits: resultsRes.data.summary.totalCredits });
        }
      } catch (err) {
        console.error("Failed to fetch CGPA", err);
      }

    } catch (err) {
      console.error("Home data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="sh-loading">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="sh-container-premium">
        <div className="sh-grid-premium">
          {/* Main Profile Card (Left) */}
          <div className="sh-card-main">
            <div className="sh-avatar-section">
              <div className="sh-avatar-ring">
                <div className="sh-avatar-bg">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.name || 'Student'}`}
                    alt="avatar" 
                  />
                </div>
              </div>
              <h1 className="sh-student-name">{student?.name}</h1>
              <div className="sh-index-badge">
                <GraduationCap size={14} />
                <span>{student?.indexNo}</span>
              </div>
            </div>

            <div className="sh-info-stack">
              <div className="sh-info-item-wide">
                <div className="sh-info-label-wrap">
                  <GraduationCap size={18} />
                  <span>Index No</span>
                </div>
                <span className="sh-info-value-wide">{student?.indexNo}</span>
              </div>

              <div className="sh-info-item-wide">
                <div className="sh-info-label-wrap">
                  <Building2 size={18} />
                  <span>Faculty</span>
                </div>
                <span className="sh-info-value-wide">{student?.faculty}</span>
              </div>

              <div className="sh-info-item-wide">
                <div className="sh-info-label-wrap">
                  <MapPin size={18} />
                  <span>University</span>
                </div>
                <span className="sh-info-value-wide">{student?.university}</span>
              </div>
            </div>

            <Link to="/student/profile" className="sh-settings-btn-wrap">
              <button className="sh-settings-btn">
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </Link>
          </div>

          {/* Action Cards (Right) */}
          <div className="sh-actions-grid">
            <div className="sh-action-card cgpa-card" style={{ background: "var(--bg-card)", border: "1px solid var(--admin-border)", cursor: "default" }}>
              <div className="sh-action-icon-wrap" style={{ background: "rgba(33, 158, 188, 0.1)", color: "var(--primary)" }}>
                <Award size={24} />
              </div>
              <div className="sh-action-content">
                <h3 className="sh-action-title">Cumulative GPA</h3>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", marginTop: "0.25rem" }}>{stats.cgpa}</div>
                <p className="sh-action-subtitle" style={{ marginTop: "0.25rem", color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "1px", fontWeight: "600" }}>BASED ON {stats.totalCredits} CREDITS</p>
              </div>
            </div>

            <Link to="/student/subject-wise" className="sh-action-card-link">
              <div className="sh-action-card teal">
                <div className="sh-action-icon-wrap">
                  <BookOpen size={24} />
                </div>
                <div className="sh-action-content">
                  <h3 className="sh-action-title">Subject-wise Result</h3>
                  <p className="sh-action-subtitle">CHECK OVERALL SUMMARY OF BATCH</p>
                </div>
                <div className="sh-action-corner-icon">
                   <div className="sh-mini-chart-mock" />
                </div>
              </div>
            </Link>

            <Link to="/student/student-wise" className="sh-action-card dark">
              <div className="sh-action-icon-wrap">
                <FileText size={24} />
              </div>
              <div className="sh-action-content">
                <h3 className="sh-action-title">Student-wise Result</h3>
                <p className="sh-action-subtitle">VIEW INDIVIDUAL PERFORMANCE</p>
              </div>
              <div className="sh-action-corner-icon">
                 <FileText size={24} className="sh-op-icon" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentHome;
