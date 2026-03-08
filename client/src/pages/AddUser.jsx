import React from "react";
import "../styles/AddUser.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

function AddUser() {
  return (
    <div className="adduser-page">
      <Navbar />

      <div className="adduser-content">
        {/* Left sidebar */}
        <aside className="adduser-sidebar">

          <h2 className ="sidebar-title">Admin Home page</h2>

          <ul className="sidebar-menu">
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

        {/* Right section */}
        <main
          className="adduser-main"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="adduser-overlay"></div>

          <div className="adduser-main-content">
            <div className="action-buttons">
              <button className="action-btn">Add Student</button>
              <button className="action-btn">Add lecture</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddUser;