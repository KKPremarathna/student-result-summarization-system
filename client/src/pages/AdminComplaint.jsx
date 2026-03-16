import React, { useState } from "react";
import "../styles/AdminComplaint.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";


function Complaint() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "E21 Embedded System",
      message: "Send final senate approved result to Dr. Sanjeewan",
      isRead: false,
    },
    {
      id: 2,
      title: "E20 Computer Architecture",
      message: "Please upload the corrected marks sheet",
      isRead: true,
    },
    {
      id: 3,
      title: "E22 Signals and Systems",
      message: "Need clarification about absent student records",
      isRead: false,
    },
  ]);

  const handleReadToggle = (id) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  };

  return (
    <div className="complaint-page">
      <Navbar />

      <div className="complaint-content">
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/AdminHome">
                <span className="sidebar-icon">🏠</span>
                Admin Home
              </Link>
            </li>
            <li>
              <Link to="/AddUser">
                <span className="sidebar-icon">👤</span>
                Add User
              </Link>
            </li>
            <li className="active">
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

        <main className="complaint-main">
          <div className="complaint-main-content">

            <h1>Complaints</h1>

            <div className="complaint-list">
              {complaints.map((item) => (
                <div
                  className={`complaint-card ${item.isRead ? "read" : ""}`}
                  key={item.id}
                >
                  <div className="complaint-text">
                    <p>
                      <strong>+ {item.title} :</strong>
                    </p>
                    <p>{item.message}</p>
                  </div>

                  <div className="complaint-read">
                    <label>Mark As Read</label>
                    <input
                      type="checkbox"
                      checked={item.isRead}
                      onChange={() => handleReadToggle(item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Complaint;