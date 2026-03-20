import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminResult.css";
import { 
  FileText, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2,
  Database,
  Users,
  Layers,
  Search,
  X,
  PlusCircle,
  Hash,
  Download,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/admin";
const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "E", "AB"];

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
      setModalError(`Invalid format: ${invalid.slice(0, 3).join(", ")}${invalid.length > 3 ? "…" : ""}.`);
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
    <div className="ar-modal-overlay">
      <div className="ar-modal">
        <div className="ar-modal-header">
          <div className="ar-modal-title">
            <PlusCircle size={24} className="ar-modal-icon" />
            <div>
               <h3>Add Students</h3>
               <p>{courseCode || "Result Compilation"}</p>
            </div>
          </div>
          <button className="ar-modal-close" onClick={onCancel}><X size={20}/></button>
        </div>

        <div className="ar-tabs">
          {[["bulk", "Bulk"], ["range", "Range"], ["individual", "One"]].map(([key, label]) => (
            <button
              key={key}
              className={`ar-tab ${tab === key ? "active" : ""}`}
              onClick={() => { setTab(key); setPreview([]); setModalError(""); }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ar-modal-body">
          {tab === "bulk" && (
            <div className="ar-input-group">
              <label>REGISTRATION NUMBERS (Line separated)</label>
              <textarea
                placeholder={"2021/E/001\n2021/E/002"}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />
            </div>
          )}
          {tab === "range" && (
            <div className="ar-input-grid">
              <div className="ar-input-group">
                <label>START ID</label>
                <input placeholder="2021/E/001" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
              </div>
              <div className="ar-input-group">
                <label>END ID</label>
                <input placeholder="2021/E/050" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
              </div>
            </div>
          )}
          {tab === "individual" && (
            <div className="ar-input-group">
              <label>SINGLE REGISTRATION NUMBER</label>
              <input placeholder="2021/E/042" value={individual} onChange={(e) => setIndividual(e.target.value)} />
            </div>
          )}

          {modalError && <div className="ar-modal-alert"><AlertCircle size={14}/> {modalError}</div>}

          <button className="ar-parse-btn" onClick={parseAndPreview}>
            Parse & Preview
          </button>

          <div className="ar-preview">
            <div className="ar-preview-header">PREVIEW LIST ({preview.length})</div>
            <div className="ar-preview-chips">
              {preview.length === 0 ? (
                <span className="ar-preview-placeholder">No students added to preview.</span>
              ) : (
                preview.map((r) => (
                  <span key={r} className="ar-chip">
                    {r}
                    <button onClick={() => setPreview((p) => p.filter((x) => x !== r))}><X size={12}/></button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="ar-modal-footer">
          <button className="ar-modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button
            className="ar-modal-btn commit"
            onClick={handleCommit}
            disabled={preview.length === 0}
          >
            Add to Table
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
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const token = localStorage.getItem("token");
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3500);
  };

  const handleCommitStudents = (regNums) => {
    const newRows = regNums.map((r) => ({ _id: null, regNum: r, grade: "", isNew: true }));
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
      if (!window.confirm(`Delete result for ${row.regNum}?`)) return;
      try {
        const res = await fetch(`${API_BASE}/delete-result/${row._id}`, {
          method: "DELETE", headers: authHeaders,
        });
        if (res.ok) showToast("Result deleted.");
        else return;
      } catch { return; }
    }
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateRow = async (idx) => {
    const row = rows[idx];
    if (!row._id) { showToast("Save all results first.", "error"); return; }
    if (!row.grade) { showToast("Enter a grade.", "error"); return; }
    try {
      const res = await fetch(`${API_BASE}/update-result/${row._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ grade: row.grade }),
      });
      if (res.ok) {
        showToast(`Updated ${row.regNum}`);
        setRows((prev) => prev.map((r, i) => i === idx ? { ...r, isNew: false } : r));
      } else {
        showToast("Update failed.", "error");
      }
    } catch { showToast("Network error.", "error"); }
  };

  const handleFinalize = async () => {
    if (!courseCode || !semester || !batch || !lecturerEmail) {
      showToast("Fill in all header fields.", "error"); return;
    }
    if (rows.length === 0) {
      showToast("Add student results first.", "error"); return;
    }
    const incomplete = rows.filter((r) => !r.grade);
    if (incomplete.length > 0) {
      showToast(`${incomplete.length} rows missing grades.`, "error"); return;
    }

    setSaving(true);
    try {
      const results = rows.map((r) => ({ regNum: r.regNum, grade: r.grade }));
      const res = await fetch(`${API_BASE}/add-results`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ courseCode, semester, batch, lecturerEmail, results }),
      });
      if (res.ok) {
        showToast("Saved successfully!");
        await loadExisting();
      } else {
        showToast("Save failed.", "error");
      }
    } catch { showToast("Network error.", "error"); }
    finally { setSaving(false); }
  };

  const loadExisting = async () => {
    if (!courseCode || !semester || !batch) {
      showToast("Provide Level/Code/Batch to load.", "error");
      return;
    }
    setLoading(true);
    try {
      const params = `?courseCode=${encodeURIComponent(courseCode)}&batch=${encodeURIComponent(batch)}&semester=${encodeURIComponent(semester)}`;
      const res = await fetch(`${API_BASE}/get-results${params}`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) {
        setRows(data.data.map((r) => ({
          _id: r._id,
          regNum: r.studentRegNum,
          grade: r.grade,
          isNew: false,
        })));
        if (data.data.length > 0) setLecturerEmail(data.data[0].lecturerEmail || lecturerEmail);
        showToast(`Loaded ${data.data.length} records.`);
      }
    } catch { showToast("Failed to load records.", "error"); }
    finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <div className="ar-page">
        {toast.visible && (
          <div className={`ar-floating-toast ${toast.type}`}>
             {toast.type === "success" ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
             <span>{toast.message}</span>
          </div>
        )}

        {showModal && (
          <AddStudentModal
            courseCode={courseCode}
            onCommit={handleCommitStudents}
            onCancel={() => setShowModal(false)}
            existingRegs={rows.map((r) => r.regNum.toUpperCase())}
          />
        )}

        {/* Header */}
        <header className="ar-header">
           <div className="ar-header-left">
              <div className="ar-breadcrumb">
                 <FileText size={14} />
                 <span>Management</span>
                 <ChevronRight size={14} />
                 <span className="ar-breadcrumb-current">Compilation</span>
              </div>
              <h1 className="ar-title">Senate Submissions</h1>
           </div>
           <div className="ar-header-right">
              <button className="ar-btn-secondary" onClick={loadExisting} disabled={loading}>
                 <RotateCw size={18} className={loading ? "animate-spin" : ""} />
                 Sync Database
              </button>
           </div>
        </header>

        {/* Multi-step form grid */}
        <div className="ar-config-grid">
           <section className="ar-card ar-config-card">
              <div className="ar-card-header">
                 <div className="ar-card-icon-wrap">
                    <Layers size={18} />
                 </div>
                 <h3>Header Configuration</h3>
              </div>
              <div className="ar-form-grid">
                 <div className="ar-input-group">
                    <label>Course Code</label>
                    <input placeholder="e.g. CS3042" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                 </div>
                 <div className="ar-input-group">
                    <label>Batch</label>
                    <input placeholder="e.g. 2021/22" value={batch} onChange={(e) => setBatch(e.target.value)} />
                 </div>
                 <div className="ar-input-group">
                    <label>Semester</label>
                    <input placeholder="e.g. 1" value={semester} onChange={(e) => setSemester(e.target.value)} />
                 </div>
                 <div className="ar-input-group">
                    <label>Lecturer Email</label>
                    <input type="email" placeholder="lecturer@eng.jfn.ac.lk" value={lecturerEmail} onChange={(e) => setLecturerEmail(e.target.value)} />
                 </div>
              </div>
           </section>

           <div className="ar-side-controls">
              <div className="ar-summary-card">
                 <div className="ar-summary-row">
                    <span className="ar-summary-label">Total Entries</span>
                    <span className="ar-summary-value">{rows.length}</span>
                 </div>
                 <div className="ar-summary-row">
                    <span className="ar-summary-label">Missing Grades</span>
                    <span className="ar-summary-value alert">{rows.filter(r => !r.grade).length}</span>
                 </div>
                 <button className="ar-btn-primary full" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Add Students
                 </button>
              </div>
              
              <div className="ar-tip-card">
                 <Info size={16} />
                 <p>Load existing results first to avoid duplicates when updating a course collection.</p>
              </div>
           </div>
        </div>

        {/* Results Table Section */}
        <div className="ar-table-card">
          <div className="ar-table-header">
             <div className="ar-table-title-group">
                <Database size={18} />
                <h3>Compilation Sheet</h3>
             </div>
             {rows.length > 0 && (
               <div className="ar-table-actions">
                  <span className="ar-status-indicator filled">
                     {rows.every(r => r.grade) ? "Complete ✓" : "Drafting..."}
                  </span>
               </div>
             )}
          </div>

          <div className="ar-table-container">
            {rows.length === 0 ? (
              <div className="ar-empty-state">
                <Users size={64} />
                <p>No student records added to this compilation.</p>
                <button className="ar-btn-outline" onClick={() => setShowModal(true)}>Begin Entry</button>
              </div>
            ) : (
              <table className="ar-table">
                <thead>
                  <tr>
                    <th><Hash size={14}/></th>
                    <th>Registration ID</th>
                    <th>Compilation Grade</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={`${row.regNum}-${idx}`} className={row.isNew ? "is-new" : ""}>
                      <td className="ar-td-num">{idx + 1}</td>
                      <td className="ar-td-reg">{row.regNum}</td>
                      <td className="ar-td-grade">
                        <select
                          className={!row.grade ? "empty" : ""}
                          value={row.grade}
                          onChange={(e) => handleGradeChange(idx, e.target.value)}
                        >
                          <option value="">Select Grade</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </td>
                      <td className="ar-td-actions">
                        <div className="ar-action-group">
                           {row._id && (
                             <button className="ar-row-btn update" onClick={() => handleUpdateRow(idx)} title="Sync individual grade">
                                <Save size={16} />
                             </button>
                           )}
                           <button className="ar-row-btn delete" onClick={() => handleDeleteRow(idx)} title="Remove student">
                              <Trash2 size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {rows.length > 0 && (
            <div className="ar-table-footer">
               <button
                 className="ar-finalize-btn"
                 onClick={handleFinalize}
                 disabled={saving}
               >
                 {saving ? <RotateCw className="animate-spin" size={20} /> : <><Download size={20} /> Finalize Mark Sheet</>}
               </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Results;