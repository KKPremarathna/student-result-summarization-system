import React, { useState } from "react";
import { normalizeBatch } from "../utils/batchUtils";
import "../styles/AdminResult.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/admin";
const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "E", "I"];

// ── Reg-num helper (client-side mirror) ────────────────────────────────────
const REG_PATTERN = /^20\d{2}\/E\/\d{3}$/i;
const isValidReg = (r) => REG_PATTERN.test(r.trim());

function parseRegRange(start, end) {
  const s = start.trim().toUpperCase();
  const e = end.trim().toUpperCase();
  if (!isValidReg(s) || !isValidReg(e)) return { error: "Invalid format. Use 20XX/E/xxx" };
  const [sy, , sn] = s.split("/");
  const [ey, , en] = e.split("/");
  if (sy !== ey) return { error: "Start and end must be from the same year" };
  const from = parseInt(sn, 10);
  const to = parseInt(en, 10);
  if (from > to) return { error: "Start must be ≤ end" };
  const nums = [];
  const pad = sn.length;
  for (let i = from; i <= to; i++) {
    nums.push(`${sy}/E/${String(i).padStart(pad, "0")}`);
  }
  return { nums };
}

// ── Add Student Modal ─────────────────────────────────────────────────────
function AddStudentModal({ courseCode, onCommit, onCancel, existingRegs }) {
  const [tab, setTab] = useState("bulk");
  const [bulkText, setBulkText] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [individual, setIndividual] = useState("");
  const [preview, setPreview] = useState([]);
  const [modalError, setModalError] = useState("");

  const parseAndPreview = () => {
    setModalError("");
    let nums = [];

    if (tab === "bulk") {
      nums = bulkText
        .split(/[\n,]+/)
        .map((r) => r.trim().toUpperCase())
        .filter(Boolean);
    } else if (tab === "range") {
      const result = parseRegRange(rangeStart, rangeEnd);
      if (result.error) { setModalError(result.error); return; }
      nums = result.nums;
    } else {
      const r = individual.trim().toUpperCase();
      if (!r) { setModalError("Enter a registration number."); return; }
      nums = [r];
    }

    const invalid = nums.filter((n) => !isValidReg(n));
    if (invalid.length) {
      setModalError(`Invalid format: ${invalid.slice(0, 3).join(", ")}${invalid.length > 3 ? "…" : ""}. Use 20XX/E/xxx`);
      return;
    }

    const filtered = nums.filter((n) => !existingRegs.includes(n));
    const duplicates = nums.length - filtered.length;
    if (duplicates > 0) setModalError(`${duplicates} already in table — skipped.`);
    setPreview(filtered);
  };

  const handleCommit = () => {
    if (preview.length === 0) { setModalError("Nothing to commit."); return; }
    onCommit(preview);
  };

  return (
    <div className="ar-modal-backdrop">
      <div className="ar-modal">
        {/* Modal header */}
        <div className="ar-modal-header">
          <div className="ar-modal-title">
            <span className="ar-modal-title-icon"></span>
            Add Students {courseCode ? `to ${courseCode.toUpperCase()}` : ""}
          </div>
          <button className="ar-modal-close" onClick={onCancel}>✕</button>
        </div>

        {/* Tabs */}
        <div className="ar-tabs">
          {[["bulk", "Bulk Entry"], ["range", "Range"], ["individual", "Individual"]].map(([key, label]) => (
            <button
              key={key}
              className={`ar-tab ${tab === key ? "ar-tab--active" : ""}`}
              onClick={() => { setTab(key); setPreview([]); setModalError(""); }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="ar-modal-body">
          {tab === "bulk" && (
            <div className="ar-modal-field">
              <label className="ar-modal-label">ENTER E-NUMBERS (ONE PER LINE OR COMMA SEPARATED)</label>
              <textarea
                className="ar-modal-textarea"
                rows={5}
                placeholder={"2020/E/001\n2020/E/002"}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
            </div>
          )}
          {tab === "range" && (
            <div className="ar-modal-range">
              <div className="ar-modal-field">
                <label className="ar-modal-label">START REG NUMBER</label>
                <input className="ar-modal-input" placeholder="2021/E/001" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
              </div>
              <div className="ar-modal-field">
                <label className="ar-modal-label">END REG NUMBER</label>
                <input className="ar-modal-input" placeholder="2021/E/050" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
              </div>
            </div>
          )}
          {tab === "individual" && (
            <div className="ar-modal-field">
              <label className="ar-modal-label">REGISTRATION NUMBER</label>
              <input className="ar-modal-input" placeholder="2021/E/042" value={individual} onChange={(e) => setIndividual(e.target.value)} />
            </div>
          )}

          {modalError && <div className="ar-modal-alert">{modalError}</div>}

          <button className="ar-parse-btn" onClick={parseAndPreview}>
            Parse &amp; Add to List
          </button>

          {/* Preview */}
          <div className="ar-preview-box">
            <div className="ar-preview-title">PREVIEW LIST ({preview.length})</div>
            {preview.length === 0 ? (
              <p className="ar-preview-empty">No students added to preview yet.</p>
            ) : (
              <div className="ar-preview-chips">
                {preview.map((r) => (
                  <span key={r} className="ar-chip">
                    {r}
                    <button
                      className="ar-chip-remove"
                      onClick={() => setPreview((p) => p.filter((x) => x !== r))}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="ar-modal-footer">
          <button className="ar-cancel-btn" onClick={onCancel}>Cancel</button>
          <button
            className={`ar-commit-btn ${preview.length === 0 ? "ar-commit-btn--disabled" : ""}`}
            onClick={handleCommit}
            disabled={preview.length === 0}
          >
            Confirm &amp; Commit to Table
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Results Page ─────────────────────────────────────────────────────
function Results() {
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [lecturerEmail, setLecturerEmail] = useState("");

  // Table rows: { _id (if from DB), regNum, grade, isNew, editing }
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const token = localStorage.getItem("token");
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  };

  // Commit students from modal → add rows
  const handleCommitStudents = (regNums) => {
    const newRows = regNums.map((r) => ({ _id: null, regNum: r, grade: "", isNew: true, editing: false }));
    setRows((prev) => [...prev, ...newRows]);
    setShowModal(false);
  };

  const handleGradeChange = (idx, val) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], grade: val };
      return updated;
    });
  };

  const handleDeleteRow = async (idx) => {
    const row = rows[idx];
    if (row._id) {
      // Saved in DB — delete via API
      if (!window.confirm(`Delete result for ${row.regNum}?`)) return;
      try {
        const res = await fetch(`${API_BASE}/delete-result/${row._id}`, {
          method: "DELETE", headers: authHeaders,
        });
        const data = await res.json();
        if (!res.ok) { showToast(data.message || "Delete failed", "error"); return; }
        showToast("Result deleted.");
      } catch { showToast("Network error.", "error"); return; }
    }
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateRow = async (idx) => {
    const row = rows[idx];
    if (!row._id) { showToast("Save all results first before updating individually.", "error"); return; }
    if (!row.grade) { showToast("Enter a grade before updating.", "error"); return; }
    try {
      const res = await fetch(`${API_BASE}/update-result/${row._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ grade: row.grade }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Grade updated for ${row.regNum}`);
        setRows((prev) => prev.map((r, i) => i === idx ? { ...r, isNew: false } : r));
      } else {
        showToast(data.message || "Update failed.", "error");
      }
    } catch { showToast("Network error.", "error"); }
  };

  const handleFinalize = async () => {
    if (!courseCode || !semester || !batch || !lecturerEmail) {
      showToast("Fill in all header fields before finalizing.", "error"); return;
    }
    if (rows.length === 0) {
      showToast("Add at least one student result before finalizing.", "error"); return;
    }
    const incomplete = rows.filter((r) => !r.grade);
    if (incomplete.length > 0) {
      showToast(`${incomplete.length} row(s) missing a grade.`, "error"); return;
    }

    setSaving(true);
    try {
      const normalizedBatch = normalizeBatch(batch);
      const results = rows.map((r) => ({ regNum: r.regNum, grade: r.grade }));
      const res = await fetch(`${API_BASE}/add-results`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ courseCode, semester, batch: normalizedBatch, lecturerEmail, results }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Results saved successfully!");
        // Reload to get IDs
        await loadExisting();
      } else {
        showToast(data.message || "Save failed.", "error");
      }
    } catch { showToast("Network error.", "error"); }
    finally { setSaving(false); }
  };

  const loadExisting = async () => {
    if (!courseCode || !semester || !batch) return;
    try {
      const normalizedBatch = normalizeBatch(batch);
      const params = `?courseCode=${encodeURIComponent(courseCode)}&batch=${encodeURIComponent(normalizedBatch)}&semester=${encodeURIComponent(semester)}`;
      const res = await fetch(`${API_BASE}/get-results${params}`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) {
        setRows(data.data.map((r) => ({
          _id: r._id,
          regNum: r.studentRegNum,
          grade: r.grade,
          isNew: false,
          editing: false,
        })));
        if (data.data.length > 0) setLecturerEmail(data.data[0].lecturerEmail || lecturerEmail);
        showToast(`Loaded ${data.data.length} existing results.`);
      }
    } catch { showToast("Failed to load existing results.", "error"); }
  };

  const existingRegs = rows.map((r) => r.regNum.toUpperCase());

  return (
    <div className="results-page">
      <Navbar />

      {toast.visible && (
        <div className={`ar-toast ar-toast--${toast.type}`}>{toast.message}</div>
      )}

      {showModal && (
        <AddStudentModal
          courseCode={courseCode}
          onCommit={handleCommitStudents}
          onCancel={() => setShowModal(false)}
          existingRegs={existingRegs}
        />
      )}

      <div className="results-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li><Link to="/adminhome"><span className="sidebar-icon"></span>Admin Home</Link></li>
            <li><Link to="/adduser"><span className="sidebar-icon"></span>Add User</Link></li>
            <li><Link to="/admincomplaint"><span className="sidebar-icon"></span>Complaint</Link></li>
            <li className="active"><Link to="/adminresults"><span className="sidebar-icon"></span>Results</Link></li>
            <li><Link to="/adminprofile"><span className="sidebar-icon"></span>Profile</Link></li>
          </ul>
        </aside>

        <main className="results-main">
          <div className="results-main-content">

            {/* Page title */}
            <div className="ar-page-header">
              <div>
                <h1 className="ar-page-title">Final Result Entry</h1>
                <p className="ar-page-sub">Enter course details and add student grades</p>
              </div>
              <button className="ar-load-btn" onClick={loadExisting} title="Load existing results from DB">
                Load Existing
              </button>
            </div>

            {/* Top form */}
            <div className="ar-form-card">
              <div className="ar-form-grid">
                <div className="ar-field">
                  <label className="ar-label">Course Code</label>
                  <input className="ar-input" placeholder="e.g. CS3042" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Batch</label>
                  <input className="ar-input" placeholder="e.g. E21/22" value={batch} onChange={(e) => setBatch(e.target.value)} />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Semester</label>
                  <input className="ar-input" placeholder="e.g. 1 or 2" value={semester} onChange={(e) => setSemester(e.target.value)} />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Lecturer Email</label>
                  <input className="ar-input" type="email" placeholder="lecturer@eng.jfn.ac.lk" value={lecturerEmail} onChange={(e) => setLecturerEmail(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Table header with Add Student button */}
            <div className="ar-table-header">
              <div className="ar-table-header-left">
                <h2 className="ar-table-title">Grade Sheet</h2>
                <span className="ar-row-count">{rows.length} student{rows.length !== 1 ? "s" : ""}</span>
              </div>
              <button className="ar-add-student-btn" onClick={() => setShowModal(true)}>
                Add Students
              </button>
            </div>

            {/* Grade table */}
            <div className="ar-table-wrapper">
              {rows.length === 0 ? (
                <div className="ar-empty-table">
                  <span className="ar-empty-icon"></span>
                  <p>No students added yet.<br />Click <strong>Add Students</strong> to begin.</p>
                </div>
              ) : (
                <table className="ar-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Registration No.</th>
                      <th>Final Grade</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={`${row.regNum}-${idx}`} className={row.isNew ? "ar-row-new" : ""}>
                        <td className="ar-td-num">{idx + 1}</td>
                        <td className="ar-td-reg">{row.regNum}</td>
                        <td className="ar-td-grade">
                          <select
                            className={`ar-grade-select ${!row.grade ? "ar-grade-select--empty" : ""}`}
                            value={row.grade}
                            onChange={(e) => handleGradeChange(idx, e.target.value)}
                          >
                            <option value="">— Select Grade —</option>
                            {GRADES.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </td>
                        <td className="ar-td-actions">
                          {row._id && (
                            <button
                              className="ar-update-btn"
                              onClick={() => handleUpdateRow(idx)}
                              title="Update this grade in DB"
                            >
                              Update
                            </button>
                          )}
                          <button
                            className="ar-del-row-btn"
                            onClick={() => handleDeleteRow(idx)}
                            title="Remove row"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Finalize */}
            {rows.length > 0 && (
              <div className="ar-finalize-bar">
                <div className="ar-finalize-info">
                  <span className="ar-finalize-info-dot" />
                  {rows.filter((r) => !r.grade).length > 0
                    ? `${rows.filter((r) => !r.grade).length} grade(s) still missing`
                    : "All grades filled ✓"}
                </div>
                <button
                  className={`ar-finalize-btn ${saving ? "ar-finalize-btn--loading" : ""}`}
                  onClick={handleFinalize}
                  disabled={saving}
                >
                  {saving ? (
                    <><span className="ar-btn-spinner" /> Saving…</>
                  ) : (
                    " Finalize Marks"
                  )}
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Results;