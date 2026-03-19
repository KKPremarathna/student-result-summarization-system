import React, { useState } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/StudentProfile.css";
import {
  Settings,
  User,
  Mail,
  Shield,
  Camera,
  Key,
  X,
  ChevronRight,
  LayoutDashboard,
  GraduationCap,
  Fingerprint,
  Award,
  BookOpen
} from "lucide-react";

function StudentProfile() {
  const [userData, setUserData] = useState({
    name: "Karunarathna K.P.S",
    email: "kps.karunarathna@std.uok.lk",
    faculty: "Faculty of Engineering",
    indexNumber: "2021/E/162",
    degree: "B.Sc. (Hons) in Engineering"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Password Update State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, success: "", error: "" });

  const handleEditToggle = () => {
    if (isEditing) {
      setUserData(editedData);
    } else {
      setEditedData({ ...userData });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, success: "", error: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ loading: false, success: "", error: "New passwords do not match." });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordStatus({ loading: false, success: "Password updated successfully!", error: "" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setIsModalOpen(false), 2000);
      } else {
        setPasswordStatus({ loading: false, success: "", error: data.message || "Failed to update password." });
      }
    } catch (err) {
      setPasswordStatus({ loading: false, success: "", error: "Connection error. Please try again." });
    }
  };

  return (
    <StudentLayout>
      <div className="st-page">

        {/* Page Header */}
        <div className="st-header">
          <div className="st-breadcrumb">
            <LayoutDashboard size={14} />
            <span>Student Portal</span>
            <ChevronRight size={14} />
            <span className="st-breadcrumb__current">Profile Settings</span>
          </div>
          <h2 className="st-title">
            <Settings size={32} className="st-title__icon" />
            Account & Profile
          </h2>
        </div>

        <div className="st-layout">

          {/* Profile Card */}
          <div className="st-sidebar">
            <div className="st-profile-card">
              <div className="st-avatar-wrap">
                <div className="st-avatar">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Karun"
                    alt="Profile"
                    className="st-avatar__img"
                  />
                </div>
                <button className="st-avatar__edit-btn">
                  <Camera size={20} />
                </button>
              </div>

              <h3 className="st-profile__name">{userData.name}</h3>
              <p className="st-profile__role">Engineering Student</p>

              <div className="st-divider" />

              <button 
                onClick={handleEditToggle}
                className={`st-profile-btn ${isEditing ? 'st-profile-btn--success' : 'st-profile-btn--primary'}`}
              >
                {isEditing ? <Fingerprint size={18} /> : <User size={18} />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
              
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="st-profile-btn st-profile-btn--cancel"
                >
                  <X size={18} />
                  Cancel
                </button>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                className="st-profile-btn st-profile-btn--outline"
              >
                <Key size={18} />
                Security Access
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="st-details">

            {/* Personal Information Card */}
            <div className="st-card">
              <div className="st-card__header">
                <div className="st-card__icon-wrap">
                  <Fingerprint size={24} />
                </div>
                <h3 className="st-card__title">Personal Information</h3>
              </div>

              <div className="st-info-list">
                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <User size={12} />
                      Full Name
                    </p>
                    {isEditing ? (
                      <input
                        name="name"
                        value={editedData.name}
                        onChange={handleChange}
                        className="st-info-input"
                      />
                    ) : (
                      <p className="st-info-row__value">{userData.name}</p>
                    )}
                  </div>
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Mail size={12} />
                      University Email
                    </p>
                    {isEditing ? (
                      <input
                        name="email"
                        value={editedData.email}
                        onChange={handleChange}
                        className="st-info-input"
                      />
                    ) : (
                      <p className="st-info-row__value">{userData.email}</p>
                    )}
                  </div>
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <GraduationCap size={12} />
                      Faculty
                    </p>
                    {isEditing ? (
                      <input
                        name="faculty"
                        value={editedData.faculty}
                        onChange={handleChange}
                        className="st-info-input"
                      />
                    ) : (
                      <p className="st-info-row__value">{userData.faculty}</p>
                    )}
                  </div>
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Award size={12} />
                      Index Number
                    </p>
                    {isEditing ? (
                      <input
                        name="indexNumber"
                        value={editedData.indexNumber}
                        onChange={handleChange}
                        className="st-info-input st-info-input--mono"
                      />
                    ) : (
                      <code className="st-info-row__code">
                        {userData.indexNumber}
                      </code>
                    )}
                  </div>
                </div>
                
                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <BookOpen size={12} />
                      Degree Program
                    </p>
                    {isEditing ? (
                      <input
                        name="degree"
                        value={editedData.degree}
                        onChange={handleChange}
                        className="st-info-input"
                      />
                    ) : (
                      <p className="st-info-row__value">{userData.degree}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="st-privacy-card">
              <div className="st-privacy-card__blob" />
              <div className="st-privacy-card__body">
                <div className="st-privacy-card__heading">
                  <Shield size={28} />
                  <h4 className="st-privacy-card__title">Privacy & Security</h4>
                </div>
                <p className="st-privacy-card__text">
                  Customize your credential protection and secondary verification methods. Keep your academic records secure.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="st-privacy-btn"
                >
                  Manage Security
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal-backdrop" onClick={() => setIsModalOpen(false)} />

            <div className="st-modal">
              <button
                className="st-modal__close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>

              <div className="st-modal__header">
                <div className="st-modal__icon-wrap">
                  <Key size={32} />
                </div>
                <h3 className="st-modal__title">Update Password</h3>
                <p className="st-modal__subtitle">Ensure your account is protected with a strong password</p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="st-modal__form">
                {passwordStatus.error && <p className="st-error-msg">{passwordStatus.error}</p>}
                {passwordStatus.success && <p className="st-success-msg">{passwordStatus.success}</p>}
                
                <div className="st-modal__field">
                  <label className="st-modal__label">Current Password</label>
                  <input
                    required
                    type="password"
                    className="st-modal__input"
                    placeholder="••••••••"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  />
                </div>

                <div className="st-modal__field">
                  <label className="st-modal__label">New Password</label>
                  <input
                    required
                    type="password"
                    className="st-modal__input"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>

                <div className="st-modal__field">
                  <label className="st-modal__label">Confirm New Password</label>
                  <input
                    required
                    type="password"
                    className="st-modal__input"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>

                <div className="st-modal__submit-wrap">
                  <button type="submit" className="st-modal__submit-btn" disabled={passwordStatus.loading}>
                    {passwordStatus.loading ? "Updating..." : "Update Security"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentProfile;
