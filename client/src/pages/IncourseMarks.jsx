import { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/IncourseMarks.css";
import { getMyIncourseSubjects, getSubjectIncourseMarks, getStudentDetails } from "../services/studentApi";
import { extractRegNoFromEmail, formatRegNo } from "../utils/regUtils";
import { 
  BookOpen, 
  ChevronLeft,
  Search,
  Award,
  User,
  Info,
  Loader2,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

const IncourseMarks = () => {
  const [courseList, setCourseList] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [resultsData, setResultsData] = useState(null); // { subject, myENo, results }
  const [studentInfo, setStudentInfo] = useState({ name: "", eNumber: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch student for the banner
      const userRes = await getStudentDetails();
      const userData = userRes.data.data;
      
      const rawENo = userData.studentENo || extractRegNoFromEmail(userData.email);
      setStudentInfo({
        name: `${userData.firstName} ${userData.lastName}`,
        eNumber: formatRegNo(rawENo) || "N/A"
      });

      // 2. Fetch list of courses with incourse marks
      const coursesRes = await getMyIncourseSubjects();
      const results = coursesRes.data || [];
      
      const list = results.map(r => ({
        code: r.subject.courseCode,
        name: r.subject.courseName,
        batch: r.subject.batch
      }));

      setCourseList(list);

      if (list.length > 0) {
        const first = list[0].code;
        setSelectedCourseCode(first);
        fetchSubjectMarks(first);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
      setError("Failed to load your courses. Please try again later.");
      setLoading(false);
    }
  };

  const fetchSubjectMarks = async (courseCode) => {
    setLoading(true);
    setError("");
    try {
      const res = await getSubjectIncourseMarks(courseCode);
      setResultsData(res.data);
    } catch (err) {
      console.error("Failed to fetch subject marks", err);
      setError(err.response?.data?.message || "Failed to fetch marks for this course.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const code = e.target.value;
    setSelectedCourseCode(code);
    fetchSubjectMarks(code);
  };

  if (loading && !resultsData) {
    return (
      <StudentLayout>
        <div className="sh-loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Retrieving subject participation...</p>
        </div>
      </StudentLayout>
    );
  }

  const assessments = resultsData?.subject?.assessments || {};
  const allResults = resultsData?.results || [];
  const myENo = resultsData?.myENo || studentInfo.eNumber;

  return (
    <StudentLayout>
      <div className="im-page">
        {/* Back Link */}
        <div className="im-back">
          <Link to="/student/subject-wise" className="im-back-link">
            <ChevronLeft size={20} />
            <span>Back to Subject Analytics</span>
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
              <p className="im-header__sub">Continuous assessment performance of all participants</p>
            </div>
          </div>

          <div className="im-header__filters">
            <div className="im-filter-card">
              <div className="im-filter-item">
                <label>Select Course</label>
                <div className="im-select-wrap">
                  <Search size={18} className="im-select-icon" />
                  <select 
                    value={selectedCourseCode} 
                    onChange={handleCourseChange}
                    className="im-select"
                    disabled={courseList.length === 0}
                  >
                    {courseList.length > 0 ? (
                      courseList.map((c, idx) => (
                        <option key={idx} value={c.code}>
                          {c.code} - {c.name} ({c.batch})
                        </option>
                      ))
                    ) : (
                      <option>No courses found</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="sh-status-bar error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

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
              <span className="im-banner__label">Batch</span>
              <span className="im-banner__value">{resultsData?.subject?.batch || "N/A"}</span>
            </div>
          </div>
        </div>

        {resultsData ? (
          <div className="im-card">
            <div className="im-table-container">
              <table className="im-table">
                <thead>
                  <tr className="im-table__main-head">
                    <th rowSpan="2">Student E-No</th>
                    {assessments.assignmentCount > 0 && (
                      <th colSpan={assessments.assignmentCount} className="im-head-group im-head-group--blue">Assignments</th>
                    )}
                    {assessments.quizCount > 0 && (
                      <th colSpan={assessments.quizCount} className="im-head-group im-head-group--indigo">Quizzes</th>
                    )}
                    {assessments.labCount > 0 && (
                      <th colSpan={assessments.labCount} className="im-head-group im-head-group--teal">Labs</th>
                    )}
                    {(assessments.midWeight > 0) && (
                      <th rowSpan="2" className="im-head-single">Mid-Term</th>
                    )}
                    <th rowSpan="2" className="im-head-single">Total</th>
                  </tr>
                  <tr className="im-table__sub-head">
                    {/* Sub-headers for Assignments */}
                    {Array.from({ length: assessments.assignmentCount || 0 }).map((_, i) => (
                      <th key={`ah-${i}`}>A {String(i + 1).padStart(2, '0')}</th>
                    ))}
                    {/* Sub-headers for Quizzes */}
                    {Array.from({ length: assessments.quizCount || 0 }).map((_, i) => (
                      <th key={`qh-${i}`}>Q {String(i + 1).padStart(2, '0')}</th>
                    ))}
                    {/* Sub-headers for Labs */}
                    {Array.from({ length: assessments.labCount || 0 }).map((_, i) => (
                      <th key={`lh-${i}`}>L {i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((row, idx) => {
                    const isMe = row.studentENo === myENo;
                    return (
                      <tr key={idx} className={isMe ? "im-row-highlight" : ""}>
                        <td className="im-td-batch">{row.studentENo}</td>
                        {/* Data for Assignments */}
                        {Array.from({ length: assessments.assignmentCount || 0 }).map((_, i) => (
                          <td key={`ad-${i}`}>{row.assignments?.[i] ?? "-"}</td>
                        ))}
                        {/* Data for Quizzes */}
                        {Array.from({ length: assessments.quizCount || 0 }).map((_, i) => (
                          <td key={`qd-${i}`}>{row.quizzes?.[i] ?? "-"}</td>
                        ))}
                        {/* Data for Labs */}
                        {Array.from({ length: assessments.labCount || 0 }).map((_, i) => (
                          <td key={`ld-${i}`}>{row.labs?.[i] ?? "-"}</td>
                        ))}
                        {/* Mid-term */}
                        {assessments.midWeight > 0 && (
                          <td className="im-td-bold">{row.mid ?? "-"}</td>
                        )}
                        {/* Total */}
                        <td className="im-td-total">{row.incourseTotal ?? "0.0"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && courseList.length === 0 && (
            <div className="sh-empty-state">
               <AlertCircle size={48} className="sh-empty-icon" />
               <h3>No marks recorded yet</h3>
               <p>Once results are published, participants' marks will appear here.</p>
            </div>
          )
        )}

        {/* No footer here anymore - moved to dedicated page */}
      </div>
    </StudentLayout>
  );
};

export default IncourseMarks;
