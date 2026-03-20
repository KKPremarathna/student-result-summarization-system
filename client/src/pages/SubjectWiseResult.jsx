import { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/SubjectWiseResult.css";
import { getStudentFinalResults, getSubjectAnalytics } from "../services/studentApi";
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
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  GraduationCap, 
  User, 
  Clock, 
  FileText, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const SubjectWiseResult = () => {
  const [subjectsList, setSubjectsList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({ courseCode: "", batch: "" });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Professional Color Palette
  const colors = {
    excellent: "#219EBC", // Bright Teal
    good: "#8ECAE6",      // Light Blue
    average: "#FFB703",   // Amber
    warning: "#FB8500",   // Orange
    danger: "#D62828"     // Red
  };

  const gradeColorMap = {
    "A+": colors.excellent, "A": colors.excellent, "A-": colors.excellent,
    "B+": colors.good, "B": colors.good, "B-": colors.good,
    "C+": colors.average, "C": colors.average, "C-": colors.average,
    "D+": colors.warning, "D": colors.warning, "E": colors.danger, "F": colors.danger
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const res = await getStudentFinalResults();
      const results = res.data.results || [];
      
      // Extract unique subjects (courseCode + batch)
      const uniqueSubjects = [];
      const seen = new Set();

      results.forEach(r => {
        if (r.subject) {
          const key = `${r.subject.courseCode}-${r.subject.batch}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueSubjects.push({
              courseCode: r.subject.courseCode,
              courseName: r.subject.courseName,
              batch: r.subject.batch
            });
          }
        }
      });

      setSubjectsList(uniqueSubjects);

      if (uniqueSubjects.length > 0) {
        const first = uniqueSubjects[0];
        setSelectedSubject({ courseCode: first.courseCode, batch: first.batch });
        fetchAnalytics(first.courseCode, first.batch);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load subjects", err);
      setError("Failed to load your subjects. Please try again later.");
      setLoading(false);
    }
  };

  const fetchAnalytics = async (courseCode, batch) => {
    setLoading(true);
    setError("");
    try {
      const res = await getSubjectAnalytics(courseCode, batch);
      const data = res.data;
      
      // Transform gradeDistribution into Recharts format
      const chartData = Object.entries(data.gradeDistribution).map(([grade, count]) => ({
        grade,
        count,
        color: gradeColorMap[grade] || colors.average
      }));

      setAnalyticsData({
        info: data.subjectInfo,
        stats: data.statistics,
        chart: chartData
      });
    } catch (err) {
      console.error("Failed to fetch analytics", err);
      setError(err.response?.data?.message || "Failed to fetch subject analytics.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    const [code, batch] = e.target.value.split("|");
    setSelectedSubject({ courseCode: code, batch });
    fetchAnalytics(code, batch);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="sw-custom-tooltip">
          <p className="sw-custom-tooltip__label">{`Grade: ${label}`}</p>
          <div className="sw-custom-tooltip__divider"></div>
          <p className="sw-custom-tooltip__value">
            <span style={{ color: payload[0].payload.color }}>●</span>
            {` Students: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading && !analyticsData) {
    return (
      <StudentLayout>
        <div className="sh-loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Analyzing subject results...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="sw-page">
        {/* Header Section */}
        <div className="sw-header">
          <div className="sw-header__content">
            <h1 className="sw-header__title">Subject-wise Result</h1>
            <p className="sw-header__subtitle">Explore individual subject performance and grade distribution.</p>
          </div>
          <div className="sw-header__icon">
            <BookOpen size={40} />
          </div>
        </div>

        {/* Filters Section */}
        <div className="sw-card sw-filters">
          <div className="sw-filter-group">
            <div className="sw-filter-item">
              <label className="sw-filter-label">Select Subject</label>
              <div className="sw-select-wrapper">
                <Search size={18} className="sw-select-icon" />
                <select
                  className="sw-select"
                  value={`${selectedSubject.courseCode}|${selectedSubject.batch}`}
                  onChange={handleSubjectChange}
                  disabled={subjectsList.length === 0}
                >
                  {subjectsList.length > 0 ? (
                    subjectsList.map((s, idx) => (
                      <option key={idx} value={`${s.courseCode}|${s.batch}`}>
                        {s.courseCode} - {s.courseName} ({s.batch})
                      </option>
                    ))
                  ) : (
                    <option>No subjects found</option>
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="sw-filter-actions">
            <Link to="/student/incourse-marks">
              <button className="sw-btn sw-btn--primary">
                <BookOpen size={18} />
                Incourse Marks
              </button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="sh-status-bar error" style={{ marginBottom: '2rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {analyticsData ? (
          <div className="sw-grid">
            {/* Chart Section */}
            <div className="sw-card sw-chart-card">
              <div className="sw-card__header">
                <h2 className="sw-card__title">Student Grade Distribution</h2>
                <div className="sw-card__badge">{selectedSubject.batch} Batch</div>
              </div>

              <div className="sw-chart-container">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={analyticsData.chart} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                    <defs>
                      {analyticsData.chart.map((entry, index) => (
                        <linearGradient key={`grad-${index}`} id={`colorGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={entry.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={entry.color} stopOpacity={0.3}/>
                        </linearGradient>
                      ))}
                    </defs>
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
                      tick={{ fill: '#4F7C82', fontSize: 13, fontWeight: 600 }}
                      dx={-10}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(184, 227, 233, 0.1)' }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[10, 10, 0, 0]} 
                      barSize={40}
                      animationDuration={1500}
                    >
                      {analyticsData.chart.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#colorGrad-${index})`}
                          stroke={entry.color}
                          strokeWidth={1}
                        />
                      ))}
                      <LabelList 
                        dataKey="count" 
                        position="top" 
                        fill="#0B2E33" 
                        fontSize={14}
                        fontWeight={800} 
                        offset={12} 
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="sw-chart-label">Total Results: {analyticsData.stats.enrolled}</div>
              </div>
            </div>

            {/* Info Section */}
            <div className="sw-card sw-info-card">
              <div className="sw-card__header">
                <h2 className="sw-card__title">Subject Details</h2>
              </div>

              <div className="sw-info-list">
                <div className="sw-info-item">
                  <div className="sw-info-icon sw-info-icon--blue">
                    <Users size={20} />
                  </div>
                  <div className="sw-info-content">
                    <span className="sw-info-label">Enrolled Students</span>
                    <span className="sw-info-value">{analyticsData.stats.enrolled}</span>
                  </div>
                </div>

                <div className="sw-info-item">
                  <div className="sw-info-icon sw-info-icon--green">
                    <GraduationCap size={20} />
                  </div>
                  <div className="sw-info-content">
                    <span className="sw-info-label">Passed Students</span>
                    <span className="sw-info-value">{analyticsData.stats.passed}</span>
                  </div>
                </div>

                <div className="sw-info-item">
                  <div className="sw-info-icon sw-info-icon--red">
                    <FileText size={20} />
                  </div>
                  <div className="sw-info-content">
                    <span className="sw-info-label">Failed Students</span>
                    <span className="sw-info-value">{analyticsData.stats.failed}</span>
                  </div>
                </div>

                <div className="sw-info-divider"></div>

                <div className="sw-info-item">
                  <div className="sw-info-icon sw-info-icon--teal">
                    <User size={20} />
                  </div>
                  <div className="sw-info-content">
                    <span className="sw-info-label">Lecturer</span>
                    <span className="sw-info-value">{analyticsData.info.lecturer}</span>
                  </div>
                </div>

                <div className="sw-info-item">
                  <div className="sw-info-icon sw-info-icon--purple">
                    <Clock size={20} />
                  </div>
                  <div className="sw-info-content">
                    <span className="sw-info-label">Credits</span>
                    <span className="sw-info-value">{analyticsData.info.credit} Credits</span>
                  </div>
                </div>

                <div className="sw-card sw-about-box">
                  <h3 className="sw-about-title">About Subject</h3>
                  <p className="sw-about-text">{analyticsData.info.description || "No description available for this subject."}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && subjectsList.length === 0 && (
            <div className="sh-empty-state" style={{ textAlign: 'center', padding: '4rem 0' }}>
               <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
               <h3>No results released yet</h3>
               <p>Once your results are published by the senate, they will appear here.</p>
            </div>
          )
        )}
      </div>
    </StudentLayout>
  );
};

export default SubjectWiseResult;
