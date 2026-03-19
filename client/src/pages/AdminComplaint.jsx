import React, { useState, useEffect } from "react";
import "../styles/AdminComplaint.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/admin";

function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/complaints`, { headers: authHeaders });
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      setError("Failed to fetch complaints");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReadToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Resolved" ? "Pending" : "Resolved";
    try {
      const res = await axios.put(`${API_BASE}/complaints/${id}`, { status: newStatus }, { headers: authHeaders });
      if (res.data.success) {
        setComplaints((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  return (
    <div className="complaint-page">
      <Navbar />

      <div className="complaint-content">
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/adminhome">
                <span className="sidebar-icon"></span>
                Admin Home
              </Link>
            </li>
            <li>
              <Link to="/adduser">
                <span className="sidebar-icon"></span>
                Add User
              </Link>
            </li>
            <li className="active">
              <Link to="/admincomplaint">
                <span className="sidebar-icon"></span>
                Complaint
              </Link>
            </li>
            <li >
              <Link to="/adminresults">
                <span className="sidebar-icon"></span>
                Results
              </Link>
            </li>
            <li>
              <Link to="/adminprofile">
                <span className="sidebar-icon"></span>
                Profile
              </Link>
            </li>
          </ul>
        </aside>

        <main className="complaint-main">
          <div className="complaint-main-content">

            <h1>Complaints</h1>

            <div className="complaint-list">
              {loading ? (
                <div className="loading-spinner">Loading complaints...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : complaints.filter(comp => comp.isAdminRecipient).length === 0 ? (
                <div className="no-complaints">No lecturer reports found.</div>
              ) : (
                complaints
                  .filter(comp => comp.isAdminRecipient)
                  .map((item) => (
                    <div
                      className={`complaint-card ${item.status === "Resolved" ? "read" : ""}`}
                      key={item._id}
                    >
                      <div className="complaint-text">
                        <p>
                          <strong>+ {item.title} :</strong>
                        </p>
                        <p>{item.description}</p>
                        <div className="complaint-meta">
                          <p>
                            <strong>From:</strong> {item.lecturerId?.firstName} {item.lecturerId?.lastName} (Lecturer)
                          </p>
                          {item.subjectId && (
                            <p>
                              <strong>Subject:</strong> {item.subjectId.courseCode} - {item.subjectId.courseName}
                            </p>
                          )}
                          <p className="complaint-date">
                            <strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="complaint-read">
                        <label>Mark As Resolved</label>
                        <input
                          type="checkbox"
                          checked={item.status === "Resolved"}
                          onChange={() => handleReadToggle(item._id, item.status)}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Complaint;