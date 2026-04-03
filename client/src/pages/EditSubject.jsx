import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { getSubjectById, updateSubject } from "../services/lecturerApi.js";
import "../styles/AddSubject.css";
import {
  Edit3,
  BookOpen,
  Settings2,
  Percent,
  LayoutDashboard,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  X,
  Hash,
  Type,
  Calendar,
  Layers,
  Target,
  FlaskConical,
  Activity,
  Loader2
} from "lucide-react";

function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: null, message: "" });

  const [subjectDetails, setSubjectDetails] = useState({
    courseCode: "",
    batch: "",
    courseName: "",
    credit: "",
    assignments: "0",
    labs: "0",
    quizzes: "0",
    percentAssignments: "0",
    percentLabs: "0",
    percentQuizzes: "0",
    percentMid: "0",
    percentEndExam: "0",
    semester: "",
  });

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await getSubjectById(id);
        const data = res.data;
        const assess = data.assessments || {};
        setSubjectDetails({
          courseCode: data.courseCode || "",
          batch: data.batch || "",
          courseName: data.courseName || "",
          credit: data.credit !== undefined ? String(data.credit) : "",
          semester: data.semester || "",
          assignments: assess.assignmentCount !== undefined ? String(assess.assignmentCount) : "0",
          labs: assess.labCount !== undefined ? String(assess.labCount) : "0",
          quizzes: assess.quizCount !== undefined ? String(assess.quizCount) : "0",
          percentAssignments: assess.assignmentWeight !== undefined ? String(assess.assignmentWeight) : "0",
          percentLabs: assess.labWeight !== undefined ? String(assess.labWeight) : "0",
          percentQuizzes: assess.quizWeight !== undefined ? String(assess.quizWeight) : "0",
          percentMid: assess.midTermWeight !== undefined ? String(assess.midTermWeight) : (assess.midWeight !== undefined ? String(assess.midWeight) : "0"),
          percentEndExam: assess.finalExamWeight !== undefined ? String(assess.finalExamWeight) : (assess.endExamWeight !== undefined ? String(assess.endExamWeight) : "0"),
        });
      } catch (err) {
        console.error(err);
        setStatus({ type: "error", message: "Failed to load subject details." });
      } finally {
        setFetching(false);
      }
    };
    fetchSubject();
  }, [id]);

  const handleChange = (e) => {
    setSubjectDetails({ ...subjectDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    const totalWeight =
      Number(subjectDetails.percentAssignments || 0) +
      Number(subjectDetails.percentLabs || 0) +
      Number(subjectDetails.percentQuizzes || 0) +
      Number(subjectDetails.percentMid || 0) +
      Number(subjectDetails.percentEndExam || 0);

    if (totalWeight !== 100) {
      setStatus({ type: "error", message: `Total weight must be 100%. Current total: ${totalWeight}%` });
      setLoading(false);
      return;
    }

    const formattedData = {
      courseCode: subjectDetails.courseCode.toUpperCase(),
      courseName: subjectDetails.courseName,
      batch: subjectDetails.batch,
      semester: subjectDetails.semester,
      credit: Number(subjectDetails.credit),
      assessments: {
        assignmentCount: Number(subjectDetails.assignments),
        labCount: Number(subjectDetails.labs),
        quizCount: Number(subjectDetails.quizzes),
        assignmentWeight: Number(subjectDetails.percentAssignments),
        labWeight: Number(subjectDetails.percentLabs),
        quizWeight: Number(subjectDetails.percentQuizzes),
        midTermWeight: Number(subjectDetails.percentMid),
        finalExamWeight: Number(subjectDetails.percentEndExam)
      }
    };

    try {
      await updateSubject(id, formattedData);
      setStatus({ type: "success", message: "Module configuration updated successfully!" });
      setTimeout(() => navigate('/lecturer/home'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update subject.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <LecturerLayout>
        <div className="as-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Loader2 className="animate-spin" size={48} color="#219EBC" />
        </div>
      </LecturerLayout>
    );
  }

  return (
    <LecturerLayout>
      <div className="as-page">
        {/* Header */}
        <header className="as-header">
          <div className="as-breadcrumb">
            <Link to="/lecturer/home">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="as-breadcrumb__current">Edit Module</span>
          </div>
          <h2 className="as-title">
            <Edit3 size={32} className="as-title__icon" />
            Update Module: {subjectDetails.courseCode}
          </h2>
        </header>

        {status.message && (
          <div className={`as-alert as-alert--${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Module Basics Card */}
          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <BookOpen size={24} />
              </div>
              <h3 className="as-card__title">Module Identity</h3>
            </div>

            <div className="as-grid as-grid--2col">
              <div className="as-field as-field--full">
                <label className="as-label">
                  <Type size={16} /> Module Name
                </label>
                <input
                  name="courseName"
                  value={subjectDetails.courseName}
                  onChange={handleChange}
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field">
                <label className="as-label">
                  <Hash size={16} /> Course Code
                </label>
                <input
                  name="courseCode"
                  value={subjectDetails.courseCode}
                  onChange={handleChange}
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field">
                <label className="as-label">
                  <Calendar size={16} /> Batch
                </label>
                <input
                  name="batch"
                  value={subjectDetails.batch}
                  onChange={handleChange}
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field">
                <label className="as-label">
                  <Layers size={16} /> Semester
                </label>
                <input
                  name="semester"
                  value={subjectDetails.semester}
                  onChange={handleChange}
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field">
                <label className="as-label">
                  <ClipboardList size={16} /> Credits
                </label>
                <input
                  type="number"
                  name="credit"
                  value={subjectDetails.credit}
                  onChange={handleChange}
                  className="as-input"
                  required
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Assessment Strategy Card */}
          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <Settings2 size={24} />
              </div>
              <h3 className="as-card__title">Evaluation Strategy</h3>
            </div>

            <div className="as-grid">
               <div className="as-grid as-grid--3col">
                  <div className="as-field">
                    <label className="as-label">Assignments</label>
                    <input type="number" name="assignments" value={subjectDetails.assignments} onChange={handleChange} className="as-input" required min="0" />
                  </div>
                  <div className="as-field">
                    <label className="as-label">Labs</label>
                    <input type="number" name="labs" value={subjectDetails.labs} onChange={handleChange} className="as-input" required min="0" />
                  </div>
                  <div className="as-field">
                    <label className="as-label">Quizzes</label>
                    <input type="number" name="quizzes" value={subjectDetails.quizzes} onChange={handleChange} className="as-input" required min="0" />
                  </div>
               </div>

               <div className="as-section-divider"></div>

               <div className="as-grid as-grid--5col">
                  {[
                    { name: "percentAssignments", label: "Assignment %", icon: <Target size={14} /> },
                    { name: "percentLabs", label: "Lab %", icon: <FlaskConical size={14} /> },
                    { name: "percentQuizzes", label: "Quiz %", icon: <Activity size={14} /> },
                    { name: "percentMid", label: "Mid %", icon: <Activity size={14} /> },
                    { name: "percentEndExam", label: "Final %", icon: <Target size={14} /> }
                  ].map((field) => (
                    <div key={field.name} className="as-field">
                      <label className="as-label" style={{ fontSize: '0.7rem' }}>{field.label}</label>
                      <div className="as-percent-wrap">
                        <input
                          type="number"
                          name={field.name}
                          value={subjectDetails[field.name]}
                          onChange={handleChange}
                          className="as-input as-input--percent"
                          required
                          min="0"
                          max="100"
                        />
                        <span className="as-percent-symbol">%</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="as-submit-row">
              <button
                type="submit"
                className="as-submit-btn"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                Update Configuration
              </button>
            </div>
          </div>
        </form>
      </div>
    </LecturerLayout>
  );
}

export default EditSubject;
