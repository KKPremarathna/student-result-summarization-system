import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { createSubject, getSubjectById, updateSubject } from "../services/lecturerApi.js";
import "../styles/AddSubject.css";
import {
  PlusCircle,
  BookOpen,
  Settings2,
  Percent,
  LayoutDashboard,
  ChevronRight,
  ClipboardList
} from "lucide-react";

function AddSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
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
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchSubject = async () => {
        try {
          const res = await getSubjectById(id);
          const s = res.data;
          setSubjectDetails({
            courseCode: s.courseCode,
            batch: s.batch,
            courseName: s.courseName,
            credit: s.credit.toString(),
            assignments: s.assessments?.assignmentCount?.toString() || "0",
            labs: s.assessments?.labCount?.toString() || "0",
            quizzes: s.assessments?.quizCount?.toString() || "0",
            percentAssignments: s.assessments?.assignmentWeight?.toString() || "0",
            percentLabs: s.assessments?.labWeight?.toString() || "0",
            percentQuizzes: s.assessments?.quizWeight?.toString() || "0",
            percentMid: s.assessments?.midWeight?.toString() || "0",
            percentEndExam: s.assessments?.endExamWeight?.toString() || "0",
          });
        } catch (err) {
          console.error("Error fetching subject:", err);
          setMessage({ type: "error", text: "Failed to load subject details." });
        }
      };
      fetchSubject();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setSubjectDetails({ ...subjectDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Format data for backend
    const formattedData = {
      courseCode: subjectDetails.courseCode.toUpperCase(),
      courseName: subjectDetails.courseName,
      batch: subjectDetails.batch,
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
      if (isEditMode) {
        await updateSubject(id, formattedData);
        setMessage({ type: "success", text: "Subject updated successfully!" });
        setTimeout(() => navigate("/lecturer/home"), 2000);
      } else {
        await createSubject(formattedData);
        setMessage({ type: "success", text: "Subject registered successfully!" });
        // Reset form
        setSubjectDetails({
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
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'register'} subject.`;
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LecturerLayout>
      <div className="as-page">

        {/* Page Header */}
        <div className="as-header">
          <div className="as-breadcrumb">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="as-breadcrumb__current">{isEditMode ? "Edit Subject" : "Course Management"}</span>
          </div>
          <h2 className="as-title">
            <PlusCircle className="as-title__icon" size={32} />
            {isEditMode ? "Edit Subject" : "Add New Subject"}
          </h2>
        </div>

        {message.text && (
          <div className={`as-alert as-alert--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="as-form">

          {/* Section 1: Core Details */}
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
            </div>
          </div>

          {/* Section 2: Component Structure */}
          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <Settings2 size={24} />
              </div>
              <h3 className="as-card__title">Component Structure</h3>
            </div>

            <div className="as-grid as-grid--3col">
              <div className="as-field">
                <label className="as-label">Assignments</label>
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
                <label className="as-label">Labs</label>
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
                <label className="as-label">Quizzes</label>
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

          {/* Section 3: Evaluation Percentages */}
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

          {/* Submit Button */}
          <div className="as-submit-row">
            <button
              type="submit"
              className="as-submit-btn"
              disabled={loading}
            >
              <ClipboardList size={24} />
              {loading ? (isEditMode ? "Updating..." : "Registering...") : (isEditMode ? "Update Subject" : "Register Subject")}
            </button>
          </div>
        </form>
      </div>
    </LecturerLayout>
  );
}

export default AddSubject;
