import React, { useState, useEffect } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import "../styles/StudentProfile.css";
import { getStudentDetails, updateStudentProfile } from "../services/studentApi";
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
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle
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
    profilePicture: ""
  });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Karun";

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getStudentDetails();
      setUserData(res.data.data);
      setEditForm({
        firstName: res.data.data.firstName || "",
        lastName: res.data.data.lastName || "",
        profilePicture: res.data.data.profilePicture || ""
      });
    } catch (err) {
      console.error("Error fetching student profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      await updateStudentProfile({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setStatus({ loading: false, success: "Password updated successfully!", error: "" });
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      setStatus({ loading: false, success: "", error: msg });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      const res = await updateStudentProfile(editForm);
      setUserData(res.data.data);
      setStatus({ loading: false, success: "Profile updated successfully!", error: "" });
      setTimeout(() => setIsEditModalOpen(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      setStatus({ loading: false, success: "", error: msg });
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="st-loading">
          <Loader2 className="st-loader-icon" />
          <p>Loading profile...</p>
        </div>
      </StudentLayout>
    );
  }

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
                    src={userData?.profilePicture || DEFAULT_AVATAR}
                    alt="Profile"
                    className="st-avatar__img"
                  />
                </div>
                <button className="st-avatar__edit-btn" onClick={() => setIsEditModalOpen(true)}>
                  <Camera size={20} />
                </button>
              </div>

              <h3 className="st-profile__name">{userData?.firstName} {userData?.lastName}</h3>
              <p className="st-profile__role">Engineering Student</p>

              <div className="st-divider" />

              <button 
                onClick={() => setIsEditModalOpen(true)}
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
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <GraduationCap size={12} />
                      Academic Institution
                    </p>
                    <p className="st-info-row__value">Faculty of Engineering, University of Jaffna</p>
                  </div>
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Award size={12} />
                      Index Number
                    </p>
                    <code className="st-info-row__code">
                      {userData?.studentENo || userData?.email?.split('@')[0].toUpperCase()}
                    </code>
                  </div>
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
                <h3 className="st-modal__title">Edit Profile</h3>
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

                  <div className="st-modal__field">
                    <label className="st-modal__label">Profile Picture URL</label>
                    <input 
                      className="st-modal__input"
                      value={editForm.profilePicture}
                      onChange={(e) => setEditForm({...editForm, profilePicture: e.target.value})}
                      placeholder="https://example.com/avatar.png"
                    />
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

        {/* Security / Password Modal */}
        {isModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal-backdrop" onClick={() => !status.loading && setIsModalOpen(false)} />
            <div className="st-modal">
              <button className="st-modal__close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>

              <div className="st-modal__header">
                <div className="st-modal__icon-wrap">
                  <Key size={32} />
                </div>
                <h3 className="st-modal__title">Security Update</h3>
                <p className="st-modal__subtitle">Create a strong password to protect your records</p>
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
                    <input
                      required
                      type="password"
                      className="st-modal__input"
                      placeholder="••••••••"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    />
                  </div>

                  <div className="st-modal__field">
                    <label className="st-modal__label">New Secure Password</label>
                    <input
                      required
                      type="password"
                      className="st-modal__input"
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>

                  <div className="st-modal__submit-wrap">
                    <button type="submit" className="st-modal__submit-btn" disabled={status.loading}>
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
