import React, { useState } from "react";
import "../styles/StudentList.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

function StudentList() {
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");

  const students = [
    { id: "01", email: "2021e222@eng.jfn.ac.lk" },
    { id: "02", email: "2021e223@eng.jfn.ac.lk" },
    { id: "03", email: "2021e224@eng.jfn.ac.lk" },
  ];

  return (
    <div className="studentlist-page">
      <Navbar />

      <div className="studentlist-content">
        {/* left sidebar */}
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

        {/* right section */}
        <main className="studentlist-main">
          <div className="studentlist-main-content">

            <h1>Student List</h1>

            <div className="filter-row">
              <div className="filter-group">
                <label>Batch :</label>
                <select value={batch} onChange={(e) => setBatch(e.target.value)}>
                  <option value="">Select</option>
                  <option value="2020/2021">2020/2021</option>
                  <option value="2021/2022">2021/2022</option>
                  <option value="2022/2023">2022/2023</option>
                  <option value="2023/2024">2023/2024</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Department :</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.email}</td>
                      <td>
                        <button className="delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentList;