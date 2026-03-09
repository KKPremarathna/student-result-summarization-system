import React from "react";
import "../styles/AdminHome.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg";
import { Link } from "react-router-dom";

function AdminHome() {
  return (
    <div className="admin-page">
      <Navbar/>

      <div className="admin-content">
        {/* Left sidebar */}
        <aside className="admin-sidebar">
          <ul className="sidebar-menu">
            <li className="active">
            <Link to="/adminhome"> Admin Home</Link>
            </li>
            <li>
            <Link to="/adduser">Add User</Link>
            </li>
            <li>Complaint</li>
            <li>Results</li>
            <li>Reset Password</li>
          </ul>
        </aside>

        {/* Right main section */}
        <main
          className="admin-main"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* transparent rectangle overlay */}
          <div className="admin-overlay"></div>

          <div className="admin-main-content">
            <div className="welcome-box">
              <h1>Welcome</h1>
              <h2>Mrs K.B Ranathunga !</h2>
              <p className="admin-email">admin@academet.com</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <p>4200</p>
              </div>

              <div className="stat-card">
                <h3>Total Lectures</h3>
                <p>67</p>
              </div>

              <div className="stat-card">
                <h3>Total Courses</h3>
                <p>220</p>
              </div>

              <div className="stat-card">
                <h3>Total Emails</h3>
                <p>23</p>
              </div>

              <div className="stat-card">
                <h3>Total Complaints</h3>
                <p>06</p>
              </div>

              <div className="stat-card">
                <h3>Add | Update Delete Notice</h3>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminHome;