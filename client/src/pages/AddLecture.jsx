import React, { useState } from "react";
import "../styles/AddLecture.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";
import axios from "axios";

function AddLecture() {
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Session expired. Please login again." });
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleAddLecturer = async () => {
    if (!email || !department) {
      setMessage({ type: "error", text: "Please provide email and department" });
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-lecturer-email",
        { email, department },
        { headers }
      );

      setMessage({ type: "success", text: response.data.message });
      setEmail("");
      setDepartment("");
    } catch (error) {
      console.error("Error adding lecturer:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Error adding lecturer email",
      });
    } finally {
      setLoading(false);
    }
  };

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
                <span className="sidebar-icon"></span>
                Admin Home
              </Link>
            </li>
            <li className="active">
              <Link to="/AddUser">
                <span className="sidebar-icon"></span>
                Add User
              </Link>
            </li>
            <li>
              <Link to="/AdminComplaint">
                <span className="sidebar-icon"></span>
                Complaint
              </Link>
            </li>
            <li >
              <Link to="/AdminResults">
                <span className="sidebar-icon"></span>
                Results
              </Link>
            </li>
            <li>
              <Link to="/AdminProfile">
                <span className="sidebar-icon"></span>
                Profile
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Section */}
        <main className="addlecture-main">
          <div className="addlecture-main-content">
            <h2>Add New Lectures</h2>

            {message.text && (
              <div className={`status-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-row">
              <label>Email :</label>
              <input
                type="email"
                placeholder="lecturer@eng.jfn.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Department :</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div className="button-row">
              <button
                className="add-btn"
                onClick={handleAddLecturer}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>

              <Link to="/LectureList" className="view-btn">
                View Lecture List
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddLecture;
