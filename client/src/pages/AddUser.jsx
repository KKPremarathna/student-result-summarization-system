import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import "../styles/AddUser.css";
import { 
  UserPlus, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck,
  ArrowRight,
  Info
} from "lucide-react";

function AddUser() {
  return (
    <AdminLayout>
      <div className="au-page">
        {/* Header */}
        <header className="au-header">
          <div className="au-breadcrumb">
            <Users size={14} />
            <span>Management</span>
            <ChevronRight size={14} />
            <span className="au-breadcrumb-current">Manage Access</span>
          </div>
          <h1 className="au-title">User Onboarding</h1>
          <p className="au-subtitle">Authorize students and faculty members to join the system.</p>
        </header>

        <div className="au-grid">
          {/* Action Cards */}
          <div className="au-action-card student">
            <div className="au-card-icon-bg">
              <GraduationCap size={48} />
            </div>
            <div className="au-card-content">
              <div className="au-card-tag">VOLUNTEER REGISTRATION</div>
              <h3>Student Access</h3>
              <p>Authorize new students by email. Manage the whitelist for seamless registration.</p>
              <div className="au-card-footer">
                <Link to="/addstudent" className="au-btn au-btn-primary">
                  Whitelist Students <ArrowRight size={18} />
                </Link>
                <Link to="/studentlist" className="au-btn au-btn-outline">
                  View Whitelist
                </Link>
              </div>
            </div>
          </div>

          <div className="au-action-card lecturer">
            <div className="au-card-icon-bg">
              <UserCheck size={48} />
            </div>
            <div className="au-card-content">
              <div className="au-card-tag">FACULTY ONBOARDING</div>
              <h3>Lecturer Access</h3>
              <p>Grant administrative and academic permissions to faculty members.</p>
              <div className="au-card-footer">
                <Link to="/addlecture" className="au-btn au-btn-primary">
                  Whitelist Lecturers <ArrowRight size={18} />
                </Link>
                <Link to="/lecturelist" className="au-btn au-btn-outline">
                  View Whitelist
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="au-info-box">
          <div className="au-info-icon">
            <Info size={24} />
          </div>
          <div className="au-info-text">
            <h4>Security Reminder</h4>
            <p>Only authorized emails will be able to complete the registration flow. Ensure that the registration numbers match the official student records to prevent data inconsistencies.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddUser;