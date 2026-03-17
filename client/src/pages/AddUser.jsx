import React from "react";
import "../styles/AddUser.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import adminBg from "../assets/images/admin.jpg";


function AddUser() {
  return (
    <div className="adduser-page">
      <Navbar />

      <div className="adduser-content">
        {/* Left sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li><Link to="/AdminHome"><span className="sidebar-icon"></span>Admin Home</Link></li>
            <li className="active"><Link to="/AddUser"><span className="sidebar-icon"></span>Add User</Link></li>
            <li><Link to="/AdminComplaint"><span className="sidebar-icon"></span>Complaint</Link></li>
            <li><Link to="/AdminResults"><span className="sidebar-icon"></span>Results</Link></li>
            <li><Link to="/AdminProfile"><span className="sidebar-icon"></span>Profile</Link></li>
          </ul>
        </aside>

        {/* Right section */}
        <main className="adduser-main" style={{ backgroundImage: `url(${adminBg})` }}>
          <div className="adduser-main-content">

            <div className="action-buttons">
              <Link to="/addstudent" className="action-btn-link">
                <button className="action-btn">Add Student</button>
              </Link>
              <Link to="/addlecture" className="action-btn-link">
                <button className="action-btn">Add Lecture</button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddUser;