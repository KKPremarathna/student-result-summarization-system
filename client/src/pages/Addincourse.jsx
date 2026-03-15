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

  const handleInputChange = (index, field, value, subIndex = null) => {
    const newResults = [...results];
    if (subIndex !== null) {
      newResults[index][field][subIndex] = value;
    } else {
      newResults[index][field] = value;
    }

    // Optional: Calculate total incourse marks if logic exists
    // For now, it's just a manual entry or display
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

          <button className="aic-save-btn" onClick={handleSave} disabled={loading}>
            <Save size={20} />
            {loading ? "Saving..." : "Save Changes"}
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
                  <th colSpan={structure.assignments} className="aic-th aic-th--border-r aic-th--border-b">Assignments</th>
                  <th colSpan={structure.quizzes} className="aic-th aic-th--border-r aic-th--border-b">Quizzes</th>
                  <th colSpan={structure.labs} className="aic-th aic-th--border-r aic-th--border-b">Labs</th>
                  <th rowSpan="2" className="aic-th aic-th--border-r">Mid</th>
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
                      <input
                        type="number"
                        value={r.incourse}
                        onChange={(e) => handleInputChange(index, "incourse", e.target.value)}
                        placeholder="-"
                        className="aic-cell-input"
                      />
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