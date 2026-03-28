import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { 
  getCourseCodes, 
  getBatches, 
  getSubjectByCodeAndBatch, 
  getIncourseResults, 
  saveFinalResult 
} from "../services/lecturerApi";
import "../styles/FinalResult.css";
import {
  FileText,
  Save,
  ChevronRight,
  Database,
  Calendar,
  LayoutDashboard,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  User,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

function FinalResult() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  useEffect(() => {
    fetchCourseCodes();
  }, []);

  const fetchCourseCodes = async () => {
    try {
      const res = await getCourseCodes();
      setCourseCodes(res.data);
    } catch (err) {
      console.error("Failed to fetch course codes", err);
    }
  };

  const handleCourseChange = async (code) => {
    setSelectedCourse(code);
    setSelectedBatch("");
    setBatches([]);
    setSubjectInfo(null);
    setResults([]);
    if (code) {
      try {
        const res = await getBatches(code);
        setBatches(res.data);
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    }
  };

  const fetchData = async () => {
    if (!selectedCourse || !selectedBatch) return;
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const subRes = await getSubjectByCodeAndBatch(selectedCourse, selectedBatch);
      if (subRes.data.length > 0) {
        const subject = subRes.data[0];
        setSubjectInfo(subject);
        const res = await getIncourseResults(subject._id);
        setResults(res.data.results || []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && selectedBatch) {
      fetchData();
    }
  }, [selectedCourse, selectedBatch]);

  const calculateGrade = (total) => {
    if (total >= 80) return "A";
    if (total >= 70) return "B";
    if (total >= 60) return "C";
    if (total >= 50) return "D";
    return "E";
  };

  const handleEndMarkChange = (index, value) => {
    const updatedResults = [...results];
    const mark = value === "" ? "" : Number(value);
    updatedResults[index].endExamMark = mark;
    
    // Calculate final mark
    // Incourse total is already calculated in the previous step (Addincourse)
    const incourse = updatedResults[index].incourseTotal || 0;
    const endExam = mark || 0;
    
    // Example weight: 40% Incourse, 60% Final
    const finalMark = (incourse) + (endExam * (subjectInfo.assessments.finalExamWeight / 100));
    updatedResults[index].finalMark = finalMark;
    updatedResults[index].grade = calculateGrade(finalMark);
    
    setResults(updatedResults);
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      await saveFinalResult({ subjectId: subjectInfo._id, results });
      setStatus({ type: "success", message: "Final grades finalized and saved successfully." });
    } catch (err) {
      console.error("Finalize failed", err);
      setStatus({ type: "error", message: "Failed to finalize grades. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const passCount = results.filter(r => r.grade && r.grade !== "E").length;
  const failCount = results.filter(r => r.grade === "E").length;

  return (
    <LecturerLayout>
      <div className="fr-page">
        {/* Header */}
        <header className="fr-header">
          <div>
            <div className="fr-breadcrumb">
              <Link to="/lecturer/home">Dashboard</Link>
              <ChevronRight size={14} />
              <span className="fr-breadcrumb__current">Finalize Grades</span>
            </div>
            <h2 className="fr-title">
              <GraduationCap size={32} className="fr-title__icon" />
              Final Result Entry
            </h2>
          </div>

          <button 
            className="fr-btn fr-btn--primary"
            onClick={handleSave}
            disabled={loading || results.length === 0}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Finalize & Publish
          </button>
        </header>

        {status.message && (
          <div className={`as-alert as-alert--${status.type}`} style={{ marginBottom: '2.5rem' }}>
            {status.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Filters Card */}
        <div className="fr-card">
          <div className="fr-card__header">
            <div className="fr-card__icon-wrap">
              <Filter size={24} />
            </div>
            <h3 className="fr-card__title">Module Context</h3>
          </div>

          <div className="fr-filters">
            <div className="fr-field">
              <label className="fr-label">
                <Database size={16} /> Course Code
              </label>
              <select 
                className="fr-select"
                value={selectedCourse} 
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">Select Course</option>
                {courseCodes.map(c => (
                  <option key={c.courseCode} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>
                ))}
              </select>
            </div>

            <div className="fr-field">
              <label className="fr-label">
                <Calendar size={16} /> Batch
              </label>
              <select 
                className="fr-select"
                value={selectedBatch} 
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={!selectedCourse}
              >
                <option value="">Select Batch</option>
                {batches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="fr-field">
              <label className="fr-label">
                <Info size={16} /> Assessment Split
              </label>
              <div className="fr-select" style={{ background: '#f1f5f9', cursor: 'default' }}>
                {subjectInfo ? `In-Course: ${100 - subjectInfo.assessments.finalExamWeight}% | Final: ${subjectInfo.assessments.finalExamWeight}%` : "Split N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="fr-table-card">
          {results.length > 0 ? (
            <div className="fr-table-container">
              <table className="fr-table">
                <thead>
                  <tr className="fr-thead-row">
                    <th className="fr-th fr-th--left">Student E-Number</th>
                    <th className="fr-th">In-Course Mark</th>
                    <th className="fr-th">End-Exam Mark</th>
                    <th className="fr-th">Total Final</th>
                    <th className="fr-th">Calculated Grade</th>
                  </tr>
                </thead>
                <tbody className="fr-tbody">
                  {results.map((r, ri) => (
                    <tr key={ri} className="fr-row">
                      <td className="fr-td">
                        <div className="fr-enumber-cell">
                          <div className="fr-enumber-icon">
                            <User size={18} />
                          </div>
                          <span className="fr-enumber-text">{r.studentENo}</span>
                        </div>
                      </td>
                      <td className="fr-td">
                        <span className="fr-incourse-text">{r.incourseTotal?.toFixed(1) || "0.0"}</span>
                      </td>
                      <td className="fr-td">
                        <input 
                          type="number" 
                          className="fr-input--cell"
                          value={r.endExamMark === 0 && r.grade === undefined ? "" : r.endExamMark}
                          onChange={(e) => handleEndMarkChange(ri, e.target.value)}
                          placeholder="0.0"
                        />
                      </td>
                      <td className="fr-td">
                         <span className="fr-incourse-text" style={{ color: '#219EBC' }}>
                           {r.finalMark?.toFixed(1) || "0.0"}
                         </span>
                      </td>
                      <td className="fr-td">
                        <span className={`fr-grade-badge ${r.grade === 'E' ? 'fail' : 'pass'}`}>
                          {r.grade || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vr-empty-state" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
               <FileText size={80} style={{ opacity: 0.1, marginBottom: '2rem' }} />
               <h3 style={{ color: '#64748b' }}>Awaiting Data Finalization</h3>
               <p style={{ color: '#94a3b8' }}>Select the subject context to load student in-course performances and enter project/exam marks.</p>
            </div>
          )}
        </div>

        {/* Info/Summary Bar */}
        {results.length > 0 && (
          <div className="fr-info-bar">
            <div className="fr-info-bar__item" style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div className="fr-info-bar__icon-wrap">
                <FileText size={24} />
              </div>
              <div>
                <p className="fr-info-bar__label">Summary Overview</p>
                <p className="fr-info-bar__text">
                  Processing results for {results.length} students in {selectedCourse}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <p className="fr-info-bar__label">Pass Ratio</p>
                <p className="fr-info-bar__text" style={{ color: '#16a34a' }}>
                  {passCount} Students
                </p>
              </div>
              <div>
                <p className="fr-info-bar__label">Failures</p>
                <p className="fr-info-bar__text" style={{ color: '#dc2626' }}>
                  {failCount} Students
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default FinalResult;
