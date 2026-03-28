import { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { 
  getCourseCodes, 
  getBatches, 
  getIncourseResults, 
  getSubjectByCodeAndBatch 
} from "../services/lecturerApi.js";
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
  ChevronRight,
  Database,
  Calendar,
  AlertCircle,
  Loader2,
  Table as TableIcon
} from "lucide-react";
import { Link } from "react-router-dom";

function ViewResult() {
  const [courseCodes, setCourseCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [eNumberFilter, setENumberFilter] = useState("");
  
  const [results, setResults] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [structure, setStructure] = useState({
    assignments: 0,
    quizzes: 0,
    labs: 0
  });

  // Fetch initial course codes
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await getCourseCodes();
        setCourseCodes(res.data);
      } catch (err) {
        console.error("Error fetching course codes:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch batches when course changes
  useEffect(() => {
    if (selectedCourse) {
      const fetchBatches = async () => {
        try {
          const res = await getBatches(selectedCourse);
          setBatches(res.data);
          setSelectedBatch(""); // Reset batch when course changes
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

  const fetchResults = async () => {
    if (!selectedCourse || !selectedBatch) {
      return;
    }

    setLoading(true);
    try {
      // 1. Get Subject ID
      const subRes = await getSubjectByCodeAndBatch(selectedCourse, selectedBatch);
      if (subRes.data && subRes.data.length > 0) {
        const subject = subRes.data[0];
        setSubjectInfo(subject);
        
        // Update structure based on subject assessments
        setStructure({
          assignments: subject.assessments?.assignmentCount || 0,
          quizzes: subject.assessments?.quizCount || 0,
          labs: subject.assessments?.labCount || 0
        });

        // 2. Get Results
        const res = await getIncourseResults(subject._id);
        const fetchedResults = res.data.results || [];
        
        // 3. Filter by E Registration Number if provided
        if (eNumberFilter) {
          setResults(fetchedResults.filter(r => 
            r.studentENo.toLowerCase().includes(eNumberFilter.toLowerCase())
          ));
        } else {
          setResults(fetchedResults);
        }
      }
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (results.length === 0) return;

    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait orientation
    const columns = ["E.No", "Mid Exam", "Incourse", "End Exam", "Grade"];
    
    const rows = results.map(r => [
      r.studentENo,
      r.mid ?? "-",
      r.incourseTotal?.toFixed(1) || "0.0",
      r.endExamMark ?? "-",
      r.grade ?? "-"
    ]);

    doc.setFontSize(16);
    doc.text(`Academic Results: ${selectedCourse} - ${selectedBatch}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, { 
      head: [columns], 
      body: rows,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [11, 46, 51] }
    });
    
    doc.save(`Results_${selectedCourse}_${selectedBatch}.pdf`);
  };

  return (
    <LecturerLayout>
      <div className="vr-page">

        {/* Page Header */}
        <header className="vr-header">
          <div className="vr-header__left">
            <div className="vr-breadcrumb">
              <Link to="/lecturer/home">Dashboard</Link>
              <ChevronRight size={14} />
              <span className="vr-breadcrumb__current">View Results</span>
            </div>
            <h2 className="vr-title">Academic Results</h2>
          </div>

          <button
            onClick={downloadPDF}
            className="vr-export-btn"
            disabled={results.length === 0}
          >
            <FileDown size={20} />
            Export to PDF
          </button>
        </header>

        {/* Filters Card */}
        <div className="vr-card">
          <div className="vr-card__header">
            <div className="vr-card__icon-wrap">
              <Filter size={24} />
            </div>
            <h3 className="vr-card__title">Search Filters</h3>
          </div>

          <div className="vr-filters">
            <div className="vr-field">
              <label className="vr-label">
                <Database size={16} />
                Course Code
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="vr-select"
              >
                <option value="">Select Course</option>
                {courseCodes.map(item => (
                  <option key={item.courseCode} value={item.courseCode}>
                    {item.courseCode} - {item.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="vr-field">
              <label className="vr-label">
                <Calendar size={16} />
                Batch
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="vr-select"
                disabled={!selectedCourse}
              >
                <option value="">Select Batch</option>
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>

            <div className="vr-field">
              <label className="vr-label">
                <Search size={16} />
                E-Number Filter
              </label>
              <input
                type="text"
                placeholder="Search by E No..."
                value={eNumberFilter}
                onChange={(e) => setENumberFilter(e.target.value)}
                className="vr-input"
              />
            </div>

            <button
              onClick={fetchResults}
              className="vr-filter-btn"
              disabled={loading || !selectedCourse || !selectedBatch}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Search size={20} />
                  Find Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Table Card */}
        <div className="vr-table-card">
          {results.length > 0 ? (
            <div className="vr-table-container">
              <table className="vr-table">
                <thead>
                  <tr className="vr-thead-primary">
                    <th rowSpan="2" className="vr-th">E.No</th>
                    {structure.assignments > 0 && <th colSpan={structure.assignments} className="vr-th">Assignments</th>}
                    {structure.quizzes > 0 && <th colSpan={structure.quizzes} className="vr-th">Quizzes</th>}
                    {structure.labs > 0 && <th colSpan={structure.labs} className="vr-th">Labs</th>}
                    <th rowSpan="2" className="vr-th">Mid</th>
                    <th rowSpan="2" className="vr-th">Incourse</th>
                    <th rowSpan="2" className="vr-th">End Exam</th>
                    <th colSpan="2" className="vr-th">Final Result</th>
                  </tr>
                  <tr className="vr-thead-secondary">
                    {[...Array(structure.assignments)].map((_, i) => <th key={i} className="vr-th-sm">A{i + 1}</th>)}
                    {[...Array(structure.quizzes)].map((_, i) => <th key={i} className="vr-th-sm">Q{i + 1}</th>)}
                    {[...Array(structure.labs)].map((_, i) => <th key={i} className="vr-th-sm">L{i + 1}</th>)}
                    <th className="vr-th-sm">Mark</th>
                    <th className="vr-th-sm">Grade</th>
                  </tr>
                </thead>

                <tbody className="vr-tbody">
                  {results.map((r, index) => (
                    <tr key={index}>
                      <td className="vr-td vr-td--enumber">{r.studentENo}</td>
                      {[...Array(structure.assignments)].map((_, i) => (
                        <td key={`a-${i}`} className="vr-td">
                          {r.assignments?.[i] !== undefined ? r.assignments[i] : "-"}
                        </td>
                      ))}
                      {[...Array(structure.quizzes)].map((_, i) => (
                        <td key={`q-${i}`} className="vr-td">
                          {r.quizzes?.[i] !== undefined ? r.quizzes[i] : "-"}
                        </td>
                      ))}
                      {[...Array(structure.labs)].map((_, i) => (
                        <td key={`l-${i}`} className="vr-td">
                          {r.labs?.[i] !== undefined ? r.labs[i] : "-"}
                        </td>
                      ))}
                      <td className="vr-td">{r.mid ?? "-"}</td>
                      <td className="vr-td">{r.incourseTotal?.toFixed(1) || "-"}</td>
                      <td className="vr-td">{r.endExamMark ?? "-"}</td>
                      <td className="vr-td">
                        <span className="vr-badge vr-badge--done">
                          {r.finalMark ?? "-"}
                        </span>
                      </td>
                      <td className="vr-td">
                        <span className={`vr-badge ${r.grade === 'E' ? 'vr-badge--fail' : 'vr-badge--done'}`}>
                          {r.grade ?? "N/A"}
                        </span>
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
              <h3>Data Preview Ready</h3>
              <p>
                {loading 
                  ? "Retrieving and processing academic records..." 
                  : "Select a module and batch to view the comprehensive result table."}
              </p>
            </div>
          )}
        </div>

      </div>
    </LecturerLayout>
  );
}

export default ViewResult;
