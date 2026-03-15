import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/FinalResult.css";
import {
  Save,
  Download,
  Table,
  Filter,
  LayoutDashboard,
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  User,
  FileText
} from "lucide-react";

function FinalResult() {
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api";

  const handleDownloadPDF = () => {
    if (results.length === 0) {
      alert("No data available to download!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Final Result Compilation", 14, 22);
    doc.setFontSize(11);
    doc.text(`Course: ${course}`, 14, 30);
    doc.text(`Batch: ${batch}`, 14, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);

    const tableColumn = ["E Number", "Incourse Marks (80%)", "End Exam Marks (20%)", "Final Grade"];
    const tableRows = results.map(row => [
      row.eNumber,
      row.incourse,
      row.endExam || "-",
      row.grade || "-"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [11, 46, 51] }
    });

    doc.save(`Final_Results_${course}_${batch}.pdf`);
  };

  // Grading scale logic
  const calculateGrade = (total) => {
    if (total >= 75) return "A";
    if (total >= 65) return "B";
    if (total >= 50) return "C";
    if (total >= 35) return "S";
    return "F";
  };

  // Fetch results when filters change
  useEffect(() => {
    if (course && batch) {
      setLoading(true);
      // Fetching all student results for the compilation
      axios.get(`${API}/marks/compiled`, { params: { course, batch } })
        .then(res => {
          if (res.data && res.data.length > 0) {
            setResults(res.data);
          } else {
            // Provide some default dummy data if none found
            setResults([
              { eNumber: "E001", incourse: 25, endExam: "", grade: "-" },
              { eNumber: "E002", incourse: 20, endExam: "", grade: "-" },
            ]);
          }
        })
        .catch(() => {
          console.warn("Error fetching compiled data");
          // Fallback dummy data for development
          setResults([
            { eNumber: "E001", incourse: 25, endExam: "", grade: "-" },
            { eNumber: "E002", incourse: 20, endExam: "", grade: "-" },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [course, batch]);

  const handleFinalMarksChange = (index, value) => {
    const newResults = [...results];
    const finalMark = parseFloat(value) || 0;
    newResults[index].endExam = value;
    
    // Auto calculate grade (80% Incourse, 20% Final)
    const incourseMark = parseFloat(newResults[index].incourse) || 0;
    const total = incourseMark + finalMark; 
    
    newResults[index].grade = calculateGrade(total);
    setResults(newResults);
  };

  const handleSave = (status) => {
    if (!course || !batch) {
      alert("Please select Course and Batch first!");
      return;
    }
    setLoading(true);
    axios.post(`${API}/marks/compile/save`, { course, batch, results, status })
      .then(() => alert(`Results ${status === 'submitted' ? 'submitted to Senate' : 'saved as draft'} successfully!`))
      .catch(err => alert("Error: " + err.message))
      .finally(() => setLoading(false));
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
              className="fr-btn fr-btn--outline" 
              onClick={() => handleSave('draft')}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Draft"}
            </button>
            <button 
              className="fr-btn fr-btn--primary" 
              onClick={handleDownloadPDF}
              disabled={loading}
            >
              <FileText size={18} />
              Download as PDF
            </button>
          </div>
        </div>

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
                onChange={(e) => setCourse(e.target.value)}
                value={course}
                className="fr-select"
              >
                <option value="">Select Course</option>
                <option value="EC9630">EC9630</option>
                <option value="EC6060">EC6060</option>
              </select>
            </div>

            <div className="fr-field">
              <label className="fr-label">
                <GraduationCap size={14} />
                Batch
              </label>
              <select
                onChange={(e) => setBatch(e.target.value)}
                value={batch}
                className="fr-select"
              >
                <option value="">Select Batch</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
              </select>
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
                  <th className="fr-th">Total Incourse Marks (80%)</th>
                  <th className="fr-th">End Exam Marks (20%)</th>
                  <th className="fr-th">Final Grade</th>
                </tr>
              </thead>
              <tbody className="fr-tbody">
                {results.map((row, index) => (
                  <tr key={index} className="fr-row">
                    <td className="fr-td">
                      <div className="fr-enumber-cell">
                        <div className="fr-enumber-icon">
                          <User size={16} />
                        </div>
                        <span className="fr-enumber-text">{row.eNumber}</span>
                      </div>
                    </td>
                    <td className="fr-td fr-td--center">
                      <span className="fr-value-display">{row.incourse}</span>
                    </td>
                    <td className="fr-td fr-td--center">
                      <input
                        type="number"
                        value={row.endExam}
                        onChange={(e) => handleFinalMarksChange(index, e.target.value)}
                        placeholder="0"
                        className="fr-input fr-input--cell"
                      />
                    </td>
                    <td className="fr-td fr-td--center">
                      <span className="fr-grade-badge">{row.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="fr-info-bar">
          <div className="fr-info-bar__icon-wrap">
            <Table size={24} />
          </div>
          <div>
            <p className="fr-info-bar__label">Quick Info</p>
            <p className="fr-info-bar__text">
              {results.length > 0 
                ? `Currently managing ${results.length} student records for ${course || 'selected batch'}.`
                : "Select a course and batch to start compiling results."}
            </p>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}

export default FinalResult;
