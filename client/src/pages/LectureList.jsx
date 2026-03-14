import React, { useState } from "react";
import "../styles/LectureList.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

function LectureList() {
  const [department, setDepartment] = useState("");
  const [showTable, setShowTable] = useState(false);

  const lectures = [
    {
      id: 1,
      email: "drsugath@eng.jfn.ac.lk",
      name: "Dr. Sugath Ekanayake",
      department: "Civil",
      phone: "077-8927187",
    },
    {
      id: 2,
      email: "amala@eng.jfn.ac.lk",
      name: "Ms. Amala Perera",
      department: "Computer",
      phone: "071-3456789",
    },
    {
      id: 3,
      email: "nimal@eng.jfn.ac.lk",
      name: "Mr. Nimal Raj",
      department: "Electrical",
      phone: "075-1122334",
    },
    {
      id: 4,
      email: "kavitha@eng.jfn.ac.lk",
      name: "Mrs. Kavitha Silva",
      department: "Civil",
      phone: "078-6677889",
    },
  ];

  const filteredLectures = department
    ? lectures.filter((lec) => lec.department === department)
    : [];

  const handleView = () => {
    setShowTable(true);
  };

  return (
    <div className="lecturelist-page">
      <Navbar />

      <div className="lecturelist-content">
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/AdminHome">
                <span className="sidebar-icon">🏠</span>
                Admin Home
              </Link>
            </li>
            <li className="active">
              <Link to="/AddUser">
                <span className="sidebar-icon">👤</span>
                Add User
              </Link>
            </li>
            <li>
              <Link to="/AdminComplaint">
                <span className="sidebar-icon">📋</span>
                Complaint
              </Link>
            </li>
            <li >
              <Link to="/AdminResults">
                <span className="sidebar-icon">📊</span>
                Results
              </Link>
            </li>
            <li>
              <Link to="/AdminResetPassword">
                <span className="sidebar-icon">🔒</span>
                Reset Password
              </Link>
            </li>
          </ul>
        </aside>

        <main className="lecturelist-main">
          <div className="lecturelist-main-content">

            <h1>Lectures List</h1>

            <div className="lecture-filter-row">
              <label>Department:</label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="Civil">Civil</option>
                <option value="Computer">Computer</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
              </select>

              <button className="view-btn" onClick={handleView}>
                View
              </button>
            </div>

            {showTable && (
              <div className="lecture-table-wrapper">
                <table className="lecture-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Phone No</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLectures.length > 0 ? (
                      filteredLectures.map((lecture) => (
                        <tr key={lecture.id}>
                          <td>{lecture.email}</td>
                          <td>{lecture.name}</td>
                          <td>{lecture.department}</td>
                          <td>{lecture.phone}</td>
                          <td>
                            <button className="delete-btn">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No lectures found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LectureList;