import { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/IncourseMarks.css";
import { 
  BookOpen, 
  ChevronLeft,
  Search,
  Award,
  User,
  Info,
  Loader2,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { getStudentDetails, getEnrolledSubjects, getIncourseMarks } from "../services/studentApi";

const IncourseMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [userData, setUserData] = useState(null);
  const [markData, setMarkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marksLoading, setMarksLoading] = useState(false);
  const [error, setError] = useState("");

  // Initial load: Profile and Enrolled Subjects
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [userRes, subjectsRes] = await Promise.all([
          getStudentDetails(),
          getEnrolledSubjects()
        ]);
        
        setUserData(userRes.data.data);
        const enrolled = subjectsRes.data.data || [];
        setSubjects(enrolled);
        
        if (enrolled.length > 0) {
          setSelectedCourse(enrolled[0].courseCode);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load initial data. Please try again.");
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch marks when selectedCourse changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchMarks = async () => {
      try {
        setMarksLoading(true);
        setError("");
        const res = await getIncourseMarks(selectedCourse);
        
        // Backend returns: { success: true, data: results }
        // results is an array of IncourseResult objects
        setMarkData(res.data.data || []);
      } catch (err) {
        setMarkData([]);
        if (err.response?.status !== 404) {
          setError("Failed to fetch marks for the selected course.");
        }
      } finally {
        setMarksLoading(false);
        setLoading(false);
      }
    };

    fetchMarks();
  }, [selectedCourse]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="st-loading">
          <Loader2 className="st-loader-icon" />
          <p>Loading assessment data...</p>
        </div>
      </StudentLayout>
    );
  }

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
                    disabled={marksLoading}
                  >
                    {subjects.length === 0 ? (
                      <option value="">No enrolled subjects</option>
                    ) : (
                      subjects.map(s => (
                        <option key={s._id} value={s.courseCode}>
                          {s.courseCode} - {s.courseName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="st-status-msg st-status-msg--error">
            <p>{error}</p>
          </div>
        )}

        {/* Student Info Banner */}
        <div className="im-banner">
          <div className="im-banner__item">
            <User size={20} className="im-banner__icon" />
            <div className="im-banner__text">
              <span className="im-banner__label">Student Name</span>
              <span className="im-banner__value">{userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</span>
            </div>
          </div>
          <div className="im-banner__divider"></div>
          <div className="im-banner__item">
            <Award size={20} className="im-banner__icon" />
            <div className="im-banner__text">
              <span className="im-banner__label">E Number</span>
              <span className="im-banner__value">
                {userData?.studentENo || userData?.email?.split('@')[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div className="im-banner__divider"></div>
          <div className="im-banner__item">
            <BookOpen size={20} className="im-banner__icon" />
            <div className="im-banner__text">
              <span className="im-banner__label">Selected Course</span>
              <span className="im-banner__value">{selectedCourse || "None"}</span>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="im-card">
          {marksLoading ? (
            <div className="im-table-loading">
              <Loader2 className="im-loader-spin" />
              <span>Updating marks...</span>
            </div>
          ) : markData.length === 0 ? (
            <div className="im-empty">
              <Info size={48} />
              <h3>No marks available</h3>
              <p>No continuous assessment records were found for this course.</p>
            </div>
          ) : (
            <div className="im-table-container">
              <table className="im-table">
                <thead>
                  <tr className="im-table__main-head">
                    <th rowSpan="2">Batch</th>
                    {/* Dynamic Headers */}
                    {(markData[0]?.subject?.assessments?.assignmentCount > 0) && (
                      <th colSpan={markData[0].subject.assessments.assignmentCount} className="im-head-group im-head-group--blue">
                        Assignments
                      </th>
                    )}
                    {(markData[0]?.subject?.assessments?.quizCount > 0) && (
                      <th colSpan={markData[0].subject.assessments.quizCount} className="im-head-group im-head-group--indigo">
                        Quizzes
                      </th>
                    )}
                    {(markData[0]?.subject?.assessments?.labCount > 0) && (
                      <th colSpan={markData[0].subject.assessments.labCount} className="im-head-group im-head-group--teal">
                        Labs
                      </th>
                    )}
                    <th rowSpan="2" className="im-head-single">Mid</th>
                    <th rowSpan="2" className="im-head-single">Incourse</th>
                  </tr>
                  <tr className="im-table__sub-head">
                    {/* Dynamic Sub-headers */}
                    {Array.from({ length: markData[0]?.subject?.assessments?.assignmentCount || 0 }).map((_, i) => (
                      <th key={`a-${i}`}>A{i + 1 < 10 ? `0${i + 1}` : i + 1}</th>
                    ))}
                    {Array.from({ length: markData[0]?.subject?.assessments?.quizCount || 0 }).map((_, i) => (
                      <th key={`q-${i}`}>Q{i + 1 < 10 ? `0${i + 1}` : i + 1}</th>
                    ))}
                    {Array.from({ length: markData[0]?.subject?.assessments?.labCount || 0 }).map((_, i) => (
                      <th key={`l-${i}`}>L{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {markData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="im-td-batch">{row.subject?.batch || "N/A"}</td>
                      {/* Dynamic Cells */}
                      {Array.from({ length: markData[0]?.subject?.assessments?.assignmentCount || 0 }).map((_, i) => (
                        <td key={`a-score-${i}`}>{row.assignments?.[i] ?? "-"}</td>
                      ))}
                      {Array.from({ length: markData[0]?.subject?.assessments?.quizCount || 0 }).map((_, i) => (
                        <td key={`q-score-${i}`}>{row.quizzes?.[i] ?? "-"}</td>
                      ))}
                      {Array.from({ length: markData[0]?.subject?.assessments?.labCount || 0 }).map((_, i) => (
                        <td key={`l-score-${i}`}>{row.labs?.[i] ?? "-"}</td>
                      ))}
                      <td className="im-td-bold">{row.mid ?? "-"}</td>
                      <td className="im-td-total">{row.incourseTotal ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="im-footer">
          <div className="im-hint">
            <Info size={16} />
            <span>If you find any discrepancy in your marks, please submit a complaint.</span>
          </div>
          <button 
            className="im-complaint-btn"
            onClick={() => window.location.href = "/student/home"} // Redirect or open modal if implemented
          >
            <MessageSquare size={18} />
            Submit Complaint
          </button>
        </div>
      </div>
    </StudentLayout>
  );
};

export default IncourseMarks;
