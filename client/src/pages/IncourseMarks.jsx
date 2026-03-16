import { useState } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/IncourseMarks.css";
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  ChevronLeft,
  Search,
  Award,
  User,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

const IncourseMarks = () => {
  const [selectedCourse, setSelectedCourse] = useState("EC5080");

  const studentInfo = {
    name: "Karunarathna K.P.S",
    eNumber: "2021/E/162",
  };

  const courseInfo = {
    code: "EC5080",
    name: "Software Construction"
  };

  const markData = [
    {
      batch: "E 21",
      assignments: { a01: "15/20", a02: "18/20" },
      quizzes: { q01: "08/10", q02: "09/10" },
      labs: { l1: "10/10", l2: "09/10", l3: "10/10", l4: "08/10" },
      mid: "25/30",
      incourse: "35/40",
      results: "B+"
    },
    {
      batch: "E 22",
      assignments: { a01: "12/20", a02: "14/20" },
      quizzes: { q01: "06/10", q02: "07/10" },
      labs: { l1: "08/10", l2: "08/10", l3: "07/10", l4: "09/10" },
      mid: "20/30",
      incourse: "28/40",
      results: "C"
    }
  ];

  return (
    <StudentLayout>
      <div className="im-page">
        {/* Back Link */}
        <div className="im-back">
          <Link to="/student/student-wise" className="im-back-link">
            <ChevronLeft size={20} />
            <span>Back to Result Summary</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="im-header">
          <div className="im-header__content">
            <div className="im-header__icon-wrap">
              <BookOpen size={40} className="im-header__icon" />
            </div>
            <div className="im-header__text">
              <h1 className="im-header__title">Incourse Marks Breakdown</h1>
              <p className="im-header__sub">Detailed continuous assessment performance</p>
            </div>
          </div>

          <div className="im-header__filters">
            <div className="im-filter-card">
              <div className="im-filter-item">
                <label>Select Course</label>
                <div className="im-select-wrap">
                  <Search size={18} className="im-select-icon" />
                  <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="im-select"
                  >
                    <option value="EC5080">EC5080 - Software Construction</option>
                    <option value="EC9630">EC9630 - Machine Learning</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Info Banner */}
        <div className="im-banner">
          <div className="im-banner__item">
            <User size={20} className="im-banner__icon" />
            <div className="im-banner__text">
              <span className="im-banner__label">Student Name</span>
              <span className="im-banner__value">{studentInfo.name}</span>
            </div>
          </div>
          <div className="im-banner__divider"></div>
          <div className="im-banner__item">
            <Award size={20} className="im-banner__icon" />
            <div className="im-banner__text">
              <span className="im-banner__label">E Number</span>
              <span className="im-banner__value">{studentInfo.eNumber}</span>
            </div>
          </div>
          <div className="im-banner__divider"></div>
          <div className="im-banner__item">
            <BookOpen size={20} className="im-banner__icon" />
            <div className="im-banner__text">
              <span className="im-banner__label">Selected Course</span>
              <span className="im-banner__value">{selectedCourse}</span>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="im-card">
          <div className="im-table-container">
            <table className="im-table">
              <thead>
                <tr className="im-table__main-head">
                  <th rowSpan="2">Batch</th>
                  <th colSpan="2" className="im-head-group im-head-group--blue">Assignment</th>
                  <th colSpan="2" className="im-head-group im-head-group--indigo">Quiz</th>
                  <th colSpan="4" className="im-head-group im-head-group--teal">Lab</th>
                  <th rowSpan="2" className="im-head-single">Mid</th>
                  <th rowSpan="2" className="im-head-single">Incourse</th>
                </tr>
                <tr className="im-table__sub-head">
                  <th>A 01</th>
                  <th>A 02</th>
                  <th>Q 01</th>
                  <th>Q 02</th>
                  <th>L1</th>
                  <th>L2</th>
                  <th>L3</th>
                  <th>L4</th>
                </tr>
              </thead>
              <tbody>
                {markData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="im-td-batch">{row.batch}</td>
                    <td>{row.assignments.a01}</td>
                    <td>{row.assignments.a02}</td>
                    <td>{row.quizzes.q01}</td>
                    <td>{row.quizzes.q02}</td>
                    <td>{row.labs.l1}</td>
                    <td>{row.labs.l2}</td>
                    <td>{row.labs.l3}</td>
                    <td>{row.labs.l4}</td>
                    <td className="im-td-bold">{row.mid}</td>
                    <td className="im-td-total">{row.incourse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="im-footer">
          <div className="im-hint">
            <Info size={16} />
            <span>If you find any discrepancy in your marks, please submit a complaint.</span>
          </div>
          <button className="im-complaint-btn">
            <MessageSquare size={18} />
            Submit Complaint
          </button>
        </div>
      </div>
    </StudentLayout>
  );
};

export default IncourseMarks;
