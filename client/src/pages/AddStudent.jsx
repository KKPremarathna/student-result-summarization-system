import React from "react";
import "../styles/AddStudent.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg";
import { Link } from "react-router-dom";

function AddStudent() {
  return (
    <div className="addstudent-page">
      <Navbar />

      <div className="addstudent-content">
        <aside className="adduser-sidebar">
          <ul className="sidebar-menu">
              <li>
              <Link to="/adminhome"> Admin Home</Link>
              </li>
            <li className="active">
              <Link to="/adduser">Add User</Link>
            </li>
            <li>
              <Link to="/complaint">Complaint</Link>
            </li>
            <li>
              <Link to="/results">Results</Link>
            </li>
            <li>
              <Link to="/resetpassword">Reset Password</Link>
            </li>
          </ul>
        </aside>

        <main
          className="addstudent-main"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="addstudent-overlay"></div>

          <div className="addstudent-main-content">
            <h1>Add Student</h1>

            <div className="form-group">
              <label>Add Student :</label>
              <div className="row">
                <span>Student Id</span>
                <input type="text" />
                <button>Add</button>
              </div>
            </div>

            <div className="form-group">
              <label>Add Students in Bulk :</label>
              <div className="row">
                <span>Start Id :</span>
                <input type="text" />
                <span>End Id :</span>
                <input type="text" />
                <button>Add</button>
              </div>
            </div>

            <div className="form-group">
              <label>Delete Students in Bulk :</label>
              <div className="row">
                <span>Start Id :</span>
                <input type="text" />
                <span>End Id :</span>
                <input type="text" />
                <button>Delete</button>
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