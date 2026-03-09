import React, { useState } from "react";
import "../styles/AdminComplaint.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/admin.jpg";

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
        <aside className="adduser-sidebar">
                  <ul className="sidebar-menu">
                      <li>
                      <Link to="/adminhome"> Admin Home</Link>
                      </li>
                    <li >
                      <Link to="/adduser">Add User</Link>
                    </li>
                    <li className="active">
                      <Link to="/AdminComplaint">Complaint</Link>
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
          className="complaint-main"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="complaint-overlay"></div>

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