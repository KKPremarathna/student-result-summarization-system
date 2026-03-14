import React, { useState } from "react";
import "../styles/AdminResetPassword.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";


function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // temporary frontend-only admin data
  const adminName = "Mrs K.B Ranathunga";

  const handleUpdate = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated successfully");
  };

  return (
    <div className="reset-page">
      <Navbar />

      <div className="reset-content">
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
            <li className="active">
              <Link to="/AdminResetPassword">
                <span className="sidebar-icon">🔒</span>
                Reset Password
              </Link>
            </li>
          </ul>
        </aside>

        <main className="reset-main">
          <div className="reset-main-content">

            <div className="profile-section">
              <div className="profile-icon">👤</div>
              <span className="edit-text">Edit</span>
            </div>

            <div className="admin-info">
              <p>
                <span>Name :</span> {adminName}
              </p>
            </div>

            <form className="reset-form" onSubmit={handleUpdate}>
              <div className="form-row">
                <label>New Password :</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Confirm Password :</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="btn-row">
                <button type="submit" className="update-btn">
                  Update
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResetPassword;