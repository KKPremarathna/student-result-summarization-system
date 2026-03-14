import { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/ViewResult.css";
import {
  FileDown,
  Filter,
  Search,
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  ChevronRight
} from "lucide-react";

function ViewResult() {
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
      .catch(err => console.warn("Backend not connected, showing default table"));
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API}/marks/filter`, {
        params: { course, batch, eNumber }
      });
      setResults(res.data);
    } catch (err) {
      console.warn("Backend not connected, results will be empty");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const columns = [];
    const rows = [];

    columns.push("E.No");
    for (let i = 1; i <= structure.assignments; i++) columns.push(`A${i}`);
    for (let i = 1; i <= structure.quizzes; i++) columns.push(`Q${i}`);
    for (let i = 1; i <= structure.labs; i++) columns.push(`L${i}`);
    columns.push("Mid", "Incourse", "End Marks", "Before Senate", "After Senate");

    results.forEach(r => {
      rows.push([
        r.eNumber,
        ...r.assignments,
        ...r.quizzes,
        ...r.labs,
        r.mid,
        r.incourse,
        r.endMarks,
        r.beforeSenate,
        r.afterSenate
      ]);
    });

    autoTable(doc, { head: [columns], body: rows });
    doc.save("results.pdf");
  };

  const defaultRows = [...Array(5)].map((_, idx) => ({
    eNumber: `E00${idx + 1}`,
    assignments: Array(structure.assignments).fill("***"),
    quizzes: Array(structure.quizzes).fill("***"),
    labs: Array(structure.labs).fill("***"),
    mid: "***",
    incourse: "***",
    endMarks: "***",
    beforeSenate: "Pending",
    afterSenate: "Pending"
  }));

  const tableRows = results.length > 0 ? results : defaultRows;

  return (
    <LecturerLayout>
      <div className="vr-page">

        {/* Page Header */}
        <div className="vr-header">
          <div>
            <div className="vr-breadcrumb">
              <LayoutDashboard size={14} />
              <span>Lecturer Portal</span>
              <ChevronRight size={14} />
              <span className="vr-breadcrumb__current">View Results</span>
            </div>
            <h2 className="vr-title">Academic Results</h2>
          </div>

          <button
            onClick={downloadPDF}
            className="vr-export-btn"
          >
            <FileDown size={20} />
            Export to PDF
          </button>
        </div>

        {/* Filters Card */}
        <div className="vr-card">
          <div className="vr-card__header">
            <div className="vr-card__icon-wrap">
              <Filter size={20} />
            </div>
            <h3 className="vr-card__title">Search Filters</h3>
          </div>

          <div className="vr-filters">
            <div className="vr-field">
              <label className="vr-label">
                <ClipboardCheck size={14} />
                Course Code
              </label>
              <select
                onChange={(e) => setCourse(e.target.value)}
                className="vr-select"
              >
                <option value="">Select Course</option>
                <option>EC9630</option>
                <option>EC6060</option>
              </select>
            </div>

            <div className="vr-field">
              <label className="vr-label">
                <GraduationCap size={14} />
                Batch
              </label>
              <select
                onChange={(e) => setBatch(e.target.value)}
                className="vr-select"
              >
                <option value="">Select Batch</option>
                <option>2021</option>
                <option>2022</option>
              </select>
            </div>

            <div className="vr-field">
              <label className="vr-label">
                <Search size={14} />
                E Number
              </label>
              <select
                onChange={(e) => setENumber(e.target.value)}
                className="vr-select"
              >
                <option value="">Select E.No</option>
                <option>E001</option>
                <option>E002</option>
              </select>
            </div>

            <button
              onClick={fetchResults}
              className="vr-filter-btn"
            >
              <Search size={18} />
              Apply Filter
            </button>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="vr-table-card">
          <div className="vr-table-scroll">
            <table className="vr-table">
              <thead>
                <tr className="vr-thead-primary">
                  <th rowSpan="2" className="vr-th vr-th--border-r">E.No</th>
                  <th colSpan={structure.assignments} className="vr-th vr-th--border-r vr-th--border-b">Assignments</th>
                  <th colSpan={structure.quizzes} className="vr-th vr-th--border-r vr-th--border-b">Quizzes</th>
                  <th colSpan={structure.labs} className="vr-th vr-th--border-r vr-th--border-b">Labs</th>
                  <th rowSpan="2" className="vr-th vr-th--border-r">Mid</th>
                  <th rowSpan="2" className="vr-th vr-th--border-r">Incourse</th>
                  <th rowSpan="2" className="vr-th vr-th--border-r">End</th>
                  <th colSpan="2" className="vr-th vr-th--border-b">Senate Results</th>
                </tr>
                <tr className="vr-thead-secondary">
                  {[...Array(structure.assignments)].map((_, i) => <th key={i} className="vr-th-sm vr-th--border-r">A{i + 1}</th>)}
                  {[...Array(structure.quizzes)].map((_, i) => <th key={i} className="vr-th-sm vr-th--border-r">Q{i + 1}</th>)}
                  {[...Array(structure.labs)].map((_, i) => <th key={i} className="vr-th-sm vr-th--border-r">L{i + 1}</th>)}
                  <th className="vr-th-sm vr-th--border-r">Before</th>
                  <th className="vr-th-sm">After</th>
                </tr>
              </thead>

              <tbody className="vr-tbody">
                {tableRows.map((r, index) => (
                  <tr key={index} className="vr-row">
                    <td className="vr-td vr-td--enumber">{r.eNumber}</td>
                    {r.assignments.map((a, i) => <td key={i} className="vr-td vr-td--data">{a}</td>)}
                    {r.quizzes.map((q, i) => <td key={i} className="vr-td vr-td--data">{q}</td>)}
                    {r.labs.map((l, i) => <td key={i} className="vr-td vr-td--data">{l}</td>)}
                    <td className="vr-td vr-td--mid">{r.mid}</td>
                    <td className="vr-td vr-td--incourse">{r.incourse}</td>
                    <td className="vr-td vr-td--mid">{r.endMarks}</td>
                    <td className="vr-td vr-td--center">
                      <span className={`vr-badge ${r.beforeSenate === 'Pending' ? 'vr-badge--pending' : 'vr-badge--done'}`}>
                        {r.beforeSenate}
                      </span>
                    </td>
                    <td className="vr-td vr-td--center">
                      <span className={`vr-badge ${r.afterSenate === 'Pending' ? 'vr-badge--pending' : 'vr-badge--done'}`}>
                        {r.afterSenate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </LecturerLayout>
  );
}

export default ViewResult;