import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/StudentWiseResult.css";
import { getStudentAcademicSummary, getStudentGPA, downloadReport } from "../services/studentApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  FileText, 
  Calendar, 
  Download, 
  MessageSquare, 
  ChevronRight, 
  BookOpen, 
  Award,
  BarChart3,
  TrendingUp,
  Info,
  GraduationCap,
  User,
  LayoutDashboard
} from "lucide-react";

const StudentWiseResult = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "Loading...",
    eNumber: "---",
    gpa: "0.00"
  });

  const [summary, setSummary] = useState({
    totalEnrolled: 0,
    passed: 0,
    failed: 0
  });

  const [gradeDistributionData, setGradeDistributionData] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetching "All" results by default
      const [summaryRes, gpaRes] = await Promise.all([
        getStudentAcademicSummary(""),
        getStudentGPA().catch(() => ({ data: { gpa: 0, studentENo: "N/A" } }))
      ]);

      if (summaryRes.data) {
        setSummary({
          totalEnrolled: summaryRes.data.summary.enrolled,
          passed: summaryRes.data.summary.passed,
          failed: summaryRes.data.summary.failed
        });

        setResults(summaryRes.data.results.map(r => ({
          batch: r.subject?.batch || "N/A",
          code: r.subject?.courseCode || "N/A",
          name: r.subject?.courseName || "Unknown",
          beforeSenate: r.grade || "E",
          afterSenate: r.afterSenateGrade || r.grade || "E",
          credit: r.subject?.credit || 0
        })));

        // Transform Grade Distribution
        const dist = summaryRes.data.gradeDistribution;
        const formattedDist = Object.keys(dist).map(grade => ({
          grade,
          count: dist[grade],
          color: getColorForGrade(grade)
        }));
        setGradeDistributionData(formattedDist);
      }

      const user = JSON.parse(localStorage.getItem("user")) || {};
      const fallbackENo = user.email ? user.email.split('@')[0].toUpperCase() : "N/A";
      
      setStudentInfo({
        name: user.firstName ? `${user.firstName} ${user.lastName}` : "Student",
        eNumber: gpaRes.data.studentENo || user.studentENo || fallbackENo,
        gpa: gpaRes.data.gpa ? gpaRes.data.gpa.toFixed(2) : "0.00"
      });

    } catch (error) {
      console.error("Error fetching student results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Academic_Report_${studentInfo.eNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const getColorForGrade = (grade) => {
    if (grade.startsWith('A')) return "#219EBC";
    if (grade.startsWith('B')) return "#8ECAE6";
    if (grade.startsWith('C')) return "#FFB703";
    if (grade.startsWith('D')) return "#FB8500";
    return "#D62828"; // E or F
  };

  return (
    <StudentLayout>
      <div className="st-page">
        {/* Professional Banner Section */}
        <div className="st-banner">
          <div className="st-banner__content">
            <div className="st-banner__avatar">
              <div className="st-banner__avatar-inner">
                <User size={40} className="st-banner__user-icon" />
              </div>
            </div>
            <div className="st-banner__info">
              <div className="st-banner__badge">Academic Year 2024/25</div>
              <h1 className="st-banner__title">{studentInfo.name}</h1>
              <div className="st-banner__meta">
                <div className="st-banner__meta-item">
                  <Award size={18} />
                  <span>Index: {studentInfo.eNumber}</span>
                </div>
                <div className="st-banner__meta-divider"></div>
                <div className="st-banner__meta-item">
                  <GraduationCap size={18} />
                  <span>Faculty of Engineering</span>
                </div>
              </div>
            </div>
          </div>

          <div className="st-banner__semester">
            <div className="st-info-item">
              <Calendar size={18} />
              <span>Academic Summary: All Results</span>
            </div>
          </div>
        </div>

        <div className="st-rows">
          {/* Row 1: Summary & GPA */}
          <div className="st-row st-row--top">
            <div className="st-card st-summary-card">
              <h2 className="st-card-title">Results Summary</h2>
              <div className="st-metrics">
                <div className="st-metric">
                  <span className="st-metric__label">Total Enrolled</span>
                  <span className="st-metric__value">{summary.totalEnrolled}</span>
                </div>
                <div className="st-metric">
                  <span className="st-metric__label">Passed Subjects</span>
                  <span className="st-metric__value st-text--green">{summary.passed}</span>
                </div>
                <div className="st-metric">
                  <span className="st-metric__label">Failed Subjects</span>
                  <span className="st-metric__value st-text--red">{summary.failed}</span>
                </div>
              </div>
            </div>

            <div className="st-gpa-container">
              <div className="st-gpa-card">
                <div className="st-gpa-content">
                  <TrendingUp size={24} />
                  <div className="st-gpa-text">
                    <span className="st-gpa-label">Current GPA</span>
                    <span className="st-gpa-value">{studentInfo.gpa}</span>
                  </div>
                </div>
                <div className="st-gpa-progress">
                  <div className="st-gpa-bar" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <Link to="/student/incourse-marks" className="st-incourse-link">
                <button className="st-btn st-btn--primary st-btn--full">
                  <BookOpen size={18} />
                  View Incourse Marks
                </button>
              </Link>
            </div>
          </div>

          {/* Row 2: Grade Distribution */}
          <div className="st-row">
            <div className="st-card st-distribution-card">
              <h2 className="st-card-title">Grade Distribution</h2>
              <div className="st-chart-wrap" style={{ height: "250px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistributionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="grade" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#4F7C82', fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#4F7C82', fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(184, 227, 233, 0.1)' }}
                      contentStyle={{ 
                        borderRadius: '1rem', 
                        border: 'none', 
                        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                        fontSize: '14px'
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: Detailed Table */}
          <div className="st-row">
            <div className="st-card st-table-card">
              <div className="st-table-header">
                <h2 className="st-card-title">Detailed Performance</h2>
                <div className="st-table-actions">
                  <button className="st-btn st-btn--outline" onClick={handleDownload}>
                    <Download size={16} />
                    Download PDF
                  </button>
                </div>
              </div>

              <div className="st-table-container">
                <table className="st-table">
                  <thead>
                    <tr>
                      <th>Batch</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Result <small>(Before Senate)</small></th>
                      <th>Result <small>(After Senate)</small></th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading results...</td></tr>
                    ) : results.length > 0 ? (
                      results.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.batch}</td>
                          <td className="st-font-mono">{row.code}</td>
                          <td>{row.name}</td>
                          <td><span className={`st-grade-badge st-grade--${row.beforeSenate.charAt(0)}`}>{row.beforeSenate}</span></td>
                          <td><span className={`st-grade-badge st-grade--${row.afterSenate.charAt(0)}`}>{row.afterSenate}</span></td>
                          <td>{row.credit}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No results found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentWiseResult;
