import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/StudentWiseResult.css";
import { getStudentFinalResults, getStudentDetails } from "../services/studentApi";
import { extractRegNoFromEmail, formatRegNo } from "../utils/regUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { 
  FileText, 
  Calendar, 
  Download, 
  BookOpen, 
  Award,
  TrendingUp,
  GraduationCap,
  User,
  Loader2,
  AlertCircle,
  Info
} from "lucide-react";

const StudentWiseResult = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [studentInfo, setStudentInfo] = useState({ name: "", eNumber: "", gpa: "0.00" });

  // Grade Points Mapping for GPA calculation
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'E': 0.0
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Student Details for Banner
      const userRes = await getStudentDetails();
      const userData = userRes.data.data;
      const rawENo = userData.studentENo || extractRegNoFromEmail(userData.email);

      // 2. Fetch All Final Results
      const res = await getStudentFinalResults();
      const results = res.data.results || [];
      setAllResults(results);

      // Extract unique semesters and set initial selection
      const semesters = [...new Set(results.map(r => r.subject?.semester).filter(Boolean))].sort();
      if (semesters.length > 0) {
        setSelectedSemester(semesters[semesters.length - 1]); // Default to latest
      }

      // Calculate Overall GPA
      let totalQP = 0;
      let totalCR = 0;
      results.forEach(r => {
        const grade = r.afterSenateGrade || r.grade;
        const credits = r.subject?.credit || 0;
        if (gradePoints[grade] !== undefined) {
          totalQP += gradePoints[grade] * credits;
          totalCR += credits;
        }
      });
      const overallGPA = totalCR > 0 ? (totalQP / totalCR).toFixed(2) : "0.00";

      setStudentInfo({
        name: `${userData.firstName} ${userData.lastName}`,
        eNumber: formatRegNo(rawENo),
        gpa: overallGPA,
        faculty: userData.faculty || "Faculty of Engineering"
      });

    } catch (err) {
      console.error("Failed to fetch results", err);
      setError("Failed to load your academic results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Derive Semester Data
  const semesterData = useMemo(() => {
    if (!selectedSemester) return { list: [], summary: { total: 0, passed: 0, failed: 0 }, chart: [] };

    const filtered = allResults.filter(r => r.subject?.semester === selectedSemester);
    
    let passed = 0;
    let failed = 0;
    const distribution = {
      'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0,
      'C+': 0, 'C': 0, 'C-': 0, 'D+': 0, 'D': 0, 'E': 0, 'I': 0
    };

    filtered.forEach(r => {
      const grade = r.afterSenateGrade || r.grade;
      if (distribution[grade] !== undefined) distribution[grade]++;
      
      // Pass if grade not E and incourse > 35
      if (grade !== "E" && r.incourseTotal > 35) {
        passed++;
      } else {
        failed++;
      }
    });

    const chart = Object.entries(distribution).map(([grade, count]) => ({
      grade,
      count,
      color: grade.startsWith('A') ? '#219EBC' : grade.startsWith('B') ? '#8ECAE6' : grade.startsWith('C') ? '#FFB703' : grade.startsWith('D') ? '#FB8500' : '#D62828'
    }));

    return {
      list: filtered,
      summary: { total: filtered.length, passed, failed },
      chart
    };
  }, [allResults, selectedSemester]);

  const uniqueSemesters = useMemo(() => {
    return [...new Set(allResults.map(r => r.subject?.semester).filter(Boolean))].sort();
  }, [allResults]);

  if (loading && allResults.length === 0) {
    return (
      <StudentLayout>
        <div className="sh-loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Compiling academic record...</p>
        </div>
      </StudentLayout>
    );
  }

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
              <div className="st-banner__badge">Engineering Student Portal</div>
              <h1 className="st-banner__title">{studentInfo.name}</h1>
              <div className="st-banner__meta">
                <div className="st-banner__meta-item">
                  <Award size={18} />
                  <span>Index: {studentInfo.eNumber}</span>
                </div>
                <div className="st-banner__meta-divider"></div>
                <div className="st-banner__meta-item">
                  <GraduationCap size={18} />
                  <span>{studentInfo.faculty}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="st-banner__semester">
            <div className="st-semester-picker">
              <label>Select Semester</label>
              <div className="st-select-wrapper">
                <Calendar size={18} className="st-select-icon" />
                <select 
                  value={selectedSemester} 
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="st-select"
                  disabled={uniqueSemesters.length === 0}
                >
                  {uniqueSemesters.length > 0 ? (
                    uniqueSemesters.map((sem, idx) => (
                      <option key={idx} value={sem}>{sem}</option>
                    ))
                  ) : (
                    <option>No results found</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="sh-status-bar error" style={{ margin: '1rem 0 2rem 0' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="st-rows">
          {/* Row 1: Summary & GPA */}
          <div className="st-row st-row--top">
            <div className="st-card st-summary-card">
              <h2 className="st-card-title">Results Summary ({selectedSemester})</h2>
              <div className="st-metrics">
                <div className="st-metric">
                  <span className="st-metric__label">Total Enrolled</span>
                  <span className="st-metric__value">{semesterData.summary.total}</span>
                </div>
                <div className="st-metric">
                  <span className="st-metric__label">Passed Subjects</span>
                  <span className="st-metric__value st-text--green">{semesterData.summary.passed}</span>
                </div>
                <div className="st-metric">
                  <span className="st-metric__label">Failed Subjects</span>
                  <span className="st-metric__value st-text--red">{semesterData.summary.failed}</span>
                </div>
              </div>
            </div>

            <div className="st-gpa-container">
              <div className="st-gpa-card">
                <div className="st-gpa-content">
                  <TrendingUp size={24} />
                  <div className="st-gpa-text">
                    <span className="st-gpa-label">Overall GPA</span>
                    <span className="st-gpa-value">{studentInfo.gpa}</span>
                  </div>
                </div>
                <div className="st-gpa-progress">
                  <div className="st-gpa-bar" style={{ width: `${(parseFloat(studentInfo.gpa) / 4.0) * 100}%` }}></div>
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
              <h2 className="st-card-title">Grade Distribution ({selectedSemester})</h2>
              <div className="st-chart-wrap" style={{ height: "280px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={semesterData.chart} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="grade" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#4F7C82', fontSize: 13, fontWeight: 700 }}
                      dy={10}
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
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                      {semesterData.chart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList 
                        dataKey="count" 
                        position="top" 
                        fill="#0B2E33" 
                        fontSize={12} 
                        fontWeight={800} 
                        offset={10}
                        formatter={(val) => val > 0 ? val : ""}
                      />
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
                <h2 className="st-card-title">{selectedSemester} Performance Detail</h2>
                <div className="st-table-actions">
                  <button className="st-btn st-btn--outline" onClick={() => window.print()}>
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
                    {semesterData.list.length > 0 ? (
                      semesterData.list.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.subject?.batch || "-"}</td>
                          <td className="st-font-mono">{row.subject?.courseCode || "-"}</td>
                          <td>{row.subject?.courseName || "-"}</td>
                          <td>
                            <span className={`st-grade-badge st-grade--${row.grade?.charAt(0) || 'E'}`}>
                              {row.grade || "-"}
                            </span>
                          </td>
                          <td>
                            <span className={`st-grade-badge st-grade--${(row.afterSenateGrade || row.grade)?.charAt(0) || 'E'}`}>
                              {row.afterSenateGrade || row.grade || "-"}
                            </span>
                          </td>
                          <td>{row.subject?.credit || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                          <Info size={24} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                          <p>No detailed results available for this semester.</p>
                        </td>
                      </tr>
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
