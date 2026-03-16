import { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { 
  getCourseCodes, 
  getBatches, 
  getSubjectByCodeAndBatch,
  getIncourseResultsBySubject,
  saveIncourseResult,
  deleteIncourseResult
} from "../services/lecturerApi.js";
import "../styles/Addincourse.css";
import {
  Save,
  Filter,
  Search,
  GraduationCap,
  LayoutDashboard,
  ChevronRight,
  ClipboardCheck,
  Edit3,
  UserPlus,
  Trash2,
  Users,
  User,
  X
} from "lucide-react";

function AddIncourse() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [eNumberSearch, setENumberSearch] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [structure, setStructure] = useState({
    assignments: 0,
    quizzes: 0,
    labs: 0
  });
  
  // New modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentInput, setStudentInput] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [tempList, setTempList] = useState([]);
  const [inputType, setInputType] = useState("bulk"); // "bulk", "individual", or "range"
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletedResultIds, setDeletedResultIds] = useState([]);

  // Fetch initial course codes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourseCodes();
        setCourseCodes(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch batches when course changes
  useEffect(() => {
    if (selectedCourse) {
      const fetchBatches = async () => {
        try {
          const res = await getBatches(selectedCourse);
          setBatches(res.data);
          setSelectedBatch("");
        } catch (err) {
          console.error("Error fetching batches:", err);
        }
      };
      fetchBatches();
    } else {
      setBatches([]);
      setSelectedBatch("");
    }
  }, [selectedCourse]);

  // Fetch results and structure when course/batch selected
  useEffect(() => {
    if (selectedCourse && selectedBatch) {
      fetchData();
    } else {
      setResults([]);
      setSubjectInfo(null);
      setStructure({ assignments: 0, quizzes: 0, labs: 0 });
    }
  }, [selectedCourse, selectedBatch]);

  const fetchData = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const subRes = await getSubjectByCodeAndBatch(selectedCourse, selectedBatch);
      if (subRes.data && subRes.data.length > 0) {
        const subject = subRes.data[0];
        setSubjectInfo(subject);
        setStructure({
          assignments: subject.assessments?.assignmentCount || 0,
          quizzes: subject.assessments?.quizCount || 0,
          labs: subject.assessments?.labCount || 0
        });

        const res = await getIncourseResultsBySubject(subject._id);
        
        // Ensure we have a row for every student index if needed, 
        // but typically the backend provides the list for that subject
        const fetchedResults = res.data.results || [];
        fetchedResults.sort((a, b) => a.studentENo.localeCompare(b.studentENo));
        setResults(fetchedResults);
        setDeletedResultIds([]); // Reset deletions on fresh load
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setMessage({ type: "error", text: "Failed to load subjects or students." });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentIndex, field, value, subIndex = null) => {
    const newResults = [...results];
    const val = value === "" ? "" : Number(value);
    
    if (field === "mid") {
      newResults[studentIndex][field] = val;
    } else if (subIndex !== null) {
      // For arrays: assignments, quizzes, labs
      if (!newResults[studentIndex][field]) {
          newResults[studentIndex][field] = [];
      }
      newResults[studentIndex][field][subIndex] = val;
    }
    setResults(newResults);
  };

  const handleSaveAll = async () => {
    if (!subjectInfo) return;
    setSaveLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      // 1. Delete rows marked for removal
      for (const id of deletedResultIds) {
        await deleteIncourseResult(id);
      }
      setDeletedResultIds([]);

      // 2. Save remaining rows
      let successCount = 0;
      for (const res of results) {
        // If student exists in results but has no marks yet, it's a new entry
        await saveIncourseResult({
          subject: subjectInfo._id,
          studentENo: res.studentENo,
          assignments: res.assignments || [],
          quizzes: res.quizzes || [],
          labs: res.labs || [],
          mid: res.mid === "" || res.mid === null ? null : res.mid
        });
        successCount++;
      }
      setMessage({ type: "success", text: `Successfully saved marks for ${successCount} students.` });
      setIsEditMode(false); // Auto-lock after save
      fetchData(); // Refresh to get recalculated totals
    } catch (err) {
      console.error("Save error:", err);
      const errorMsg = err.response?.data?.message || "Failed to save marks. Values must be between 0 and 100.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddStudentsToList = () => {
    if (!studentInput.trim()) return;

    // Split by newlines, commas, or spaces and normalize
    const rawList = studentInput.split(/[\n,\s]+/).map(s => s.trim().toUpperCase()).filter(s => s !== "");

    // Simple E-number validation (e.g., 2020/E/001)
    const validENumberFormat = /^\d{4}\/[A-Z]\/\d{3}$/;

    const newENumbers = rawList.filter(eno => {
      if (!validENumberFormat.test(eno)) {
        setMessage({ type: "error", text: `Invalid format: ${eno}. Use 20XX/E/XXX` });
        return false;
      }
      if (tempList.includes(eno) || results.some(r => r.studentENo === eno)) {
        return false; // Skip duplicates
      }
      return true;
    });

    const updatedTempList = [...tempList, ...newENumbers];
    updatedTempList.sort((a, b) => a.localeCompare(b));
    setTempList(updatedTempList);
    setStudentInput("");
    if (newENumbers.length > 0) setMessage({ type: "", text: "" });
  };

  const handleAddRangeStudents = () => {
    if (!rangeStart.trim() || !rangeEnd.trim()) return;

    const validENumberFormat = /^(\d{4}\/[A-Z]\/)(\d{3})$/;
    const startMatch = rangeStart.toUpperCase().match(validENumberFormat);
    const endMatch = rangeEnd.toUpperCase().match(validENumberFormat);

    if (!startMatch || !endMatch) {
      setMessage({ type: "error", text: "Invalid range format. Use 20XX/E/XXX" });
      return;
    }

    const prefix = startMatch[1];
    const endPrefix = endMatch[1];

    if (prefix !== endPrefix) {
      setMessage({ type: "error", text: "Range must have the same prefix (e.g., 2022/E/)" });
      return;
    }

    const startNum = parseInt(startMatch[2]);
    const endNum = parseInt(endMatch[2]);

    if (startNum > endNum) {
      setMessage({ type: "error", text: "Start number must be less than end number" });
      return;
    }

    const newENumbers = [];
    for (let i = startNum; i <= endNum; i++) {
      const eno = `${prefix}${String(i).padStart(3, '0')}`;
      if (!tempList.includes(eno) && !results.some(r => r.studentENo === eno)) {
        newENumbers.push(eno);
      }
    }

    const updatedTempList = [...tempList, ...newENumbers];
    updatedTempList.sort((a, b) => a.localeCompare(b));
    setTempList(updatedTempList);
    setRangeStart("");
    setRangeEnd("");
    if (newENumbers.length > 0) setMessage({ type: "", text: "" });
  };

  const removeFromTempList = (eno) => {
    setTempList(tempList.filter(t => t !== eno));
  };

  const commitStudents = () => {
    const newResults = tempList.map(eno => ({
      studentENo: eno,
      assignments: Array(structure.assignments).fill(""),
      quizzes: Array(structure.quizzes).fill(""),
      labs: Array(structure.labs).fill(""),
      mid: "",
      incourseTotal: 0
    }));

    const updatedResults = [...results, ...newResults];
    updatedResults.sort((a, b) => a.studentENo.localeCompare(b.studentENo));
    setResults(updatedResults);
    setTempList([]);
    setIsAddModalOpen(false);
    setMessage({ type: "success", text: `${newResults.length} students added to the list.` });
  };

  const deleteResultRow = (index) => {
    const rowToDelete = results[index];
    if (rowToDelete._id) {
      setDeletedResultIds(prev => [...prev, rowToDelete._id]);
    }
    const newResults = results.filter((_, i) => i !== index);
    setResults(newResults);
  };

  const filteredResults = eNumberSearch
    ? results.filter(r => r.studentENo.toLowerCase().includes(eNumberSearch.toLowerCase()))
    : results;

  return (
    <LecturerLayout>
      <div className="aic-page">

        {/* Page Header */}
        <div className="aic-header">
          <div>
            <div className="aic-breadcrumb">
              <LayoutDashboard size={14} />
              <span>Lecturer Portal</span>
              <ChevronRight size={14} />
              <span className="aic-breadcrumb__current">Incourse Entry</span>
            </div>
            <h2 className="aic-title">
              <Edit3 size={32} className="aic-title__icon" />
              Add Incourse Marks
            </h2>
          </div>

          <div className="aic-header-actions">
            <button
              className="aic-add-btn"
              onClick={() => setIsAddModalOpen(true)}
              disabled={!subjectInfo || !isEditMode}
            >
              <UserPlus size={20} />
              Add Students
            </button>
            <button 
              className={`aic-edit-toggle-btn ${isEditMode ? 'active' : ''}`} 
              onClick={() => {
                if (isEditMode) {
                  // If canceling, re-fetch to discard unsaved local changes
                  fetchData();
                }
                setIsEditMode(!isEditMode);
              }}
              disabled={!subjectInfo || saveLoading}
            >
              {isEditMode ? <X size={20} /> : <Edit3 size={20} />}
              {isEditMode ? "Cancel Edit" : "Edit Marks"}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`aic-alert aic-alert--${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Filters Card */}
        <div className="aic-card">
          <div className="aic-card__header">
            <div className="aic-card__icon-wrap">
              <Filter size={20} />
            </div>
            <h3 className="aic-card__title">Selection Criteria</h3>
          </div>

          <div className="aic-filters">
            <div className="aic-field">
              <label className="aic-label">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="aic-select"
                disabled={isEditMode}
              >
                <option value="">Select Course</option>
                {courseCodes.map(item => (
                  <option key={item.courseCode} value={item.courseCode}>
                    {item.courseCode} - {item.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="aic-field">
              <label className="aic-label">
                <GraduationCap size={14} />
                Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="aic-select"
                disabled={!selectedCourse || isEditMode}
              >
                <option value="">Select Batch</option>
                {batches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="aic-field">
              <label className="aic-label">
                <Search size={14} />
                Search E Number
              </label>
              <input
                type="text"
                placeholder="E/XX/XXX"
                className="aic-input"
                value={eNumberSearch}
                onChange={(e) => setENumberSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Entry Table Card */}
        <div className="aic-table-card">
          <div className="aic-table-scroll">
            {subjectInfo ? (
              <table className="aic-table">
                <thead>
                  <tr className="aic-thead-primary">
                  <th rowSpan="2" className="aic-th aic-th--border-r">E.No</th>
                    {structure.assignments > 0 && (
                      <th colSpan={structure.assignments} className="aic-th aic-th--border-r aic-th--border-b">
                        Assignments ({subjectInfo.assessments?.assignmentWeight || 0}%)
                      </th>
                    )}
                    {structure.quizzes > 0 && (
                      <th colSpan={structure.quizzes} className="aic-th aic-th--border-r aic-th--border-b">
                        Quizzes ({subjectInfo.assessments?.quizWeight || 0}%)
                      </th>
                    )}
                    {structure.labs > 0 && (
                      <th colSpan={structure.labs} className="aic-th aic-th--border-r aic-th--border-b">
                        Labs ({subjectInfo.assessments?.labWeight || 0}%)
                      </th>
                    )}
                    <th rowSpan="2" className="aic-th aic-th--border-r">
                      MID ({subjectInfo.assessments?.midWeight || 0}%)
                    </th>
                    <th rowSpan="2" className="aic-th aic-th--border-r">INCR. TOTAL</th>
                    <th rowSpan="2" className="aic-th">Actions</th>
                  </tr>
                  <tr className="aic-thead-secondary">
                    {structure.assignments > 0 && [...Array(structure.assignments)].map((_, i) => (
                      <th key={i} className="aic-th-sm aic-th--border-r">A{i + 1}</th>
                    ))}
                    {structure.quizzes > 0 && [...Array(structure.quizzes)].map((_, i) => (
                      <th key={i} className="aic-th-sm aic-th--border-r">Q{i + 1}</th>
                    ))}
                    {structure.labs > 0 && [...Array(structure.labs)].map((_, i) => (
                      <th key={i} className="aic-th-sm aic-th--border-r">L{i + 1}</th>
                    ))}
                  </tr>
                </thead>

                <tbody className="aic-tbody">
                  {results.length > 0 ? (
                    filteredResults.map((r, rowIndex) => (
                      <tr key={rowIndex} className="aic-row">
                        <td className="aic-td aic-td--enumber">{r.studentENo}</td>

                        {/* Assignments */}
                        {structure.assignments > 0 && [...Array(structure.assignments)].map((_, i) => (
                          <td key={`a-${i}`} className="aic-td aic-td--border-r">
                            <input
                              type="number"
                              value={r.assignments?.[i] ?? ""}
                              onChange={(e) => handleMarkChange(rowIndex, "assignments", e.target.value, i)}
                              placeholder="-"
                              className="aic-cell-input"
                              min="0"
                              max="100"
                              disabled={!isEditMode}
                            />
                          </td>
                        ))}

                        {/* Quizzes */}
                        {structure.quizzes > 0 && [...Array(structure.quizzes)].map((_, i) => (
                          <td key={`q-${i}`} className="aic-td aic-td--border-r">
                            <input
                              type="number"
                              value={r.quizzes?.[i] ?? ""}
                              onChange={(e) => handleMarkChange(rowIndex, "quizzes", e.target.value, i)}
                              placeholder="-"
                              className="aic-cell-input"
                              min="0"
                              max="100"
                              disabled={!isEditMode}
                            />
                          </td>
                        ))}

                        {/* Labs */}
                        {structure.labs > 0 && [...Array(structure.labs)].map((_, i) => (
                          <td key={`l-${i}`} className="aic-td aic-td--border-r">
                            <input
                              type="number"
                              value={r.labs?.[i] ?? ""}
                              onChange={(e) => handleMarkChange(rowIndex, "labs", e.target.value, i)}
                              placeholder="-"
                              className="aic-cell-input"
                              min="0"
                              max="100"
                              disabled={!isEditMode}
                            />
                          </td>
                        ))}

                        <td className="aic-td aic-td--border-r">
                          <input
                            type="number"
                            value={r.mid ?? ""}
                            onChange={(e) => handleMarkChange(rowIndex, "mid", e.target.value)}
                            placeholder="-"
                            className="aic-cell-input aic-cell-input--mid"
                            min="0"
                            max="100"
                            disabled={!isEditMode}
                          />
                        </td>

                        <td className="aic-td aic-td--incourse aic-td--border-r">
                          {r.incourseTotal?.toFixed(1) || "0.0"}
                        </td>
                        <td className="aic-td aic-td--actions">
                          <button
                            className="aic-row-delete"
                            onClick={() => deleteResultRow(rowIndex)}
                            title="Remove student from list"
                            disabled={!isEditMode}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={1 + structure.assignments + structure.quizzes + structure.labs + 3}
                        className="aic-empty-td"
                      >
                        {loading ? "Loading record data..." : "No student records found for this selection."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="aic-empty-state">
                Select course and batch to enter marks.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions - Only visible in Edit Mode */}
        {isEditMode && subjectInfo && results.length > 0 && (
          <div className="aic-footer animate-slide-up">
            <div className="aic-footer__info">
              <div className="aic-footer__icon-wrap">
                <ClipboardCheck className="aic-footer__icon" size={24} />
              </div>
              <div>
                <p className="aic-footer__label">Incourse Marks</p>
                <p className="aic-footer__text">Review and finalize the entered marks</p>
              </div>
            </div>
            <button
              className="aic-finalize-btn"
              onClick={handleSaveAll}
              disabled={saveLoading}
            >
              {saveLoading ? "Saving..." : "Finalize Marks"}
            </button>
          </div>
        )}

        {/* Add Student Modal */}
        {isAddModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal aic-entry-modal">
              <div className="st-modal-header">
                <h3 className="st-modal-title">
                  <UserPlus size={20} />
                  Add Students to {selectedCourse}
                </h3>
                <button className="st-modal-close" onClick={() => setIsAddModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="st-modal-body">
                <div className="aic-entry-modes">
                  <button 
                    className={`aic-mode-tab ${inputType === 'bulk' ? 'active' : ''}`}
                    onClick={() => setInputType('bulk')}
                  >
                    <Users size={16} />
                    Bulk Entry
                  </button>
                  <button 
                    className={`aic-mode-tab ${inputType === 'range' ? 'active' : ''}`}
                    onClick={() => setInputType('range')}
                  >
                    <ChevronRight size={16} />
                    Range
                  </button>
                  <button 
                    className={`aic-mode-tab ${inputType === 'individual' ? 'active' : ''}`}
                    onClick={() => setInputType('individual')}
                  >
                    <User size={16} />
                    Individual
                  </button>
                </div>

                <div className="aic-entry-input-wrap">
                  {inputType === 'bulk' ? (
                    <div className="st-modal-field">
                      <label className="st-modal__label">Enter E-Numbers (One per line or comma separated)</label>
                      <textarea 
                        className="st-modal__input aic-textarea"
                        placeholder="2020/E/001&#10;2020/E/002"
                        value={studentInput}
                        onChange={(e) => setStudentInput(e.target.value)}
                        rows={5}
                      />
                    </div>
                  ) : inputType === 'range' ? (
                    <div className="st-modal-field">
                      <label className="st-modal__label">Enter Range (e.g., 2020/E/001 to 2020/E/050)</label>
                      <div className="aic-range-input-group">
                        <input 
                          className="st-modal__input"
                          placeholder="From: 2020/E/001"
                          value={rangeStart}
                          onChange={(e) => setRangeStart(e.target.value)}
                        />
                        <span className="aic-range-sep">to</span>
                        <input 
                          className="st-modal__input"
                          placeholder="To: 2020/E/050"
                          value={rangeEnd}
                          onChange={(e) => setRangeEnd(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddRangeStudents()}
                        />
                        <button className="aic-add-btn-sm" onClick={handleAddRangeStudents}>
                          Gen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="st-modal-field">
                      <label className="st-modal__label">Student E-Number</label>
                      <div className="aic-single-add">
                        <input 
                          className="st-modal__input"
                          placeholder="2020/E/001"
                          value={studentInput}
                          onChange={(e) => setStudentInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddStudentsToList()}
                        />
                        <button className="aic-add-btn-sm" onClick={handleAddStudentsToList}>
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                  {inputType === 'bulk' && (
                    <button className="aic-parse-btn" onClick={handleAddStudentsToList}>
                      Parse & Add to List
                    </button>
                  )}
                </div>

                {/* Preview List */}
                <div className="aic-preview-wrap">
                  <h4 className="aic-preview-title">Preview List ({tempList.length})</h4>
                  <div className="aic-preview-list">
                    {tempList.length > 0 ? tempList.map((eno, i) => (
                      <div key={i} className="aic-preview-item">
                        <span>{eno}</span>
                        <button onClick={() => removeFromTempList(eno)}>
                          <X size={14} />
                        </button>
                      </div>
                    )) : (
                      <p className="aic-preview-empty">No students added to preview yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="st-modal-footer">
                <button className="aic-modal-cancel" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  className="aic-modal-commit" 
                  onClick={commitStudents}
                  disabled={tempList.length === 0}
                >
                  Confirm & Commit to Table
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </LecturerLayout>
  );
}

export default AddIncourse;