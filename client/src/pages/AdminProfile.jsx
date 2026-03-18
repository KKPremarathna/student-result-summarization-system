import React, { useState, useEffect, useRef } from "react";
import "../styles/AdminResetPassword.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Shield, Eye, EyeOff, Camera, User, Fingerprint } from "lucide-react";

function AdminProfile() {
  const [user, setUser] = useState(null);

  // View/Edit State
  const [isEditing, setIsEditing] = useState(false);

  // Profile Editable Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  // Password Modal Fields
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Session expired. Please login again." });
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchProfile = async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const response = await axios.get("http://localhost:5000/api/user/details", { headers });
      const userData = response.data.data;
      setUser(userData);
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhone(userData.phone || "");
      if (userData.dob) {
        setDob(new Date(userData.dob).toISOString().split('T')[0]);
      }
      setProfilePicture(userData.profilePicture || "");
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load profile details" });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = {
        firstName,
        lastName,
        phone,
        dob,
        profilePicture
      };

      await axios.put("http://localhost:5000/api/user/update-profile", payload, { headers });

      // Update local storage user if name changed
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localUser.firstName = firstName;
      localUser.lastName = lastName;
      localStorage.setItem("user", JSON.stringify(localUser));

      fetchProfile();
      setIsEditing(false); // Switch back to view mode on success
    } catch (error) {
      let errorMsg = error.response?.data?.message || "Failed to update profile.";
      if (typeof errorMsg === 'object') errorMsg = JSON.stringify(errorMsg);
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setPasswordMessage({ type: "", text: "" });
    try {
      const payload = { newPassword };
      await axios.put("http://localhost:5000/api/user/update-profile", payload, { headers });
      setPasswordMessage({ type: "success", text: "Password successfully updated!" });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      let errorMsg = error.response?.data?.message || "Failed to update password.";
      if (typeof errorMsg === 'object') errorMsg = JSON.stringify(errorMsg);
      setPasswordMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatar = () => {
    if (profilePicture && profilePicture !== "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png") {
      return <img src={profilePicture} alt="Profile Avatar" className="avatar-image" />;
    }

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

    if (!firstInitial && !lastInitial) {
      return <div className="avatar-image" style={{ backgroundColor: '#008080' }}>A</div>;
    }

    return <div className="avatar-image">{firstInitial}{lastInitial}</div>;
  };

  return (
    <div className="reset-page">
      <Navbar />

      <div className="reset-content">
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            <li><Link to="/adminhome"><span className="sidebar-icon"></span>Admin Home</Link></li>
            <li><Link to="/adduser"><span className="sidebar-icon"></span>Add User</Link></li>
            <li><Link to="/admincomplaint"><span className="sidebar-icon"></span>Complaint</Link></li>
            <li><Link to="/adminresults"><span className="sidebar-icon"></span>Results</Link></li>
            <li className="active"><Link to="/adminprofile"><span className="sidebar-icon"></span>Profile</Link></li>
          </ul>
        </aside>

        <main className="reset-main">
          <div className="profile-container">

            {/* LEFT COLUMN: AVATAR & QUICK ACTIONS */}
            <div className="profile-left-column">
              <div className="avatar-wrapper">
                {renderAvatar()}
                <button className="avatar-edit-btn" onClick={() => fileInputRef.current.click()} title="Change Photo">
                  <Camera size={16} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoChange} />
              </div>

              <div className="profile-name">
                {firstName || lastName ? `${firstName} ${lastName}` : "Admin User"}
              </div>
              <div className="profile-role">Systems Administrator</div>

              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <User size={18} />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>

            {/* RIGHT COLUMN: INFORMATION & SECURITY */}
            <div className="profile-right-column">

              {message.text && (
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: message.type === 'error' ? '#f8d7da' : '#d4edda', color: message.type === 'error' ? '#721c24' : '#155724', fontWeight: 'bold' }}>
                  {message.text}
                </div>
              )}

              {/* INFO CARD */}
              <div className="info-card">
                <div className="info-card-header">
                  <Fingerprint size={24} color="#0f2c29" />
                  Personal Information
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="info-row">
                      <label className="info-label">FIRST NAME</label>
                      <input type="text" className="info-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="info-row">
                      <label className="info-label">LAST NAME</label>
                      <input type="text" className="info-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="info-row">
                      <label className="info-label">EMAIL ADDRESS</label>
                      <input type="email" className="info-input" value={user?.email || ""} readOnly style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
                    </div>
                    <div className="info-row">
                      <label className="info-label">PHONE NUMBER</label>
                      <input type="text" className="info-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="info-row">
                      <label className="info-label">DATE OF BIRTH</label>
                      <input type="date" className="info-input" value={dob} onChange={(e) => setDob(e.target.value)} required />
                    </div>
                    <button type="submit" className="save-profile-btn" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                ) : (
                  <div>
                    <div className="info-row">
                      <div className="info-label">DISPLAY NAME</div>
                      <div className="info-value">{firstName || lastName ? `${firstName} ${lastName}` : "Not Set"}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">EMAIL ADDRESS</div>
                      <div className="info-value">{user?.email || "Loading..."}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">PHONE NUMBER</div>
                      <div className="info-value">{phone || "Not Set"}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">DATE OF BIRTH</div>
                      <div className="info-value">{dob || "Not Set"}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECURITY CARD */}
              <div className="security-card">
                <div className="security-icon">
                  <Shield size={32} />
                </div>
                <div className="security-text">
                  Protect your academic account using encrypted authentication methods and two-factor verification.
                </div>
                <button className="manage-password-btn" onClick={() => setShowPasswordModal(true)}>
                  Manage Passwords
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Password Reset Modal Overlay */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Change Password</h2>

            {passwordMessage.text && (
              <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', backgroundColor: passwordMessage.type === 'error' ? '#f8d7da' : '#d4edda', color: passwordMessage.type === 'error' ? '#721c24' : '#155724', fontSize: '14px', fontWeight: 'bold' }}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#588b83', letterSpacing: '1px' }}>NEW PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <div className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#588b83', letterSpacing: '1px' }}>CONFIRM NEW PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ padding: '10px 20px', backgroundColor: '#89a8a1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#0f2c29', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {loading ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
