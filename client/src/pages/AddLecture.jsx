import React from "react";
import "../styles/AddLecture.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

function AddLecture() {
  return (
    <div className="lecture-page">
      <Navbar />

      <div className="lecture-container">
        
        {/* Sidebar */}
        <aside className="lecture-sidebar">
          <ul className="sidebar-menu">
            <li>
            <Link to="/adminhome"> Admin Home</Link>
            </li>
            <li className="active">
              <Link to="/adduser">Add User</Link>
            </li>
            <li>Complaint</li>
            <li>Results</li>
            <li>Reset Password</li>
          </ul>
        </aside>

        {/* Main section */}
        <div
          className="lecture-main"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="lecture-overlay"></div>

          <div className="lecture-content">
            <h2>Add New Lectures</h2>

            <div className="form-row">
              <label>Email :</label>
              <input type="text" />
            </div>

            <div className="form-row">
              <label>Department :</label>
              <input type="text" />
            </div>

            <div className="button-row">
              <button className="add-btn">Add</button>

              <Link to="/lecturelist" className="view-btn">
                View lecture List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLecture;