import { useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/StudentWiseResult.css";
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
  const [selectedSemester, setSelectedSemester] = useState("Semester 5");

  const studentInfo = {
    name: "Karunarathna K.P.S",
    eNumber: "2021/E/162",
    gpa: "3.75"
  };

  const summary = {
    totalEnrolled: 8,
    passed: 8,
    failed: 0
  };

  const gradeDistributionData = [
    { grade: "A+", count: 1, color: "#219EBC" },
    { grade: "A", count: 0, color: "#219EBC" },
    { grade: "A-", count: 3, color: "#219EBC" },
    { grade: "B+", count: 6, color: "#8ECAE6" },
    { grade: "B", count: 2, color: "#8ECAE6" },
    { grade: "B-", count: 3, color: "#8ECAE6" },
    { grade: "C+", count: 3, color: "#FFB703" },
    { grade: "C", count: 2, color: "#FFB703" },
    { grade: "C-", count: 0, color: "#FFB703" },
    { grade: "D+", count: 0, color: "#FB8500" },
    { grade: "D", count: 0, color: "#FB8500" },
    { grade: "E", count: 1, color: "#D62828" },
  ];

  const results = [
    { batch: "E 21", code: "EC5080", name: "Software Construction", beforeSenate: "C-", afterSenate: "C", credit: "03" },
    { batch: "E 21", code: "EC9630", name: "Machine Learning", beforeSenate: "E", afterSenate: "E", credit: "02" },
    { batch: "E 22", code: "EC9630", name: "Machine Learning", beforeSenate: "C", afterSenate: "C", credit: "02" },
  ];

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
            <div className="st-semester-picker">
              <label>Select Semester</label>
              <div className="st-select-wrapper">
                <Calendar size={18} className="st-select-icon" />
                <select 
                  value={selectedSemester} 
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="st-select"
                >
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                  <option>Semester 3</option>
                  <option>Semester 4</option>
                  <option>Semester 5</option>
                </select>
              </div>
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
                  <button className="st-btn st-btn--outline">
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
                    {results.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.batch}</td>
                        <td className="st-font-mono">{row.code}</td>
                        <td>{row.name}</td>
                        <td><span className={`st-grade-badge st-grade--${row.beforeSenate.charAt(0)}`}>{row.beforeSenate}</span></td>
                        <td><span className={`st-grade-badge st-grade--${row.afterSenate.charAt(0)}`}>{row.afterSenate}</span></td>
                        <td>{row.credit}</td>
                      </tr>
                    ))}
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
