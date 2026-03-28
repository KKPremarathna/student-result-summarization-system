import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminProfile.css";
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
  AlertCircle,
  Settings,
  ShieldCheck,
  Smartphone
} from "lucide-react";

function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    profilePicture: ""
  });

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
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedLocalUser = {
        ...localUser,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        profilePicture: editForm.profilePicture
      };
      localStorage.setItem("user", JSON.stringify(updatedLocalUser));

      await fetchProfile();
      setStatusMsg({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setShowEditModal(false), 2000);
    } catch (error) {
      setStatusMsg({ type: "error", text: error.response?.data?.message || "Update failed" });
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

      setStatusMsg({ type: "success", text: "Security credentials updated!" });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setShowSecurityModal(false), 2000);
    } catch (error) {
      setStatusMsg({ type: "error", text: error.response?.data?.message || "Update failed" });
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
      <AdminLayout>
        <div className="ap-loading">
          <Loader2 className="animate-spin" size={48} />
          <p>Syncing account data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="ap-page">
        <header className="ap-header">
           <div className="ap-header-left">
              <div className="ap-breadcrumb">
                 <Settings size={14} />
                 <span>Account</span>
                 <ChevronRight size={14} />
                 <span className="ap-breadcrumb-current">Settings & Profile</span>
              </div>
              <h1 className="ap-title">Identity Manager</h1>
           </div>
        </header>

        <div className="ap-grid">
           {/* Left Column: Identity Card */}
           <div className="ap-id-section">
              <div className="ap-card ap-id-card">
                 <div className="ap-avatar-container">
                    <div className="ap-avatar">
                       {editForm.profilePicture ? (
                         <img src={editForm.profilePicture} alt="Profile" />
                       ) : (
                         <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                       )}
                    </div>
                    <button className="ap-avatar-edit" onClick={() => fileInputRef.current.click()}>
                       <Camera size={16} />
                    </button>
                    <input type="file" hidden ref={fileInputRef} onChange={handlePhotoUpload} />
                 </div>
                 
                 <div className="ap-id-info">
                    <h2>{user?.firstName} {user?.lastName}</h2>
                    <p>Systems Administrator</p>
                    <div className="ap-badge-list">
                       <span className="ap-badge">Root Admin</span>
                       <span className="ap-badge success">Verified</span>
                    </div>
                 </div>

                 <div className="ap-card-actions">
                    <button className="ap-btn-primary full" onClick={() => setShowEditModal(true)}>
                       <User size={18} /> Edit Personal Info
                    </button>
                    <button className="ap-btn-secondary full" onClick={() => setShowSecurityModal(true)}>
                       <ShieldCheck size={18} /> Credentials & Access
                    </button>
                 </div>
              </div>

              <div className="ap-security-hint">
                 <Shield size={20} />
                 <p>Your session is protected by 256-bit encryption. Keep your credentials private.</p>
              </div>
           </div>

           {/* Right Column: Details List */}
           <div className="ap-details-section">
              <div className="ap-card">
                 <div className="ap-card-header">
                    <Fingerprint size={20} />
                    <h3>Contact & Personal Details</h3>
                 </div>
                 
                 <div className="ap-detail-list">
                    <div className="ap-detail-item">
                       <div className="ap-detail-icon"><User size={18}/></div>
                       <div className="ap-detail-content">
                          <label>Legal Name</label>
                          <span>{user?.firstName} {user?.lastName}</span>
                       </div>
                       <ChevronRight size={18} className="ap-detail-arrow" />
                    </div>

                    <div className="ap-detail-item">
                       <div className="ap-detail-icon"><Mail size={18}/></div>
                       <div className="ap-detail-content">
                          <label>Work Email</label>
                          <span>{user?.email}</span>
                       </div>
                       <ChevronRight size={18} className="ap-detail-arrow" />
                    </div>

                    <div className="ap-detail-item">
                       <div className="ap-detail-icon"><Smartphone size={18}/></div>
                       <div className="ap-detail-content">
                          <label>Phone Number</label>
                          <span>{user?.phone || "Not configured"}</span>
                       </div>
                       <ChevronRight size={18} className="ap-detail-arrow" />
                    </div>

                    <div className="ap-detail-item">
                       <div className="ap-detail-icon"><Calendar size={18}/></div>
                       <div className="ap-detail-content">
                          <label>Birth Date</label>
                          <span>{editForm.dob || "Not configured"}</span>
                       </div>
                       <ChevronRight size={18} className="ap-detail-arrow" />
                    </div>
                 </div>
              </div>

              <div className="ap-audit-card">
                 <div className="ap-audit-header">
                    <h3>Recent Access Logs</h3>
                 </div>
                 <div className="ap-audit-row">
                    <span>IP Address</span>
                    <span className="mono">192.168.1.45</span>
                 </div>
                 <div className="ap-audit-row">
                    <span>Last Login</span>
                    <span>Today, 10:45 AM</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="ap-modal-overlay">
          <div className="ap-modal">
            <div className="ap-modal-header">
               <div>
                  <h3>Update Identity</h3>
                  <p>Change your public information</p>
               </div>
               <button className="ap-modal-close" onClick={() => setShowEditModal(false)}><X size={20}/></button>
            </div>
            
            <form className="ap-modal-body" onSubmit={handleProfileUpdate}>
               {statusMsg.text && (
                 <div className={`ap-modal-alert ${statusMsg.type}`}>
                    {statusMsg.type === "success" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                    {statusMsg.text}
                 </div>
               )}

               <div className="ap-modal-grid">
                  <div className="ap-input-group">
                     <label>First Name</label>
                     <input value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} required />
                  </div>
                  <div className="ap-input-group">
                     <label>Last Name</label>
                     <input value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} required />
                  </div>
               </div>

               <div className="ap-modal-grid">
                  <div className="ap-input-group">
                     <label>Phone</label>
                     <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  </div>
                  <div className="ap-input-group">
                     <label>DOB</label>
                     <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
                  </div>
               </div>

               <div className="ap-modal-footer">
                  <button type="button" className="ap-btn-secondary" onClick={() => setShowEditModal(false)}>Discard</button>
                  <button type="submit" className="ap-btn-primary" disabled={updateLoading}>
                     {updateLoading ? <Loader2 className="animate-spin" size={18}/> : "Save Profile"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="ap-modal-overlay">
          <div className="ap-modal">
            <div className="ap-modal-header">
               <div>
                  <h3>Vault Update</h3>
                  <p>Secure your administrator credentials</p>
               </div>
               <button className="ap-modal-close" onClick={() => setShowSecurityModal(false)}><X size={20}/></button>
            </div>
            
            <form className="ap-modal-body" onSubmit={handlePasswordChange}>
               {statusMsg.text && (
                 <div className={`ap-modal-alert ${statusMsg.type}`}>
                    {statusMsg.type === "success" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                    {statusMsg.text}
                 </div>
               )}

               <div className="ap-input-group">
                  <label>Current Vault Key</label>
                  <div className="ap-pass-box">
                     <input type={showOldPass ? "text" : "password"} value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} required />
                     <button type="button" onClick={() => setShowOldPass(!showOldPass)}>{showOldPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
               </div>

               <div className="ap-input-group">
                  <label>New Secret Key</label>
                  <div className="ap-pass-box">
                     <input type={showNewPass ? "text" : "password"} value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required />
                     <button type="button" onClick={() => setShowNewPass(!showNewPass)}>{showNewPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
               </div>

               <div className="ap-input-group">
                  <label>Re-verify New Key</label>
                  <div className="ap-pass-box">
                     <input type={showConfirmPass ? "text" : "password"} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required />
                     <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}>{showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                  </div>
               </div>

               <div className="ap-modal-footer">
                  <button type="button" className="ap-btn-secondary" onClick={() => setShowSecurityModal(false)}>Discard</button>
                  <button type="submit" className="ap-btn-primary" disabled={updateLoading}>
                     {updateLoading ? <Loader2 className="animate-spin" size={18}/> : "Update Key"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProfile;
