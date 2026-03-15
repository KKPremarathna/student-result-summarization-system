import { useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
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
  const [subjectDetails, setSubjectDetails] = useState({
    courseCode: "",
    batch: "",
    courseName: "",
    credit: "",
    assignments: "",
    labs: "",
    quizzes: "",
    percentAssignments: "",
    percentLabs: "",
    percentQuizzes: "",
    percentMid: "",
    percentEndExam: "",
  });

  const handleChange = (e) => {
    setSubjectDetails({ ...subjectDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subject Details:", subjectDetails);
    // Here you can call backend API to save subject details
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
            <span className="as-breadcrumb__current">Course Management</span>
          </div>
          <h2 className="as-title">
            <PlusCircle className="as-title__icon" size={32} />
            Add New Subject
          </h2>
        </div>

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
            >
              <ClipboardList size={24} />
              Register Subject
            </button>
          </div>
        </form>
      </div>
    </LecturerLayout>
  );
}

export default AddSubject;