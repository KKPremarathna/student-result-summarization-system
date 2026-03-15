import { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import axios from "axios";
import "../styles/Addincourse.css";
import {
  Save,
  Filter,
  Search,
  GraduationCap,
  LayoutDashboard,
  ChevronRight,
  ClipboardCheck,
  Edit3
} from "lucide-react";

function AddIncourse() {
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [eNumber, setENumber] = useState("");
  const [results, setResults] = useState([]);

  const [structure, setStructure] = useState({
    assignments: 3,
    quizzes: 2,
    labs: 4
  });

  const API = "http://localhost:5000/api";

  useEffect(() => {
    axios.get(`${API}/marks/structure`)
      .then(res => setStructure(res.data))
      .catch(() => console.warn("Backend not connected, using default structure"));
  }, []);

  const defaultRows = [...Array(5)].map((_, idx) => ({
    eNumber: `E00${idx + 1}`,
    assignments: Array(structure.assignments).fill(""),
    quizzes: Array(structure.quizzes).fill(""),
    labs: Array(structure.labs).fill(""),
    mid: "",
    incourse: "",
    endMarks: "",
    beforeSenate: "Pending",
    afterSenate: "Pending"
  }));

  const tableRows = results.length > 0 ? results : defaultRows;

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
              <span className="aic-breadcrumb__current">Result Entry</span>
            </div>
            <h2 className="aic-title">
              <Edit3 size={32} className="aic-title__icon" />
              Add Incourse Marks
            </h2>
          </div>

          <button className="aic-save-btn">
            <Save size={20} />
            Save Changes
          </button>
        </div>

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
                onChange={(e) => setCourse(e.target.value)}
                className="aic-select"
              >
                <option>Select Course</option>
                <option>EC9630</option>
                <option>EC6060</option>
              </select>
            </div>

            <div className="aic-field">
              <label className="aic-label">
                <GraduationCap size={14} />
                Batch
              </label>
              <select
                onChange={(e) => setBatch(e.target.value)}
                className="aic-select"
              >
                <option>Select Batch</option>
                <option>2021</option>
                <option>2022</option>
              </select>
            </div>

            <div className="aic-field">
              <label className="aic-label">
                <Search size={14} />
                E Number (Optional)
              </label>
              <select
                onChange={(e) => setENumber(e.target.value)}
                className="aic-select"
              >
                <option>Select E.No</option>
                <option>E001</option>
                <option>E002</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entry Table Card */}
        <div className="aic-table-card">
          <div className="aic-table-scroll">
            <table className="aic-table">
              <thead>
                <tr className="aic-thead-primary">
                  <th rowSpan="2" className="aic-th aic-th--border-r">E.No</th>
                  <th colSpan={structure.assignments} className="aic-th aic-th--border-r aic-th--border-b">Assignments</th>
                  <th colSpan={structure.quizzes} className="aic-th aic-th--border-r aic-th--border-b">Quizzes</th>
                  <th colSpan={structure.labs} className="aic-th aic-th--border-r aic-th--border-b">Labs</th>
                  <th rowSpan="2" className="aic-th aic-th--border-r">Mid</th>
                  <th rowSpan="2" className="aic-th aic-th--border-r">Incr.</th>
                  <th rowSpan="2" className="aic-th aic-th--border-r">End</th>
                  <th colSpan="2" className="aic-th aic-th--border-b">Senate Status</th>
                </tr>
                <tr className="aic-thead-secondary">
                  {[...Array(structure.assignments)].map((_, i) => <th key={i} className="aic-th-sm aic-th--border-r">A{i + 1}</th>)}
                  {[...Array(structure.quizzes)].map((_, i) => <th key={i} className="aic-th-sm aic-th--border-r">Q{i + 1}</th>)}
                  {[...Array(structure.labs)].map((_, i) => <th key={i} className="aic-th-sm aic-th--border-r">L{i + 1}</th>)}
                  <th className="aic-th-sm aic-th--border-r">Before</th>
                  <th className="aic-th-sm">After</th>
                </tr>
              </thead>

              <tbody className="aic-tbody">
                {tableRows.map((r, index) => (
                  <tr key={index} className="aic-row">
                    <td className="aic-td aic-td--enumber">{r.eNumber}</td>

                    {r.assignments.map((a, i) => (
                      <td key={i} className="aic-td aic-td--border-r">
                        <input
                          type="number"
                          defaultValue={a}
                          placeholder="-"
                          className="aic-cell-input"
                        />
                      </td>
                    ))}

                    {r.quizzes.map((q, i) => (
                      <td key={i} className="aic-td aic-td--border-r">
                        <input
                          type="number"
                          defaultValue={q}
                          placeholder="-"
                          className="aic-cell-input"
                        />
                      </td>
                    ))}

                    {r.labs.map((l, i) => (
                      <td key={i} className="aic-td aic-td--border-r">
                        <input
                          type="number"
                          defaultValue={l}
                          placeholder="-"
                          className="aic-cell-input"
                        />
                      </td>
                    ))}

                    <td className="aic-td aic-td--border-r">
                      <input
                        type="number"
                        defaultValue={r.mid}
                        placeholder="-"
                        className="aic-cell-input aic-cell-input--mid"
                      />
                    </td>

                    <td className="aic-td aic-td--incourse">{r.incourse}</td>

                    <td className="aic-td aic-td--border-r">
                      <input
                        type="number"
                        defaultValue={r.endMarks}
                        placeholder="-"
                        className="aic-cell-input aic-cell-input--end"
                      />
                    </td>

                    <td className="aic-td aic-td--center">
                      <span className="aic-status">{r.beforeSenate}</span>
                    </td>
                    <td className="aic-td aic-td--center">
                      <span className="aic-status">{r.afterSenate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="aic-footer">
          <div className="aic-footer__info">
            <div className="aic-footer__icon-wrap">
              <ClipboardCheck size={24} className="aic-footer__icon" />
            </div>
            <div>
              <p className="aic-footer__label">Global Status</p>
              <p className="aic-footer__text">All marks strictly validated against course structure</p>
            </div>
          </div>
          <button className="aic-finalize-btn">
            Finalize Marks
          </button>
        </div>

      </div>
    </LecturerLayout>
  );
}

export default AddIncourse;