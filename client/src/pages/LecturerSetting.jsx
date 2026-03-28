import React, { useState, useEffect } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { getLecturerDetails, changeLecturerPassword, updateLecturerProfile } from "../services/lecturerApi.js";
import "../styles/LecturerSetting.css";
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
  Building2,
  Fingerprint,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

function LecturerSetting() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    department: "",
    title: "",
    position: "",
    profilePicture: "",
    lecturerId: ""
  });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

  const fetchUserData = async () => {
    try {
      const res = await getLecturerDetails();
      const data = res.data.data;
      setUserData(data);
      setEditForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        department: data.department || "",
        title: data.title || "",
        position: data.position || "",
        profilePicture: data.profilePicture || "",
        lecturerId: data.lecturerId || ""
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
      await changeLecturerPassword(passwordForm);
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
      const res = await updateLecturerProfile(editForm);
      const updatedUser = res.data.data;
      setUserData(updatedUser);
      
      // Update localStorage to keep session in sync
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedLocalUser = {
        ...localUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profilePicture: updatedUser.profilePicture
      };
      localStorage.setItem("user", JSON.stringify(updatedLocalUser));

      setEditForm({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        department: updatedUser.department || "",
        title: updatedUser.title || "",
        position: updatedUser.position || "",
        profilePicture: updatedUser.profilePicture || "",
        lecturerId: updatedUser.lecturerId || ""
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
      <LecturerLayout>
        <div className="sh-loading">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </LecturerLayout>
    );
  }

  const openEditModal = () => {
    setEditForm({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      department: userData?.department || "",
      title: userData?.title || "",
      position: userData?.position || "",
      profilePicture: userData?.profilePicture || "",
      lecturerId: userData?.lecturerId || ""
    });
    setStatus({ loading: false, success: "", error: "" });
    setImageLoadError(false);
    setIsEditModalOpen(true);
  };

  return (
    <LecturerLayout>
      <div className="st-page">

        {/* Page Header */}
        <header className="st-header">
          <div className="st-breadcrumb">
            <Link to="/lecturer/home">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="st-breadcrumb__current">Settings</span>
          </div>
          <h2 className="st-title">
            <Settings size={32} />
            Account Settings
          </h2>
        </header>

        <div className="st-layout">

          {/* Profile Card */}
          <aside className="st-sidebar">
            <div className="st-profile-card">
              <div className="st-avatar-wrap">
                <div className="st-avatar-ring">
                  <div className="st-avatar">
                    <img
                      src={userData?.profilePicture || DEFAULT_AVATAR}
                      alt="Profile"
                      className="st-avatar__img"
                      onError={handleImageError}
                    />
                  </div>
                </div>
                <button 
                  className="st-avatar__edit-btn"
                  onClick={openEditModal}
                  title="Edit Profile"
                >
                  <Camera size={20} />
                </button>
              </div>

              <h3 className="st-profile__name">
                {userData?.title} {userData?.firstName} {userData?.lastName}
              </h3>
              <p className="st-profile__role">{userData?.position || "Lecturer"}</p>

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
                Security Setup
              </button>
            </div>
          </aside>

          {/* Details Section */}
          <main className="st-details">

            {/* Account Info Card */}
            <div className="st-card">
              <div className="st-card__header">
                <div className="st-card__icon-wrap">
                  <Fingerprint size={24} />
                </div>
                <h3 className="st-card__title">Personal Information</h3>
              </div>

              <div className="st-info-list">
                <div className="st-info-row">
                  <div className="st-info-row__label">
                    <User size={16} /> Display Name
                  </div>
                  <div className="st-info-row__value">
                    {userData?.title ? userData.title + ' ' : ''}{userData?.firstName} {userData?.lastName}
                  </div>
                </div>

                <div className="st-info-row">
                  <div className="st-info-row__label">
                    <Mail size={16} /> Email Address
                  </div>
                  <div className="st-info-row__value">{userData?.email}</div>
                </div>

                <div className="st-info-row">
                  <div className="st-info-row__label">
                    <Building2 size={16} /> Department
                  </div>
                  <div className="st-info-row__value">{userData?.department || "Not Specified"}</div>
                </div>

                <div className="st-info-row">
                  <div className="st-info-row__label">
                    <Shield size={16} /> Lecturer ID
                  </div>
                  <div className="st-info-row__code">
                    {userData?.lecturerId || "Not Set"}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal">
              <button className="st-modal__close" onClick={() => setIsEditModalOpen(false)}>
                <X size={24} />
              </button>
              <div className="st-modal__header">
                <div className="st-modal__icon-wrap">
                  <User size={32} />
                </div>
                <h3 className="st-modal__title">Update Profile</h3>
                <p className="st-modal__subtitle">Manage your personal and academic info</p>
              </div>

              {status.success ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CheckCircle2 size={48} style={{ color: '#16a34a', marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 700, color: 'var(--ls-dark)' }}>{status.success}</p>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate}>
                  {status.error && (
                    <div className="st-status-msg--error">
                      <AlertCircle size={20} />
                      <span>{status.error}</span>
                    </div>
                  )}
                  <div className="st-modal-grid">
                    <div className="st-modal__field">
                      <label className="st-modal__label">Title</label>
                      <select 
                        className="st-modal__input"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      >
                        <option value="">None</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Miss">Miss</option>
                      </select>
                    </div>
                    <div className="st-modal__field">
                      <label className="st-modal__label">Department</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.department}
                        onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="st-modal-grid">
                    <div className="st-modal__field">
                      <label className="st-modal__label">First Name</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="st-modal__field">
                      <label className="st-modal__label">Last Name</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="st-modal-grid">
                    <div className="st-modal__field">
                      <label className="st-modal__label">Lecturer ID</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.lecturerId}
                        onChange={(e) => setEditForm({...editForm, lecturerId: e.target.value})}
                        placeholder="e.g. LEC-CS-1234"
                      />
                    </div>
                    <div className="st-modal__field">
                      <label className="st-modal__label">Position</label>
                      <input 
                        className="st-modal__input"
                        value={editForm.position}
                        onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                        placeholder="Senior Lecturer"
                      />
                    </div>
                  </div>

                  <div className="st-modal__field">
                    <label className="st-modal__label">Profile Picture URL</label>
                    <input 
                      placeholder="https://example.com/image.png"
                      className="st-modal__input"
                      value={editForm.profilePicture}
                      onChange={(e) => {
                        setEditForm({...editForm, profilePicture: e.target.value});
                        setImageLoadError(false);
                      }}
                    />
                  </div>

                  <button type="submit" className="st-modal__submit-btn" disabled={status.loading}>
                    {status.loading ? "Saving Changes..." : "Save Updates"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal Overlay for Password */}
        {isModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal">
              <button
                className="st-modal__close"
                onClick={() => setIsModalOpen(false)}
                disabled={status.loading}
              >
                <X size={24} />
              </button>

              <div className="st-modal__header">
                <div className="st-modal__icon-wrap">
                  <Key size={32} />
                </div>
                <h3 className="st-modal__title">Security Setup</h3>
                <p className="st-modal__subtitle">Ensure your account remains protected</p>
              </div>

              {status.success ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CheckCircle2 size={48} style={{ color: '#16a34a', marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 700, color: 'var(--ls-dark)' }}>{status.success}</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange}>
                  {status.error && (
                    <div className="st-status-msg--error">
                      <AlertCircle size={20} />
                      <span>{status.error}</span>
                    </div>
                  )}
                  <div className="st-modal__field">
                    <label className="st-modal__label">Current Password</label>
                    <div style={{ position: 'relative' }}>
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
                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="st-modal__field">
                    <label className="st-modal__label">New Secure Password</label>
                    <div style={{ position: 'relative' }}>
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
                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="st-modal__submit-btn"
                    disabled={status.loading}
                  >
                    {status.loading ? "Updating..." : "Secure Account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default LecturerSetting;
