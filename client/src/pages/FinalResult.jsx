import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { getCourseCodes, getBatches, getSubjectByCodeAndBatch, getIncourseResults, saveFinalResult } from "../services/lecturerApi";
import "../styles/FinalResult.css";
import {
  Save,
  Send,
  Table,
  Filter,
  LayoutDashboard,
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  User,
  Edit2,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

function FinalResult() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [rows, setRows] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

  useEffect(() => {
    if (selectedCourse) fetchBatches(selectedCourse);
    else {
      setBatches([]);
      setSelectedBatch("");
    }
  }, [selectedCourse]);

  const fetchBatches = async (code) => {
    try {
      const res = await getBatches(code);
      setBatches(res.data);
      setSelectedBatch(""); // Reset batch when course changes
    } catch (err) {
      console.error("Failed to fetch batches", err);
    }
  };

  const handleFetchResults = async () => {
    if (!selectedCourse || !selectedBatch) return;
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const subRes = await getSubjectByCodeAndBatch(selectedCourse, selectedBatch);
      if (subRes.data.length > 0) {
        const sub = subRes.data[0];
        setSubjectId(sub._id);
        const res = await getIncourseResults(sub._id);
        setRows(res.data.results);
      } else {
        setRows([]);
        setStatus({ type: "error", message: "Subject not found." });
      }
    } catch (err) {
      console.error("Failed to fetch results", err);
      setStatus({ type: "error", message: "Failed to load results." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].endExamMark = value;
    
    // Auto-calculate final mark and grade locally for instant feedback
    const incourseTotal = newRows[index].incourseTotal || 0;
    const endMark = parseFloat(value) || 0;
    // Assuming endExamWeight is 60 as per common pattern, or fetch from subject if available
    // For simplicity, let's keep it locally updated after saving.
    setRows(newRows);
  };

  const handleSave = async () => {
    setLoading(true);
    let successCount = 0;
    try {
      for (const row of rows) {
        if (row.endExamMark !== null && row.endExamMark !== undefined) {
          await saveFinalResult({
            subject: subjectId,
            studentENo: row.studentENo,
            endExamMark: parseFloat(row.endExamMark)
          });
          successCount++;
        }
      }
      setStatus({ type: "success", message: `Successfully saved ${successCount} records.` });
      setIsEditMode(false);
      handleFetchResults(); // Refresh to get grades
    } catch (err) {
      console.error("Save failed", err);
      const errorMsg = err.response?.data?.message || "Some records failed to save.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LecturerLayout>
      <div className="fr-page">

        {/* Page Header */}
        <div className="fr-header">
          <div>
            <div className="fr-breadcrumb">
              <LayoutDashboard size={14} />
              <span>Lecturer Portal</span>
              <ChevronRight size={14} />
              <span className="fr-breadcrumb__current">Senate Submission</span>
            </div>
            <h2 className="fr-title">
              <GraduationCap size={32} className="fr-title__icon" />
              Final Result Compilation
            </h2>
          </div>

          <div className="fr-header__actions">
            <button 
              className={`fr-btn ${isEditMode ? 'fr-btn--outline' : 'fr-btn--primary'}`}
              onClick={() => setIsEditMode(!isEditMode)}
              disabled={loading || rows.length === 0}
            >
              {isEditMode ? <Lock size={18} /> : <Edit2 size={18} />}
              {isEditMode ? "Lock Editing" : "Edit Marks"}
            </button>
            {isEditMode && (
              <button className="fr-btn fr-btn--primary" onClick={handleSave} disabled={loading}>
                <Save size={18} />
                Save Changes
              </button>
            )}
          </div>
        </div>

        {status.message && (
          <div className={`fr-card fr-status-bar ${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Filters Card */}
        <div className="fr-card">
          <div className="fr-card__header">
            <div className="fr-card__icon-wrap">
              <Filter size={20} />
            </div>
            <h3 className="fr-card__title">Subject Context</h3>
          </div>

          <div className="fr-filters">
            <div className="fr-field">
              <label className="fr-label">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="fr-select"
                disabled={isEditMode || loading}
              >
                <option value="">Select Course</option>
                {courseCodes.map(item => (
                  <option key={item.courseCode} value={item.courseCode}>
                    {item.courseCode} - {item.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="fr-field">
              <label className="fr-label">
                <GraduationCap size={14} />
                Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="fr-select"
                disabled={!selectedCourse || isEditMode || loading}
              >
                <option value="">Select Batch</option>
                {batches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
              </select>
            </div>

            <div className="fr-field" style={{ justifyContent: 'flex-end' }}>
               <button className="fr-btn fr-btn--primary" onClick={handleFetchResults} disabled={loading || isEditMode}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Table size={18} />}
                  Load Students
               </button>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="fr-table-card">
          <div className="fr-table-scroll">
            <table className="fr-table">
              <thead>
                <tr className="fr-thead-row">
                  <th className="fr-th fr-th--left">E Number</th>
                  <th className="fr-th">Incourse Marks</th>
                  <th className="fr-th">End Exam Marks</th>
                  <th className="fr-th">Final Grade</th>
                </tr>
              </thead>
              <tbody className="fr-tbody">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="fr-td fr-td--center" style={{ padding: '4rem', opacity: 0.5 }}>
                      Select Course & Batch to load student results
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr key={index} className="fr-row">
                      <td className="fr-td">
                        <div className="fr-enumber-cell">
                          <div className="fr-enumber-icon">
                            <User size={16} />
                          </div>
                          <span className="fr-enumber-text">{row.studentENo}</span>
                        </div>
                      </td>
                      <td className="fr-td fr-td--center">
                         <span className="fr-incourse-text">{row.incourseTotal?.toFixed(2) || "0.00"}</span>
                      </td>
                      <td className="fr-td fr-td--center">
                        <input
                          type="number"
                          value={row.endExamMark ?? ""}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          disabled={!isEditMode || loading}
                          className={`fr-input ${isEditMode ? 'fr-input--cell' : 'fr-input--transparent'}`}
                          placeholder="-"
                        />
                      </td>
                      <td className="fr-td fr-td--center">
                        <span className={`fr-grade-badge ${row.grade === 'E' ? 'fail' : 'pass'}`}>
                          {row.grade || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        {rows.length > 0 && (
          <div className="fr-info-bar">
            <div className="fr-info-bar__icon-wrap">
              <Table size={24} />
            </div>
            <div>
              <p className="fr-info-bar__label">Quick Info</p>
              <p className="fr-info-bar__text">Currently managing {rows.length} student records for the selected batch.</p>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default FinalResult;
