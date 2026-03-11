import React, { useState } from "react";
import "../styles/AdminResult.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

function Results() {
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [lectureId, setLectureId] = useState("");

  const [rows, setRows] = useState([
    { eNo: "2021/E/056", grade: "C-" },
    { eNo: "2021/E/089", grade: "B+" },
  ]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([...rows, { eNo: "", grade: "" }]);
  };

  return (
    <div className="results-page">
      <Navbar />

      <div className="results-content">
        <aside className="adduser-sidebar">
                          <ul className="sidebar-menu">
                              <li>
                              <Link to="/adminhome"> Admin Home</Link>
                              </li>
                            <li>
                              <Link to="/adduser">Add User</Link>
                            </li>
                            <li>
                              <Link to="/complaint">Complaint</Link>
                            </li>
                            <li className="active">
                              <Link to="/AdminResults">Results</Link>
                            </li>
                            <li>
                              <Link to="/resetpassword">Reset Password</Link>
                            </li>
                          </ul>
                        </aside>
        <main
          className="results-main"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="results-overlay"></div>

          <div className="results-main-content">
            <h1>Add Results</h1>

            <div className="results-form-top">
              <div className="form-column">
                <div className="form-row">
                  <label>Course Code :</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label>Batch :</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-row">
                  <label>Semester :</label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label>Lecture Id :</label>
                  <input
                    type="text"
                    value={lectureId}
                    onChange={(e) => setLectureId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>E No</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={row.eNo}
                          onChange={(e) =>
                            handleChange(index, "eNo", e.target.value)
                          }
                          className="table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.grade}
                          onChange={(e) =>
                            handleChange(index, "grade", e.target.value)
                          }
                          className="table-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="results-btn-row">
              <button className="add-row-btn" onClick={addNewRow}>
                Add Row
              </button>

              <button className="add-results-btn">
                Add
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Results;