import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { 
  getCourseCodes, 
  getBatches, 
  getSubjectByCodeAndBatch, 
  getIncourseResults, 
  saveIncourseResult 
} from "../services/lecturerApi";
import "../styles/Addincourse.css";
import {
  Plus,
  Trash2,
  Save,
  ChevronRight,
  Database,
  Calendar,
  LayoutDashboard,
  Filter,
  UserPlus,
  Edit,
  FileUp,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Table as TableIcon
} from "lucide-react";
import { Link } from "react-router-dom";

function Addincourse() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryMode, setEntryMode] = useState("range"); // "range" or "bulk"
  const [rangeInput, setRangeInput] = useState({ start: "", end: "" });
  const [bulkInput, setBulkInput] = useState("");
  const [parsedStudents, setParsedStudents] = useState([]);
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
        if (res.data.results?.length > 0) {
          setIsEditing(true);
        } else {
          setIsEditing(false);
        }
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

  const handleMarkChange = (index, type, subIndex, value) => {
    const updatedResults = [...results];
    const val = value === "" ? "" : Number(value);
    
    if (type === "assignments") {
      updatedResults[index].assignments[subIndex] = val;
    } else if (type === "quizzes") {
      updatedResults[index].quizzes[subIndex] = val;
    } else if (type === "labs") {
      updatedResults[index].labs[subIndex] = val;
    } else {
      updatedResults[index][type] = val;
    }
    
    // Calculate total incourse mark on the fly
    const r = updatedResults[index];
    const assess = subjectInfo.assessments;
    
    let total = 0;
    
    const sum = (arr) => arr.reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
    const avg = (arr, count) => count > 0 ? sum(arr) / count : 0;
    
    total += avg(r.assignments || [], assess.assignmentCount) * (assess.assignmentWeight / 100);
    total += avg(r.quizzes || [], assess.quizCount) * (assess.quizWeight / 100);
    total += avg(r.labs || [], assess.labCount) * (assess.labWeight / 100);
    total += (Number(r.mid) || 0) * (assess.midTermWeight / 100);
    
    updatedResults[index].incourseTotal = total;
    setResults(updatedResults);
  };

  const handleParse = () => {
    if (entryMode === "range") {
      const start = parseInt(rangeInput.start);
      const end = parseInt(rangeInput.end);
      if (isNaN(start) || isNaN(end) || start > end) {
        alert("Invalid range");
        return;
      }
      const students = [];
      for (let i = start; i <= end; i++) {
        const eNo = `E/${new Date().getFullYear().toString().slice(-2)}/${String(i).padStart(3, '0')}`;
        students.push(eNo);
      }
      setParsedStudents(students);
    } else {
      const students = bulkInput.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
      setParsedStudents(students);
    }
  };

  const commitStudents = () => {
    const newResults = parsedStudents
      .filter(eNo => !results.some(r => r.studentENo === eNo))
      .map(eNo => ({
        studentENo: eNo,
        assignments: new Array(subjectInfo.assessments.assignmentCount).fill(0),
        quizzes: new Array(subjectInfo.assessments.quizCount).fill(0),
        labs: new Array(subjectInfo.assessments.labCount).fill(0),
        mid: 0,
        incourseTotal: 0
      }));
    
    setResults([...results, ...newResults]);
    setIsModalOpen(false);
    setParsedStudents([]);
    setRangeInput({ start: "", end: "" });
    setBulkInput("");
  };

  const removeRow = (index) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      if (isEditing) {
        await saveIncourseResult({ subjectId: subjectInfo._id, results });
        setStatus({ type: "success", message: "Incourse results updated successfully." });
      } else {
        await saveIncourseResult({
          subjectId: subjectInfo._id,
          results
        });
        setStatus({ type: "success", message: "Incourse results saved successfully." });
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Save failed", err);
      setStatus({ type: "error", message: "Failed to save results. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LecturerLayout>
      <div className="aic-page">
        {/* Header */}
        <header className="aic-header">
          <div>
            <div className="aic-breadcrumb">
              <Link to="/lecturer/home">Dashboard</Link>
              <ChevronRight size={14} />
              <span className="aic-breadcrumb__current">Manage Marks</span>
            </div>
            <h2 className="aic-title">
              <Edit size={32} className="aic-title__icon" />
              In-Course Assessment
            </h2>
          </div>

          <div className="aic-header-actions">
            <button 
              className={`aic-edit-toggle-btn ${isEditing ? 'active' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
              disabled={results.length === 0}
            >
              <Edit size={18} />
              {isEditing ? "Disable Editing" : "Enable Editing"}
            </button>
            <button 
              className="aic-add-btn"
              onClick={() => setIsModalOpen(true)}
              disabled={!subjectInfo}
            >
              <UserPlus size={18} />
              Add Students
            </button>
          </div>
        </header>

        {status.message && (
          <div className={`as-alert as-alert--${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Filters Card */}
        <div className="aic-card">
          <div className="aic-card__header">
            <div className="aic-card__icon-wrap">
              <Filter size={24} />
            </div>
            <h3 className="aic-card__title">Subject Selection</h3>
          </div>

          <div className="aic-filters">
            <div className="aic-field">
              <label className="aic-label">
                <Database size={16} /> Course Code
              </label>
              <select 
                className="aic-select"
                value={selectedCourse} 
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">Select Course</option>
                {courseCodes.map(c => (
                  <option key={c.courseCode} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>
                ))}
              </select>
            </div>

            <div className="aic-field">
              <label className="aic-label">
                <Calendar size={16} /> Batch
              </label>
              <select 
                className="aic-select"
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

            <div className="aic-field">
              <label className="aic-label">
                <Info size={16} /> Semester
              </label>
              <div className="aic-read-only-box">
                {subjectInfo ? `Semester ${subjectInfo.semester}` : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="aic-table-card">
          {results.length > 0 && subjectInfo ? (
            <div className="aic-table-container">
              <table className="aic-table">
                <thead>
                  <tr className="aic-thead-primary">
                    <th rowSpan="2" className="aic-th">E.No</th>
                    {subjectInfo.assessments.assignmentCount > 0 && (
                      <th colSpan={subjectInfo.assessments.assignmentCount} className="aic-th">Assignments</th>
                    )}
                    {subjectInfo.assessments.quizCount > 0 && (
                      <th colSpan={subjectInfo.assessments.quizCount} className="aic-th">Quizzes</th>
                    )}
                    {subjectInfo.assessments.labCount > 0 && (
                      <th colSpan={subjectInfo.assessments.labCount} className="aic-th">Labs</th>
                    )}
                    <th rowSpan="2" className="aic-th">Mid</th>
                    <th rowSpan="2" className="aic-th">Total</th>
                    <th rowSpan="2" className="aic-th">Action</th>
                  </tr>
                  <tr className="aic-thead-secondary">
                    {[...Array(subjectInfo.assessments.assignmentCount)].map((_, i) => <th key={i} className="aic-th-sm">A{i+1}</th>)}
                    {[...Array(subjectInfo.assessments.quizCount)].map((_, i) => <th key={i} className="aic-th-sm">Q{i+1}</th>)}
                    {[...Array(subjectInfo.assessments.labCount)].map((_, i) => <th key={i} className="aic-th-sm">L{i+1}</th>)}
                  </tr>
                </thead>
                <tbody className="aic-tbody">
                  {results.map((r, ri) => (
                    <tr key={ri}>
                      <td className="aic-td aic-td--enumber">{r.studentENo}</td>
                      {[...Array(subjectInfo.assessments.assignmentCount)].map((_, i) => (
                        <td key={i} className="aic-td">
                          <input 
                            type="number" 
                            className="aic-cell-input"
                            value={r.assignments?.[i] || 0}
                            onChange={(e) => handleMarkChange(ri, "assignments", i, e.target.value)}
                            disabled={!isEditing}
                          />
                        </td>
                      ))}
                      {[...Array(subjectInfo.assessments.quizCount)].map((_, i) => (
                        <td key={i} className="aic-td">
                          <input 
                            type="number" 
                            className="aic-cell-input"
                            value={r.quizzes?.[i] || 0}
                            onChange={(e) => handleMarkChange(ri, "quizzes", i, e.target.value)}
                            disabled={!isEditing}
                          />
                        </td>
                      ))}
                      {[...Array(subjectInfo.assessments.labCount)].map((_, i) => (
                        <td key={i} className="aic-td">
                          <input 
                            type="number" 
                            className="aic-cell-input"
                            value={r.labs?.[i] || 0}
                            onChange={(e) => handleMarkChange(ri, "labs", i, e.target.value)}
                            disabled={!isEditing}
                          />
                        </td>
                      ))}
                      <td className="aic-td">
                        <input 
                          type="number" 
                          className="aic-cell-input"
                          value={r.mid || 0}
                          onChange={(e) => handleMarkChange(ri, "mid", null, e.target.value)}
                          disabled={!isEditing}
                        />
                      </td>
                      <td className="aic-td aic-td--incourse">
                        {r.incourseTotal?.toFixed(1) || "0.0"}
                      </td>
                      <td className="aic-td">
                        <button 
                          className="aic-row-delete"
                          onClick={() => removeRow(ri)}
                          disabled={!isEditing}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vr-empty-state">
               <div className="vr-empty-icon-wrap">
                 <TableIcon size={80} />
               </div>
               <h3>Mark Entry Interface</h3>
               <p>
                 {loading 
                   ? "Preparing the grade sheet..." 
                   : "Please select a course and batch to populate the student list and entry columns."}
               </p>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {results.length > 0 && (
          <div className="aic-footer">
            <div className="aic-footer__info">
              <div className="aic-footer__icon-wrap">
                <TableIcon size={24} />
              </div>
              <div>
                <p className="aic-footer__label">Total Students</p>
                <p className="aic-footer__text">{results.length} Recorded</p>
              </div>
            </div>
            <button 
              className="aic-finalize-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? "Update Marks" : "Save All Marks"}
            </button>
          </div>
        )}

        {/* Add Students Modal */}
        {isModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal aic-entry-modal">
              <div className="st-modal-header">
                <h3 className="st-modal-title">
                  <UserPlus size={24} />
                  Add Students to Roll
                </h3>
                <button className="st-modal-close" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="st-modal-body">
                <div className="aic-entry-modes">
                  <button 
                    className={`aic-mode-tab ${entryMode === 'range' ? 'active' : ''}`}
                    onClick={() => setEntryMode("range")}
                  >
                    <ArrowRight size={18} /> Range
                  </button>
                  <button 
                    className={`aic-mode-tab ${entryMode === 'bulk' ? 'active' : ''}`}
                    onClick={() => setEntryMode("bulk")}
                  >
                    <FileUp size={18} /> Bulk List
                  </button>
                </div>

                {entryMode === "range" ? (
                  <div className="aic-range-input-group">
                    <input 
                      type="number" 
                      className="aic-input" 
                      placeholder="Start No (e.g. 1)"
                      value={rangeInput.start}
                      onChange={(e) => setRangeInput({...rangeInput, start: e.target.value})}
                    />
                    <span className="aic-range-sep">to</span>
                    <input 
                      type="number" 
                      className="aic-input" 
                      placeholder="End No (e.g. 150)"
                      value={rangeInput.end}
                      onChange={(e) => setRangeInput({...rangeInput, end: e.target.value})}
                    />
                    <button className="aic-add-btn-sm" onClick={handleParse}>Generate</button>
                  </div>
                ) : (
                  <div>
                    <textarea 
                      className="as-input" 
                      placeholder="Enter E-Numbers separated by commas or new lines..."
                      rows={5}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                    ></textarea>
                    <button className="aic-parse-btn" onClick={handleParse}>Parse Selection</button>
                  </div>
                )}

                {parsedStudents.length > 0 && (
                  <div className="aic-preview-wrap">
                    <p className="aic-preview-title">Student Preview ({parsedStudents.length})</p>
                    <div className="aic-preview-list">
                      {parsedStudents.map((eNo, i) => (
                        <div key={i} className="aic-preview-item">
                          {eNo}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="st-modal-footer">
                <button className="aic-modal-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button 
                  className="aic-modal-commit" 
                  onClick={commitStudents}
                  disabled={parsedStudents.length === 0}
                >
                  Confirm & Add to Table
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

// Helper Arrow icon
const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

export default Addincourse;