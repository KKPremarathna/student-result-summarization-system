import React, { useState } from "react";
import "../styles/AddStudent.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

function AddStudent() {
  const [studentId, setStudentId] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [deleteStartId, setDeleteStartId] = useState("");
  const [deleteEndId, setDeleteEndId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Session expired. Please login again." });
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleAddSingleStudent = async () => {
    if (!studentId) {
      setMessage({ type: "error", text: "Please enter a Student ID" });
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-allowed-email", 
        { regNum: studentId, role: "student" },
        { headers }
      );
      setMessage({ type: "success", text: response.data.message });
      setStudentId("");
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Error adding student",
      });
    }
  };

  const handleAddBulkStudents = async () => {
    if (!startId || !endId) {
      setMessage({ type: "error", text: "Please enter both Start and End ID" });
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-bulk-allowed-emails", 
        { startRegNum: startId, endRegNum: endId, role: "student" },
        { headers }
      );
      setMessage({ type: "success", text: response.data.message });
      setStartId("");
      setEndId("");
    } catch (error) {
      console.error("Error adding bulk students:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Error adding bulk students",
      });
    }
  };

  const handleDeleteBulkStudents = async () => {
    if (!deleteStartId || !deleteEndId) {
      setMessage({ type: "error", text: "Please enter both Start and End ID" });
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await axios.delete("http://localhost:5000/api/admin/delete-bulk-allowed-emails", {
        headers,
        data: {
          startRegNum: deleteStartId,
          endRegNum: deleteEndId,
        },
      });
      setMessage({ type: "success", text: response.data.message });
      setDeleteStartId("");
      setDeleteEndId("");
    } catch (error) {
      console.error("Error deleting bulk students:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Error deleting bulk students",
      });
    }
  };

  return (
    <div className="addstudent-page">
      <Navbar />

      <div className="addstudent-content">
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
              <Link to="/AdminProfile">
                <span className="sidebar-icon">👤</span>
                Profile
              </Link>
            </li>
          </ul>
        </aside>

        <main className="addstudent-main">
          <div className="addstudent-main-content">

            <h1>Add Student</h1>

            {message.text && (
              <div className={`status-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label>Add Student :</label>
              <div className="row">
                <span>Student Id</span>
                <input
                  type="text"
                  placeholder="20XX/E/XXX (e.g., 2024/E/140)"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <button onClick={handleAddSingleStudent}>Add</button>
              </div>
            </div>

            <div className="form-group">
              <label>Add Students in Bulk :</label>
              <div className="row">
                <span>Start Id :</span>
                <input
                  type="text"
                  placeholder="20XX/E/001"
                  value={startId}
                  onChange={(e) => setStartId(e.target.value)}
                />
                <span>End Id :</span>
                <input
                  type="text"
                  placeholder="20XX/E/050"
                  value={endId}
                  onChange={(e) => setEndId(e.target.value)}
                />
                <button onClick={handleAddBulkStudents}>Add</button>
              </div>
            </div>

            <div className="form-group">
              <label>Delete Students in Bulk :</label>
              <div className="row">
                <span>Start Id :</span>
                <input
                  type="text"
                  placeholder="20XX/E/001"
                  value={deleteStartId}
                  onChange={(e) => setDeleteStartId(e.target.value)}
                />
                <span>End Id :</span>
                <input
                  type="text"
                  placeholder="20XX/E/050"
                  value={deleteEndId}
                  onChange={(e) => setDeleteEndId(e.target.value)}
                />
                <button onClick={handleDeleteBulkStudents}>Delete</button>
              </div>
            </div>
            <Link to="/studentlist" className="view-btn-link">
              <button className="view-btn">View Student List</button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddStudent;