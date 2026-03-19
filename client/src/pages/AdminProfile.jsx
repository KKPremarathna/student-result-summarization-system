import React, { useState, useEffect, useRef } from "react";
import "../styles/AdminProfile.css";
import Navbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Camera, 
  User, 
  Fingerprint, 
  Mail, 
  Phone, 
  Calendar, 
  Key, 
  X, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Modal visibility
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Profile Form State
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    profilePicture: ""
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/user/details", getHeaders());
      const userData = response.data.data;
      setUser(userData);
      setEditForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
        profilePicture: userData.profilePicture || ""
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setStatusMsg({ type: "error", text: "Failed to load profile details" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      await axios.put("http://localhost:5000/api/user/update-profile", editForm, getHeaders());
      
      // Update local storage user
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localUser.firstName = editForm.firstName;
      localUser.lastName = editForm.lastName;
      localStorage.setItem("user", JSON.stringify(localUser));

      await fetchProfile();
      setStatusMsg({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => {
        setShowEditModal(false);
        setStatusMsg({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      setStatusMsg({ type: "error", text: error.response?.data?.message || "Failed to update profile" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatusMsg({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setUpdateLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      await axios.put("http://localhost:5000/api/user/update-profile", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }, getHeaders());

      setStatusMsg({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowSecurityModal(false);
        setStatusMsg({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      setStatusMsg({ type: "error", text: error.response?.data?.message || "Failed to change password" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="ad-page">
        <Navbar />
        <div className="st-loading">
          <Loader2 className="st-loader-icon" size={48} />
          <p>Loading Administrator Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-page">
      <Navbar />

      <div className="ad-content">
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

        <main className="ad-main">
          <div className="profile-container">
            {/* Sidebar Profile Card */}
            <div className="ad-profile-card">
              <div className="ad-avatar-wrap">
                <div className="ad-avatar">
                  {editForm.profilePicture ? (
                    <img src={editForm.profilePicture} alt="Profile" className="ad-avatar__img" />
                  ) : (
                    user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : "A"
                  )}
                </div>
                <button className="ad-avatar__edit-btn" onClick={() => fileInputRef.current.click()} title="Change Photo">
                  <Camera size={18} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </div>

              <h2 className="ad-profile__name">{user?.firstName} {user?.lastName}</h2>
              <p className="ad-profile__role">Systems Administrator</p>
              
              <div className="ad-divider"></div>

              <button className="ad-profile-btn ad-profile-btn--primary" onClick={() => setShowEditModal(true)}>
                <User size={20} />
                Update Profile
              </button>
              <button className="ad-profile-btn ad-profile-btn--primary" onClick={() => setShowSecurityModal(true)}>
                <Shield size={20} />
                Security Access
              </button>
            </div>

            {/* Main Content Details */}
            <div className="ad-details">
              <div className="ad-card">
                <div className="ad-card__header">
                  <div className="ad-card__icon-wrap">
                    <Fingerprint size={24} />
                  </div>
                  <h3 className="ad-card__title">Personal Information</h3>
                </div>

                <div className="ad-info-list">
                  <div className="ad-info-row">
                    <span className="ad-info-row__label"><User size={14} /> Full Name</span>
                    <span className="ad-info-row__value">{user?.firstName} {user?.lastName}</span>
                    <ChevronRight className="ad-info-row__arrow" size={18} />
                  </div>
                  <div className="ad-info-row">
                    <span className="ad-info-row__label"><Mail size={14} /> Email Address</span>
                    <span className="ad-info-row__value">{user?.email}</span>
                    <ChevronRight className="ad-info-row__arrow" size={18} />
                  </div>
                  <div className="ad-info-row">
                    <span className="ad-info-row__label"><Phone size={14} /> Contact Number</span>
                    <span className="ad-info-row__value">{user?.phone || "Not Set"}</span>
                    <ChevronRight className="ad-info-row__arrow" size={18} />
                  </div>
                  <div className="ad-info-row">
                    <span className="ad-info-row__label"><Calendar size={14} /> Date of Birth</span>
                    <span className="ad-info-row__value">{editForm.dob || "Not Set"}</span>
                    <ChevronRight className="ad-info-row__arrow" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="st-modal-overlay">
          <div className="st-modal">
            <button className="st-modal__close" onClick={() => setShowEditModal(false)}>
              <X size={20} />
            </button>
            <div className="st-modal__header">
              <div className="st-modal__icon-wrap">
                <User size={32} />
              </div>
              <h2 className="st-modal__title">Update Profile</h2>
              <p className="st-modal__subtitle">Update your personal information</p>
            </div>

            {statusMsg.text && (
              <div className={`st-status-msg st-status-msg--${statusMsg.type}`}>
                {statusMsg.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {statusMsg.text}
              </div>
            )}

            <form className="st-modal__form" onSubmit={handleProfileUpdate}>
              <div className="st-modal-grid">
                <div className="st-modal__field">
                  <label className="st-modal__label">First Name</label>
                  <input 
                    type="text" 
                    className="st-modal__input" 
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="st-modal__field">
                  <label className="st-modal__label">Last Name</label>
                  <input 
                    type="text" 
                    className="st-modal__input" 
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="st-modal-grid">
                <div className="st-modal__field">
                  <label className="st-modal__label">Phone Number</label>
                  <input 
                    type="text" 
                    className="st-modal__input" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                <div className="st-modal__field">
                  <label className="st-modal__label">Date of Birth</label>
                  <input 
                    type="date" 
                    className="st-modal__input" 
                    value={editForm.dob}
                    onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                  />
                </div>
              </div>
              <div className="st-modal__field">
                <label className="st-modal__label">Profile Picture URL</label>
                <input 
                  type="text" 
                  className="st-modal__input" 
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm({...editForm, profilePicture: e.target.value})}
                />
              </div>

              <button className="st-modal-submit-btn" type="submit" disabled={updateLoading}>
                {updateLoading ? <Loader2 className="st-loader-icon" size={20} /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="st-modal-overlay">
          <div className="st-modal">
            <button className="st-modal__close" onClick={() => setShowSecurityModal(false)}>
              <X size={20} />
            </button>
            <div className="st-modal__header">
              <div className="st-modal__icon-wrap">
                <Key size={32} />
              </div>
              <h2 className="st-modal__title">Security Update</h2>
              <p className="st-modal__subtitle">Secure your administrator account</p>
            </div>

            {statusMsg.text && (
              <div className={`st-status-msg st-status-msg--${statusMsg.type}`}>
                {statusMsg.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {statusMsg.text}
              </div>
            )}

            <form className="st-modal__form" onSubmit={handlePasswordChange}>
              <div className="st-modal__field">
                <label className="st-modal__label">Current Password</label>
                <div className="st-password-wrapper">
                  <input 
                    type={showOldPass ? "text" : "password"} 
                    className="st-modal__input" 
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    required
                  />
                  <button type="button" className="st-eye-icon" onClick={() => setShowOldPass(!showOldPass)}>
                    {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="st-modal__field">
                <label className="st-modal__label">New Password</label>
                <div className="st-password-wrapper">
                  <input 
                    type={showNewPass ? "text" : "password"} 
                    className="st-modal__input" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                  />
                  <button type="button" className="st-eye-icon" onClick={() => setShowNewPass(!showNewPass)}>
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="st-modal__field">
                <label className="st-modal__label">Confirm New Password</label>
                <div className="st-password-wrapper">
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    className="st-modal__input" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                  />
                  <button type="button" className="st-eye-icon" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="st-modal-submit-btn" type="submit" disabled={updateLoading}>
                {updateLoading ? <Loader2 className="st-loader-icon" size={20} /> : "Update Security"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
