import React, { useState } from "react";
import "../styles/AddLecture.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

function AddLecture() {

  const [department, setDepartment] = useState("");

  return (
    <div className="addlecture-page">

      <Navbar />

      <div className="addlecture-container">

        {/* Sidebar */}
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
        {/* Main Section */}
        <main className="addlecture-main">
          <div className="addlecture-main-content">


            <h2>Add New Lectures</h2>

            <div className="form-row">
              <label>Email :</label>
              <input type="text" />
            </div>

            <div className="form-row">
              <label>Department :</label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option>Computer Engineering</option>
                <option>Electrical Engineering</option>
                <option>Civil Engineering</option>
                <option>Mechanical Engineering</option>
              </select>

            </div>

            <div className="button-row">

              <button className="add-btn">Add</button>

              <Link to="/lecturelist" className="view-btn">
                View lecture List
              </Link>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default AddLecture;