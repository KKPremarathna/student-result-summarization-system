import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../styles/AdminResetPassword.css";
import { 
  Key, 
  ChevronRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const adminName = "Mrs K.B Ranathunga";

  const handleUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", text: "New passwords do not match" });
      return;
    }
    setStatus({ type: "success", text: "Password security updated successfully" });
  };

  return (
    <AdminLayout>
      <div className="arp-page">
        <header className="arp-header">
           <div className="arp-breadcrumb">
              <Key size={14} />
              <span>Security</span>
              <ChevronRight size={14} />
              <span className="arp-breadcrumb-current">Key Reset</span>
           </div>
           <h1 className="arp-title">Credential Management</h1>
        </header>

        <div className="arp-container">
           <div className="arp-card">
              <div className="arp-card-left">
                 <div className="arp-icon-wrap">
                    <ShieldCheck size={48} />
                 </div>
                 <h2>Identity Security</h2>
                 <p>Managing credentials for: <br/><strong>{adminName}</strong></p>
                 <div className="arp-info-note">
                    <Lock size={16} />
                    <span>Passwords must be at least 8 characters with a mix of letters and numbers.</span>
                 </div>
                 <Link to="/adminprofile" className="arp-back-link">
                    Return to Profile <ArrowRight size={16} />
                 </Link>
              </div>

              <div className="arp-card-right">
                 <form className="arp-form" onSubmit={handleUpdate}>
                    <h3>Authentication Key Update</h3>
                    
                    {status.text && (
                      <div className={`arp-status ${status.type}`}>
                         {status.type === "success" ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                         <span>{status.text}</span>
                      </div>
                    )}

                    <div className="arp-input-group">
                       <label>New Administrative Key</label>
                       <div className="arp-pass-box">
                          <input 
                            type={showPass ? "text" : "password"} 
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)}>
                             {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                       </div>
                    </div>

                    <div className="arp-input-group">
                       <label>Re-verify Administrative Key</label>
                       <div className="arp-pass-box">
                          <input 
                            type={showPass ? "text" : "password"} 
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                       </div>
                    </div>

                    <button type="submit" className="arp-submit-btn">
                       Update Secret Key
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ResetPassword;