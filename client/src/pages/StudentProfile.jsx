import React, { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import { getStudentDetails, updateStudentProfile } from "../services/studentApi.js";
import "../styles/StudentProfile.css";
import {
  Settings,
  User,
  Mail,
  Shield,
  Camera,
  Eye,
  EyeOff,
  Key,
  X,
  ChevronRight,
  LayoutDashboard,
  GraduationCap,
  Fingerprint,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Award,
  Phone,
  Calendar
} from "lucide-react";

function StudentProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    faculty: "",
    studentENo: "",
    department: "",
    phone: "",
    dob: "",
    profilePicture: ""
  });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Karun";

  const fetchUserData = async () => {
    try {
      const res = await getStudentDetails();
      const data = res.data.data;
      setUserData(data);
      setEditForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        faculty: data.faculty || "",
        studentENo: data.studentENo || "",
        department: data.department || "",
        phone: data.phone || "",
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
        profilePicture: data.profilePicture || ""
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      await updateStudentProfile(passwordForm);
      setStatus({ loading: false, success: "Password changed successfully!", error: "" });
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password.";
      setStatus({ loading: false, success: "", error: msg });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      const res = await updateStudentProfile(editForm);
      const updatedUser = res.data.data;
      setUserData(updatedUser);
      setEditForm({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        faculty: updatedUser.faculty || "",
        studentENo: updatedUser.studentENo || "",
        department: updatedUser.department || "",
        phone: updatedUser.phone || "",
        dob: updatedUser.dob ? new Date(updatedUser.dob).toISOString().split('T')[0] : "",
        profilePicture: updatedUser.profilePicture || ""
      });
      setStatus({ loading: false, success: "Profile updated successfully!", error: "" });
      setTimeout(() => setIsEditModalOpen(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      setStatus({ loading: false, success: "", error: msg });
    }
  };

  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_AVATAR) {
      setImageLoadError(true);
      e.target.src = DEFAULT_AVATAR;
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="st-loading">
          <Loader2 className="st-loader-icon" />
          <p>Loading profile details...</p>
        </div>
      </StudentLayout>
    );
  }

  const openEditModal = () => {
    setEditForm({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      faculty: userData?.faculty || "",
      studentENo: userData?.studentENo || "",
      department: userData?.department || "",
      phone: userData?.phone || "",
      dob: userData?.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
      profilePicture: userData?.profilePicture || ""
    });
    setStatus({ loading: false, success: "", error: "" });
    setImageLoadError(false);
    setIsEditModalOpen(true);
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
            <span className="st-breadcrumb__current">Account Settings</span>
          </div>
          <h2 className="st-title">
            <Settings size={32} className="st-title__icon" />
            Profile & Security
          </h2>
        </div>

        <div className="st-layout">
          {/* Profile Card */}
          <div className="st-sidebar">
            <div className="st-profile-card">
              <div className="st-avatar-wrap">
                <div className="st-avatar">
                  <img
                    src={userData?.profilePicture || DEFAULT_AVATAR}
                    alt="Profile"
                    className="st-avatar__img"
                    onError={handleImageError}
                  />
                </div>
                <button className="st-avatar__edit-btn" onClick={openEditModal}>
                  <Camera size={20} />
                </button>
              </div>

              <h3 className="st-profile__name">
                {userData?.firstName} {userData?.lastName}
              </h3>
              <p className="st-profile__role">Engineering Student</p>

              <div className="st-divider" />

              <button 
                onClick={openEditModal}
                className="st-profile-btn st-profile-btn--primary"
              >
                <User size={18} />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setStatus({ loading: false, success: "", error: "" });
                  setIsModalOpen(true);
                }}
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
                    <p className="st-info-row__value">{userData?.firstName} {userData?.lastName}</p>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="st-info-row__arrow" 
                    onClick={openEditModal}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Mail size={12} />
                      University Email
                    </p>
                    <p className="st-info-row__value">{userData?.email}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Award size={12} />
                      Index Number
                    </p>
                    <code className="st-info-row__code">{userData?.studentENo || "Not Set"}</code>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="st-info-row__arrow" 
                    onClick={openEditModal}
                  />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <GraduationCap size={12} />
                      Faculty & Department
                    </p>
                    <p className="st-info-row__value">
                      {userData?.faculty || "Not Set"} - {userData?.department || "No Dept"}
                    </p>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="st-info-row__arrow" 
                    onClick={openEditModal}
                  />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Phone size={12} />
                      Contact Number
                    </p>
                    <p className="st-info-row__value">{userData?.phone || "Not Set"}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" onClick={openEditModal} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal-backdrop" onClick={() => !status.loading && setIsEditModalOpen(false)} />
            <div className="st-modal">
              <button className="st-modal__close" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
              <div className="st-modal__header">
                <div className="st-modal__icon-wrap">
                  <User size={32} />
                </div>
                <h3 className="st-modal__title">Update Profile</h3>
                <p className="st-modal__subtitle">Update your personal information</p>
              </div>

              {status.success ? (
                <div className="st-status-msg st-status-msg--success">
                  <CheckCircle2 size={48} />
                  <p>{status.success}</p>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="st-modal__form">
                  {status.error && (
                    <div className="st-status-msg st-status-msg--error">
                      <AlertCircle size={20} />
                      <p>{status.error}</p>
                    </div>
                  )}
                  <div className="st-modal-grid">
                    <div className="st-modal__field">
                      <label className="st-modal__label">First Name</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      />
                    </div>
                    <div className="st-modal__field">
                      <label className="st-modal__label">Last Name</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="st-modal-grid">
                    <div className="st-modal__field">
                      <label className="st-modal__label">Index No</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.studentENo}
                        onChange={(e) => setEditForm({...editForm, studentENo: e.target.value})}
                        placeholder="e.g. 2021/E/162"
                      />
                    </div>
                    <div className="st-modal__field">
                      <label className="st-modal__label">Phone</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="st-modal-grid">
                    <div className="st-modal__field">
                      <label className="st-modal__label">Faculty</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.faculty}
                        onChange={(e) => setEditForm({...editForm, faculty: e.target.value})}
                      />
                    </div>
                    <div className="st-modal__field">
                      <label className="st-modal__label">Department</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.department}
                        onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                        placeholder="e.g. Computing"
                      />
                    </div>
                  </div>

                  <div className="st-modal__field">
                    <label className="st-modal__label">Profile Picture URL</label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <input 
                        placeholder="https://example.com/image.png"
                        className="st-modal__input"
                        value={editForm.profilePicture}
                        onChange={(e) => {
                          setEditForm({...editForm, profilePicture: e.target.value});
                          setImageLoadError(false);
                        }}
                        style={{ flex: 1 }}
                      />
                      {editForm.profilePicture && (
                        <div className="st-avatar" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                          <img 
                            src={editForm.profilePicture} 
                            alt="Preview" 
                            className="st-avatar__img"
                            onError={handleImageError}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="st-modal__submit-wrap">
                    <button type="submit" className="st-modal__submit-btn" disabled={status.loading}>
                      {status.loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal Overlay for Password */}
        {isModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal-backdrop" onClick={() => !status.loading && setIsModalOpen(false)} />

            <div className="st-modal">
              <button
                className="st-modal__close"
                onClick={() => setIsModalOpen(false)}
                disabled={status.loading}
              >
                <X size={20} />
              </button>

              <div className="st-modal__header">
                <div className="st-modal__icon-wrap">
                  <Key size={32} />
                </div>
                <h3 className="st-modal__title">Security Update</h3>
                <p className="st-modal__subtitle">Create a strong password to protect results</p>
              </div>

              {status.success ? (
                <div className="st-status-msg st-status-msg--success">
                  <CheckCircle2 size={48} />
                  <p>{status.success}</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="st-modal__form">
                  {status.error && (
                    <div className="st-status-msg st-status-msg--error">
                      <AlertCircle size={20} />
                      <p>{status.error}</p>
                    </div>
                  )}
                  <div className="st-modal__field">
                    <label className="st-modal__label">Current Password</label>
                    <div className="st-password-wrapper">
                      <input
                        required
                        type={showOldPassword ? "text" : "password"}
                        className="st-modal__input"
                        placeholder="••••••••"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      />
                      <button 
                        type="button"
                        className="st-eye-icon"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="st-modal__field">
                    <label className="st-modal__label">New Secure Password</label>
                    <div className="st-password-wrapper">
                      <input
                        required
                        type={showNewPassword ? "text" : "password"}
                        className="st-modal__input"
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                      <button 
                        type="button"
                        className="st-eye-icon"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="st-modal__submit-wrap">
                    <button 
                      type="submit" 
                      className="st-modal__submit-btn"
                      disabled={status.loading}
                    >
                      {status.loading ? "Updating..." : "Update Security"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentProfile;