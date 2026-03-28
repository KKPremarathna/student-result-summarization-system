import React, { useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { createSubject } from "../services/lecturerApi";
import "../styles/AddSubject.css";
import {
  BookOpen,
  PlusCircle,
  Hash,
  Type,
  Users,
  Percent,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  ChevronRight,
  ClipboardList,
  Target,
  FlaskConical,
  Activity,
  Calendar,
  Layers,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AddSubject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    batch: "",
    semester: "",
    assessments: {
      assignmentCount: 0,
      assignmentWeight: 0,
      quizCount: 0,
      quizWeight: 0,
      labCount: 0,
      labWeight: 0,
      midTermWeight: 0,
      finalExamWeight: 0
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: Number(value)
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    // Weight validation
    const totalWeight = 
      formData.assessments.assignmentWeight +
      formData.assessments.quizWeight +
      formData.assessments.labWeight +
      formData.assessments.midTermWeight +
      formData.assessments.finalExamWeight;

    if (totalWeight !== 100) {
      setStatus({ 
        type: "error", 
        message: `Total weight must be 100%. Current total: ${totalWeight}%` 
      });
      setLoading(false);
      return;
    }

    try {
      const res = await createSubject(formData);
      if (res.data.success) {
        setStatus({ type: "success", message: "Subject created successfully! Redirecting..." });
        setTimeout(() => navigate("/lecturer/home"), 2000);
      }
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to create subject" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LecturerLayout>
      <div className="as-page">
        {/* Header */}
        <header className="as-header">
          <div className="as-breadcrumb">
            <Link to="/lecturer/home">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="as-breadcrumb__current">Add Subject</span>
          </div>
          <h2 className="as-title">
            <PlusCircle size={32} className="as-title__icon" />
            Create New Module
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
              <h3 className="as-card__title">Basic Configuration</h3>
            </div>

            <div className="as-grid as-grid--2col">
              <div className="as-field as-field--full">
                <label className="as-label">
                  <Type size={16} /> Module Name
                </label>
                <input
                  name="courseName"
                  placeholder="e.g. Advanced Software Engineering"
                  value={formData.courseName}
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
                  placeholder="e.g. EC6060"
                  value={formData.courseCode}
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
                  placeholder="e.g. E19"
                  value={formData.batch}
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
                  placeholder="e.g. 6"
                  value={formData.semester}
                  onChange={handleChange}
                  className="as-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Assessment Structure Card */}
          <div className="as-card">
            <div className="as-card__header">
              <div className="as-card__icon-wrap">
                <ClipboardList size={24} />
              </div>
              <h3 className="as-card__title">Assessment Strategy</h3>
            </div>

            <div className="as-grid">
              {/* Assignments Row */}
              <div className="as-grid as-grid--2col">
                <div className="as-field">
                  <label className="as-label">
                    <Target size={16} /> Assignment Count
                  </label>
                  <input
                    type="number"
                    name="assessments.assignmentCount"
                    value={formData.assessments.assignmentCount}
                    onChange={handleChange}
                    className="as-input"
                    min="0"
                  />
                </div>
                <div className="as-field">
                  <label className="as-label">
                    <Percent size={16} /> Total Weight
                  </label>
                  <div className="as-percent-wrap">
                    <input
                      type="number"
                      name="assessments.assignmentWeight"
                      value={formData.assessments.assignmentWeight}
                      onChange={handleChange}
                      className="as-input as-input--percent"
                      min="0"
                    />
                    <span className="as-percent-symbol">%</span>
                  </div>
                </div>
              </div>

              <div className="as-section-divider"></div>

              {/* Quizzes and Labs Row */}
              <div className="as-grid as-grid--2col">
                 <div className="as-field">
                    <label className="as-label"><Activity size={16} /> Quiz Count</label>
                    <input type="number" name="assessments.quizCount" value={formData.assessments.quizCount} onChange={handleChange} className="as-input" min="0" />
                 </div>
                 <div className="as-field">
                    <label className="as-label"><Percent size={16} /> Quiz Weight</label>
                    <div className="as-percent-wrap">
                      <input type="number" name="assessments.quizWeight" value={formData.assessments.quizWeight} onChange={handleChange} className="as-input as-input--percent" min="0" />
                      <span className="as-percent-symbol">%</span>
                    </div>
                 </div>
              </div>

              <div className="as-grid as-grid--2col">
                 <div className="as-field">
                    <label className="as-label"><FlaskConical size={16} /> Lab Count</label>
                    <input type="number" name="assessments.labCount" value={formData.assessments.labCount} onChange={handleChange} className="as-input" min="0" />
                 </div>
                 <div className="as-field">
                    <label className="as-label"><Percent size={16} /> Lab Weight</label>
                    <div className="as-percent-wrap">
                      <input type="number" name="assessments.labWeight" value={formData.assessments.labWeight} onChange={handleChange} className="as-input as-input--percent" min="0" />
                      <span className="as-percent-symbol">%</span>
                    </div>
                 </div>
              </div>

              <div className="as-section-divider"></div>

              {/* Major Exams Row */}
              <div className="as-grid as-grid--2col">
                 <div className="as-field">
                    <label className="as-label"><Activity size={16} /> Mid-Term Weight</label>
                    <div className="as-percent-wrap">
                      <input type="number" name="assessments.midTermWeight" value={formData.assessments.midTermWeight} onChange={handleChange} className="as-input as-input--percent" min="0" />
                      <span className="as-percent-symbol">%</span>
                    </div>
                 </div>
                 <div className="as-field">
                    <label className="as-label"><Target size={16} /> Final Exam Weight</label>
                    <div className="as-percent-wrap">
                      <input type="number" name="assessments.finalExamWeight" value={formData.assessments.finalExamWeight} onChange={handleChange} className="as-input as-input--percent" min="0" />
                      <span className="as-percent-symbol">%</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="as-submit-row">
              <button type="submit" className="as-submit-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                Create Module Structure
              </button>
            </div>
          </div>
        </form>
      </div>
    </LecturerLayout>
  );
};

export default AddSubject;
