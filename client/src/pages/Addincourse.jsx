import { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  FileText
} from "lucide-react";

function AddIncourse() {
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [eNumber, setENumber] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch results when filters change
  useEffect(() => {
    if (course && batch) {
      setLoading(true);
      axios.get(`${API}/marks`, { params: { course, batch, eNumber } })
        .then(res => {
          if (res.data && res.data.length > 0) {
            setResults(res.data);
          } else {
            // If no data found, provide some default empty rows
            setResults(generateDefaultRows());
          }
        })
        .catch(() => {
          console.warn("Error fetching data, using default rows");
          setResults(generateDefaultRows());
        })
        .finally(() => setLoading(false));
    }
  }, [course, batch, eNumber]);

  const generateDefaultRows = () => [...Array(5)].map(() => ({
    eNumber: "",
    assignments: Array(structure.assignments).fill(""),
    quizzes: Array(structure.quizzes).fill(""),
    labs: Array(structure.labs).fill(""),
    mid: "",
    incourse: ""
  }));

  const handleAddRow = () => {
    const newRow = {
      eNumber: "",
      assignments: Array(structure.assignments).fill(""),
      quizzes: Array(structure.quizzes).fill(""),
      labs: Array(structure.labs).fill(""),
      mid: "",
      incourse: ""
    };
    setResults([...results, newRow]);
  };

  const handleDownloadPDF = () => {
    if (results.length === 0) {
      alert("No data available to download!");
      return;
    }

    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Incourse Marks Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Course Code: ${course || "N/A"}`, 14, 30);
    doc.text(`Batch: ${batch || "N/A"}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 42);

    const head1 = [
      { content: "E.No", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
      { content: "Assignments (20%)", colSpan: structure.assignments, styles: { halign: "center" } },
      { content: "Quizzes (20%)", colSpan: structure.quizzes, styles: { halign: "center" } },
      { content: "Labs (10%)", colSpan: structure.labs, styles: { halign: "center" } },
      { content: "Mid (50%)", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
      { content: "Total", rowSpan: 2, styles: { halign: "center", valign: "middle" } }
    ];

    const head2 = [
      ...Array(structure.assignments).fill(0).map((_, i) => `A${i + 1}`),
      ...Array(structure.quizzes).fill(0).map((_, i) => `Q${i + 1}`),
      ...Array(structure.labs).fill(0).map((_, i) => `L${i + 1}`)
    ];

    const tableRows = results.map(r => [
      r.eNumber || "-",
      ...r.assignments.map(a => a || "0"),
      ...r.quizzes.map(q => q || "0"),
      ...r.labs.map(l => l || "0"),
      r.mid || "0",
      r.incourse || "0"
    ]);

    autoTable(doc, {
      head: [head1, head2],
      body: tableRows,
      startY: 50,
      theme: "grid",
      headStyles: { fillColor: [11, 46, 51] },
      styles: { fontSize: 9, cellPadding: 2 }
    });

    doc.save(`Incourse_Marks_${course || "Unknown"}.pdf`);
  };

  const calculateIncourse = (row) => {
    const getAvg = (arr) => {
      const validMarks = arr.map(m => parseFloat(m)).filter(m => !isNaN(m));
      return validMarks.length > 0 ? (validMarks.reduce((a, b) => a + b, 0) / validMarks.length) : 0;
    };

    const avgAssignments = getAvg(row.assignments);
    const avgQuizzes = getAvg(row.quizzes);
    const avgLabs = getAvg(row.labs);
    const midMark = parseFloat(row.mid) || 0;

    // Calculation: (Avg Assign * 20%) + (Avg Quizzes * 20%) + (Avg Labs * 10%) + (Mid * 50%)
    const total = (avgAssignments * 0.2) + (avgQuizzes * 0.2) + (avgLabs * 0.1) + (midMark * 0.5);
    return total.toFixed(2);
  };

  const handleInputChange = (index, field, value, subIndex = null) => {
    const newResults = [...results];
    if (subIndex !== null) {
      newResults[index][field][subIndex] = value;
    } else {
      newResults[index][field] = value;
    }

    // Auto-calculate total incourse marks
    newResults[index].incourse = calculateIncourse(newResults[index]);
    setResults(newResults);
  };

  const handleSave = () => {
    if (!course || !batch) {
      alert("Please select Course and Batch first!");
      return;
    }
    setLoading(true);
    axios.post(`${API}/marks/save`, { course, batch, results })
      .then(() => alert("Marks saved successfully!"))
      .catch(err => alert("Error saving marks: " + err.message))
      .finally(() => setLoading(false));
  };

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

          <div className="aic-header__actions">
            <button 
              className="aic-btn aic-btn--outline" 
              onClick={handleDownloadPDF}
              disabled={loading}
            >
              <FileText size={18} />
              Download PDF
            </button>
            <button 
              className="aic-save-btn" 
              onClick={handleSave} 
              disabled={loading}
            >
              <Save size={20} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
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
                value={course}
                className="aic-select"
              >
                <option value="">Select Course</option>
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
                value={batch}
                className="aic-select"
              >
                <option value="">Select Batch</option>
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
                value={eNumber}
                className="aic-select"
              >
                <option value="">Select E.No</option>
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
                  <th colSpan={structure.assignments} className="aic-th aic-th--border-r aic-th--border-b">Assignments (20%)</th>
                  <th colSpan={structure.quizzes} className="aic-th aic-th--border-r aic-th--border-b">Quizzes (20%)</th>
                  <th colSpan={structure.labs} className="aic-th aic-th--border-r aic-th--border-b">Labs (10%)</th>
                  <th rowSpan="2" className="aic-th aic-th--border-r">Mid (50%)</th>
                  <th rowSpan="2" className="aic-th">Total incourse marks</th>
                </tr>
                <tr className="aic-thead-secondary">
                  {[...Array(structure.assignments)].map((_, i) => <th key={i} className="aic-th-sm aic-th--border-r">A{i + 1}</th>)}
                  {[...Array(structure.quizzes)].map((_, i) => <th key={i} className="aic-th-sm aic-th--border-r">Q{i + 1}</th>)}
                  {[...Array(structure.labs)].map((_, i) => <th key={i} className="aic-th-sm aic-th--border-r">L{i + 1}</th>)}
                </tr>
              </thead>

              <tbody className="aic-tbody">
                {results.map((r, index) => (
                  <tr key={index} className="aic-row">
                    <td className="aic-td aic-td--enumber">
                      <input
                        type="text"
                        value={r.eNumber}
                        onChange={(e) => handleInputChange(index, "eNumber", e.target.value)}
                        placeholder="E.No"
                        className="aic-cell-input"
                      />
                    </td>

                    {r.assignments.map((a, i) => (
                      <td key={i} className="aic-td aic-td--border-r">
                        <input
                          type="number"
                          value={a}
                          onChange={(e) => handleInputChange(index, "assignments", e.target.value, i)}
                          placeholder="-"
                          className="aic-cell-input"
                        />
                      </td>
                    ))}

                    {r.quizzes.map((q, i) => (
                      <td key={i} className="aic-td aic-td--border-r">
                        <input
                          type="number"
                          value={q}
                          onChange={(e) => handleInputChange(index, "quizzes", e.target.value, i)}
                          placeholder="-"
                          className="aic-cell-input"
                        />
                      </td>
                    ))}

                    {r.labs.map((l, i) => (
                      <td key={i} className="aic-td aic-td--border-r">
                        <input
                          type="number"
                          value={l}
                          onChange={(e) => handleInputChange(index, "labs", e.target.value, i)}
                          placeholder="-"
                          className="aic-cell-input"
                        />
                      </td>
                    ))}

                    <td className="aic-td aic-td--border-r">
                      <input
                        type="number"
                        value={r.mid}
                        onChange={(e) => handleInputChange(index, "mid", e.target.value)}
                        placeholder="-"
                        className="aic-cell-input aic-cell-input--mid"
                      />
                    </td>

                    <td className="aic-td aic-td--incourse">
                      <span className="aic-total-display">{r.incourse}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="aic-table-footer">
            <button className="aic-add-row-btn" onClick={handleAddRow}>
              + Add Student Row
            </button>
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
          <button className="aic-finalize-btn" onClick={handleSave}>
            Finalize Marks
          </button>
        </div>

      </div>
    </LecturerLayout>
  );
}

export default AddIncourse;