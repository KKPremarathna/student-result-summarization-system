import React, { useState, useEffect } from "react";
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
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

function StudentProfile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    faculty: "",
    studentENo: "",
    degree: ""
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Password Update State
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, success: "", error: "" });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    faculty: "",
    studentENo: "",
    degree: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const extractRegNoFromEmail = (email) => {
    if (!email) return "";
    const match = email.match(/^(\d{4}e\d{3})@/i);
    return match ? match[1] : "";
  };

  const formatRegNo = (value) => {
    if (!value) return "";
    const cleaned = value.replace(/[^0-9eE]/g, "").toUpperCase();
    const match = cleaned.match(/^(\d{4})E(\d{3})$/);
    if (!match) return value;
    return `${match[1]}/E/${match[2]}`;
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to load profile details.");
      }

      const data = res.data;
      const rawENo = data.studentENo || extractRegNoFromEmail(data.email);

      const profile = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        faculty: data.faculty || "Faculty of Engineering",
        studentENo: formatRegNo(rawENo) || "N/A",
        degree: data.degree || "B.Sc. (Hons) in Engineering"
      };

      setUserData(profile);
      setEditForm(profile);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setStatus({ type: "error", message: err.message || "Failed to load profile details." });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to update profile.");
      }

      setUserData(editForm);
      setStatus({ type: "success", message: "Profile updated successfully!" });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      setStatus({ type: "error", message: err.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to update password.");
      }

      setStatus({ type: "success", message: "Password updated successfully!" });
      setIsModalOpen(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error("Password update failed", err);
      setStatus({ type: "error", message: err.message || "Failed to update password." });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({ ...userData });
    setIsEditModalOpen(true);
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
          <div className="st-sidebar">
            <div className="st-profile-card">
              <div className="st-avatar-wrap">
                <div className="st-avatar">
                  {loading && !userData.firstName ? (
                    <div className="st-loader-wrap">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName || "Student"}`}
                      alt="Profile"
                      className="st-avatar__img"
                    />
                  )}
                </div>
                <button className="st-avatar__edit-btn" onClick={openEditModal}>
                  <Camera size={20} />
                </button>
              </div>

              <h3 className="st-profile__name">{userData.firstName} {userData.lastName}</h3>
              <p className="st-profile__role">Engineering Student</p>

              <div className="st-divider" />

              <button
                onClick={openEditModal}
                className="st-profile-btn st-profile-btn--primary"
                disabled={loading}
              >
                <User size={18} />
                Edit Profile
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="st-profile-btn st-profile-btn--outline"
              >
                <Key size={18} />
                Security Access
              </button>
            </div>
          </div>

          <div className="st-content-main">
            {status.message && (
              <div className={`st-status-bar ${status.type}`}>
                {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}

            <div className="st-card">
              <div className="st-card__header">
                <div className="st-card__icon-wrap">
                  <Fingerprint size={24} />
                </div>
                <h3 className="st-card__title">Profile Information</h3>
              </div>

              <div className="st-info-list">
                <div className="st-info-row" onClick={openEditModal}>
                  <div>
                    <p className="st-info-row__label">
                      <User size={12} />
                      Full Name
                    </p>
                    <p className="st-info-row__value">{userData.firstName} {userData.lastName}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Mail size={12} />
                      University Email
                    </p>
                    <p className="st-info-row__value">{userData.email}</p>
                  </div>
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row" onClick={openEditModal}>
                  <div>
                    <p className="st-info-row__label">
                      <GraduationCap size={12} />
                      Faculty
                    </p>
                    <p className="st-info-row__value">{userData.faculty}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row" onClick={openEditModal}>
                  <div>
                    <p className="st-info-row__label">
                      <Award size={12} />
                      Index Number
                    </p>
                    <code className="st-info-row__code">{userData.studentENo}</code>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row" onClick={openEditModal}>
                  <div>
                    <p className="st-info-row__label">
                      <BookOpen size={12} />
                      Degree Program
                    </p>
                    <p className="st-info-row__value">{userData.degree}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>
              </div>
            </div>

            <div className="st-privacy-card">
              <div className="st-privacy-card__blob" />
              <div className="st-privacy-card__body">
                <div className="st-privacy-card__heading">
                  <Shield size={28} />
                  <h4 className="st-privacy-card__title">Privacy & Security</h4>
                </div>
                <p className="st-privacy-card__text">
                  Customize your credential protection and secondary verification methods.
                  Keep your academic records secure.
                </p>
                <button onClick={() => setIsModalOpen(true)} className="st-privacy-btn">
                  Manage Security
                </button>
              </div>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal-backdrop" onClick={() => !loading && setIsEditModalOpen(false)} />
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

              <form onSubmit={handleProfileUpdate} className="st-modal__form">
                <div className="st-modal-grid">
                  <div className="st-modal__field">
                    <label className="st-modal__label">First Name</label>
                    <input
                      className="st-modal__input"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="st-modal__field">
                    <label className="st-modal__label">Last Name</label>
                    <input
                      className="st-modal__input"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="st-modal__field">
                  <label className="st-modal__label">University Email</label>
                  <input
                    className="st-modal__input"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="st-modal-grid">
                  <div className="st-modal__field">
                    <label className="st-modal__label">Index Number</label>
                    <input
                      className="st-modal__input"
                      value={editForm.studentENo}
                      onChange={(e) => setEditForm({ ...editForm, studentENo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="st-modal__field">
                    <label className="st-modal__label">Faculty</label>
                    <input
                      className="st-modal__input"
                      value={editForm.faculty}
                      onChange={(e) => setEditForm({ ...editForm, faculty: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="st-modal__field">
                  <label className="st-modal__label">Degree Program</label>
                  <input
                    className="st-modal__input"
                    value={editForm.degree}
                    onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                    required
                  />
                </div>

                <div className="st-modal__submit-wrap">
                  <button type="submit" className="st-modal__submit-btn" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="st-modal-overlay">
            <div className="st-modal-backdrop" onClick={() => !loading && setIsModalOpen(false)} />
            <div className="st-modal">
              <button className="st-modal__close" onClick={() => setIsModalOpen(false)}>
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