import { useState } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/SubjectWiseResult.css";
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
import { Search, Filter, BookOpen, Users, GraduationCap, User, Clock, FileText, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const SubjectWiseResult = () => {
  const [filters, setFilters] = useState({
    courseCode: "EC5060",
    batch: "2021"
  });

  // Professional Color Palette
  const colors = {
    excellent: "#219EBC", // Bright Teal
    good: "#8ECAE6",      // Light Blue
    average: "#FFB703",   // Amber
    warning: "#FB8500",   // Orange
    danger: "#D62828"     // Red
  };

  const resultData = [
    { grade: "A+", count: 4, color: colors.excellent },
    { grade: "A", count: 7, color: colors.excellent },
    { grade: "A-", count: 5, color: colors.excellent },
    { grade: "B+", count: 8, color: colors.good },
    { grade: "B", count: 12, color: colors.good },
    { grade: "B-", count: 6, color: colors.good },
    { grade: "C+", count: 5, color: colors.average },
    { grade: "C", count: 4, color: colors.average },
    { grade: "C-", count: 1, color: colors.average },
    { grade: "D+", count: 0, color: colors.warning },
    { grade: "D", count: 1, color: colors.warning },
    { grade: "F", count: 7, color: colors.danger },
  ];

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

  const subjectInfo = {
    code: "EC5060",
    name: "Engineering Mathematics IV",
    enrolled: 60,
    passed: 53,
    failed: 7,
    lecturer: "Dr. S.M Jayalath",
    credits: 3,
    about: "This course covers advanced mathematical techniques required for communication systems and signal processing. It is a prerequisite for EC5060."
  };

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
              <label className="sw-filter-label">Course Code</label>
              <div className="sw-select-wrapper">
                <Search size={18} className="sw-select-icon" />
                <select
                  className="sw-select"
                  value={filters.courseCode}
                  onChange={(e) => setFilters({ ...filters, courseCode: e.target.value })}
                >
                  <option value="EC5060">EC5060 - Engineering Mathematics IV</option>
                  <option value="EC5070">EC5070 - Communication Systems</option>
                  <option value="EC5080">EC5080 - Digital Signal Processing</option>
                </select>
              </div>
            </div>

            <div className="sw-filter-item">
              <label className="sw-filter-label">Batch</label>
              <div className="sw-select-wrapper">
                <Filter size={18} className="sw-select-icon" />
                <select
                  className="sw-select"
                  value={filters.batch}
                  onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                >
                  <option value="2021">Batch 2021</option>
                  <option value="2020">Batch 2020</option>
                  <option value="2019">Batch 2019</option>
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

        {/* Main Content Grid */}
        <div className="sw-grid">
          {/* Chart Section */}
          <div className="sw-card sw-chart-card">
            <div className="sw-card__header">
              <h2 className="sw-card__title">Student Grade Distribution</h2>
              <div className="sw-card__badge">Academic Year 2024</div>
            </div>

            <div className="sw-chart-container">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={resultData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    {resultData.map((entry, index) => (
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
                    animationBegin={300}
                  >
                    {resultData.map((entry, index) => (
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
              <div className="sw-chart-label">Total Students</div>
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
                  <span className="sw-info-value">{subjectInfo.enrolled}</span>
                </div>
              </div>

              <div className="sw-info-item">
                <div className="sw-info-icon sw-info-icon--green">
                  <GraduationCap size={20} />
                </div>
                <div className="sw-info-content">
                  <span className="sw-info-label">Passed Students</span>
                  <span className="sw-info-value">{subjectInfo.passed}</span>
                </div>
              </div>

              <div className="sw-info-item">
                <div className="sw-info-icon sw-info-icon--red">
                  <FileText size={20} />
                </div>
                <div className="sw-info-content">
                  <span className="sw-info-label">Failed Students</span>
                  <span className="sw-info-value">{subjectInfo.failed}</span>
                </div>
              </div>

              <div className="sw-info-divider"></div>

              <div className="sw-info-item">
                <div className="sw-info-icon sw-info-icon--teal">
                  <User size={20} />
                </div>
                <div className="sw-info-content">
                  <span className="sw-info-label">Lecturer</span>
                  <span className="sw-info-value">{subjectInfo.lecturer}</span>
                </div>
              </div>

              <div className="sw-info-item">
                <div className="sw-info-icon sw-info-icon--purple">
                  <Clock size={20} />
                </div>
                <div className="sw-info-content">
                  <span className="sw-info-label">Credits</span>
                  <span className="sw-info-value">{subjectInfo.credits} Credits</span>
                </div>
              </div>

              <div className="sw-card sw-about-box">
                <h3 className="sw-about-title">About Subject</h3>
                <p className="sw-about-text">{subjectInfo.about}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default SubjectWiseResult;
