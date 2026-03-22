import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { getSubjectById, updateSubject } from "../services/lecturerApi.js";
import "../styles/AddSubject.css";
import "../styles/Toast.css";
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
  X
} from "lucide-react";

function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "" }), 3000);
  };
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
          percentMid: assess.midWeight !== undefined ? String(assess.midWeight) : "0",
          percentEndExam: assess.endExamWeight !== undefined ? String(assess.endExamWeight) : "0",
        });
      } catch (err) {
        console.error(err);
        showToast("Failed to load subject details.", "error");
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

    const totalWeight =
      Number(subjectDetails.percentAssignments || 0) +
      Number(subjectDetails.percentLabs || 0) +
      Number(subjectDetails.percentQuizzes || 0) +
      Number(subjectDetails.percentMid || 0) +
      Number(subjectDetails.percentEndExam || 0);

    if (totalWeight !== 100) {
      showToast("Total evaluation weights must exactly equal 100%", "error");
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
        midWeight: Number(subjectDetails.percentMid),
        endExamWeight: Number(subjectDetails.percentEndExam)
      }
    };

    try {
      await updateSubject(id, formattedData);
      showToast("Subject updated successfully!", "success");
      setTimeout(() => navigate('/lecturer/home'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update subject.";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <LecturerLayout>
        <div style={{ padding: "3rem", textAlign: "center", fontStyle: "italic", opacity: 0.7 }}>Loading subject details...</div>
      </LecturerLayout>
    );
  }

  return (
    <LecturerLayout>
      <div className="as-page">
        <div className="as-header">
          <div className="as-breadcrumb">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="as-breadcrumb__current">Course Management</span>
          </div>
          <h2 className="as-title">
            <Edit3 className="as-title__icon" size={32} />
            Edit Subject
          </h2>
        </div>

        {toast.visible && (
          <div className="toast-container">
            <div className={`toast ${toast.type}`}>
              <div className="toast-content">
                {toast.type === "success" ? <CheckCircle2 className="toast-icon" /> : <AlertCircle className="toast-icon" />}
                <span className="toast-message">{toast.message}</span>
              </div>
              <button 
                className="toast-close" 
                onClick={() => setToast({ visible: false, message: "", type: "" })}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="as-form">
          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <BookOpen size={24} />
              </div>
              <h3 className="as-card__title">Course Information</h3>
            </div>

            <div className="as-grid as-grid--2col">
              <div className="as-field">
                <label className="as-label">Course Code</label>
                <input
                  type="text"
                  name="courseCode"
                  value={subjectDetails.courseCode}
                  onChange={handleChange}
                  placeholder="e.g. EC9630"
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field">
                <label className="as-label">Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={subjectDetails.batch}
                  onChange={handleChange}
                  placeholder="e.g. 2022"
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field as-field--full">
                <label className="as-label">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={subjectDetails.courseName}
                  onChange={handleChange}
                  placeholder="e.g. Advanced Software Engineering"
                  className="as-input"
                  required
                />
              </div>

              <div className="as-field">
                <label className="as-label">Credits</label>
                <input
                  type="number"
                  name="credit"
                  value={subjectDetails.credit}
                  onChange={handleChange}
                  placeholder="3"
                  className="as-input"
                  required
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="as-field">
                <label className="as-label">Semester</label>
                <input
                  type="text"
                  name="semester"
                  value={subjectDetails.semester}
                  onChange={handleChange}
                  placeholder="e.g. Semester 1"
                  className="as-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <Settings2 size={24} />
              </div>
              <h3 className="as-card__title">Component Structure</h3>
            </div>

            <div className="as-grid as-grid--3col">
              <div className="as-field">
                <label className="as-label">Compulsory Assignments</label>
                <input
                  type="number"
                  name="assignments"
                  value={subjectDetails.assignments}
                  onChange={handleChange}
                  placeholder="No. of items"
                  className="as-input"
                  required
                  min="0"
                />
              </div>

              <div className="as-field">
                <label className="as-label">Compulsory Labs</label>
                <input
                  type="number"
                  name="labs"
                  value={subjectDetails.labs}
                  onChange={handleChange}
                  placeholder="No. of items"
                  className="as-input"
                  required
                  min="0"
                />
              </div>

              <div className="as-field">
                <label className="as-label">Compulsory Quizzes</label>
                <input
                  type="number"
                  name="quizzes"
                  value={subjectDetails.quizzes}
                  onChange={handleChange}
                  placeholder="No. of items"
                  className="as-input"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <Percent size={24} />
              </div>
              <h3 className="as-card__title">Evaluation Weights</h3>
            </div>

            <div className="as-grid as-grid--5col">
              {[
                { name: "percentAssignments", label: "Assignments" },
                { name: "percentLabs", label: "Labs" },
                { name: "percentQuizzes", label: "Quizzes" },
                { name: "percentMid", label: "Mid Exam" },
                { name: "percentEndExam", label: "End Exam" }
              ].map((field) => (
                <div key={field.name} className="as-field">
                  <label className="as-label as-label--small">{field.label}</label>
                  <div className="as-percent-wrap">
                    <input
                      type="number"
                      name={field.name}
                      value={subjectDetails[field.name]}
                      onChange={handleChange}
                      placeholder="0"
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
              <ClipboardList size={24} />
              {loading ? "Updating..." : "Update Subject"}
            </button>
          </div>
        </form>
      </div>
    </LecturerLayout>
  );
}

export default EditSubject;
