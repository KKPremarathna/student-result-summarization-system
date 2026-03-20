import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/AddLecture.css";
import { 
  UserPlus, 
  Mail, 
  Building2, 
  ChevronRight, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  List,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

function AddLecture() {
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "Session expired. Please login again." });
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleAddLecturer = async () => {
    if (!email || !department) {
      setMessage({ type: "error", text: "Please provide email and department" });
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:5000/api/admin/add-lecturer-email",
        { email, department },
        { headers }
      );
      setMessage({ type: "success", text: response.data.message });
      setEmail("");
      setDepartment("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error adding lecturer email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="al-page">
        {/* Header */}
        <header className="al-header">
           <div className="al-breadcrumb">
              <Link to="/adduser" className="al-back-link"><ArrowLeft size={14} /> Back to Management</Link>
              <ChevronRight size={14} />
              <span className="al-breadcrumb-current">Authorize Lecturer</span>
           </div>
           <h1 className="al-title">Faculty Access</h1>
           <p className="al-subtitle">Onboard academic staff by whitelisting their institutional emails.</p>
        </header>

        {message.text && (
          <div className={`al-status-bar ${message.type}`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
            <button className="al-status-close" onClick={() => setMessage({ type: "", text: "" })}>×</button>
          </div>
        )}

        <div className="al-grid">
           {/* Form Card */}
           <div className="al-card">
              <div className="al-card-header">
                 <div className="al-card-icon-wrap">
                    <UserPlus size={24} />
                 </div>
                 <h3 className="al-card-title">New Faculty Authorization</h3>
              </div>

              <div className="al-form">
                 <div className="al-form-group">
                    <label>
                       <Mail size={14} /> Institutional Email
                    </label>
                    <input
                      type="email"
                      placeholder="lecturer@eng.jfn.ac.lk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                 </div>

                 <div className="al-form-group">
                    <label>
                       <Building2 size={14} /> Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                 </div>

                 <button
                   className="al-submit-btn"
                   onClick={handleAddLecturer}
                   disabled={loading}
                 >
                   {loading ? "Authorizing..." : <><Plus size={20}/> Authorize Lecturer</>}
                 </button>
              </div>
           </div>

           {/* Quick Actions / Link Card */}
           <div className="al-side-card">
              <div className="al-info-card">
                 <div className="al-info-icon">
                    <List size={24} />
                 </div>
                 <h3>Active Directory</h3>
                 <p>Review the list of lecturers already authorized or signed up in the system.</p>
                 <Link to="/lecturelist" className="al-btn al-btn-outline">
                    View Faculty List
                 </Link>
              </div>
              
              <div className="al-tip-box">
                 <AlertCircle size={20} />
                 <p>Emails must be valid university addresses. Verification will be sent upon first sign-up.</p>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddLecture;
