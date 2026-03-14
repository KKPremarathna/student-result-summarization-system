import React, { useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import "../styles/LecturerSetting.css";
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
  Building2,
  Fingerprint
} from "lucide-react";

function Setting() {
  const [userData, setUserData] = useState({
    name: "Mrs K.B Ranathunga",
    email: "kb.ranathunga@uok.lk",
    department: "Computer Science",
    lecturerId: "LEC-CS-1234"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LecturerLayout>
      <div className="st-page">

        {/* Page Header */}
        <div className="st-header">
          <div className="st-breadcrumb">
            <LayoutDashboard size={14} />
            <span>Lecturer Portal</span>
            <ChevronRight size={14} />
            <span className="st-breadcrumb__current">Account Settings</span>
          </div>
          <h2 className="st-title">
            <Settings size={32} className="st-title__icon" />
            Settings &amp; Profile
          </h2>
        </div>

        <div className="st-layout">

          {/* Profile Card */}
          <div className="st-sidebar">
            <div className="st-profile-card">
              <div className="st-avatar-wrap">
                <div className="st-avatar">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="Profile"
                    className="st-avatar__img"
                  />
                </div>
                <button className="st-avatar__edit-btn">
                  <Camera size={20} />
                </button>
              </div>

              <h3 className="st-profile__name">{userData.name}</h3>
              <p className="st-profile__role">Senior Lecturer</p>

              <div className="st-divider" />

              <button className="st-profile-btn st-profile-btn--primary">
                <User size={18} />
                Edit Profile
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="st-profile-btn st-profile-btn--outline"
              >
                <Key size={18} />
                Security Keys
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="st-details">

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
                  <div>
                    <p className="st-info-row__label">
                      <User size={12} />
                      Display Name
                    </p>
                    <p className="st-info-row__value">{userData.name}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Mail size={12} />
                      Email Address
                    </p>
                    <p className="st-info-row__value">{userData.email}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Building2 size={12} />
                      Academic Department
                    </p>
                    <p className="st-info-row__value">{userData.department}</p>
                  </div>
                  <ChevronRight size={20} className="st-info-row__arrow" />
                </div>

                <div className="st-thin-divider" />

                <div className="st-info-row">
                  <div>
                    <p className="st-info-row__label">
                      <Shield size={12} />
                      Lecturer ID
                    </p>
                    <code className="st-info-row__code">
                      {userData.lecturerId}
                    </code>
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
                  <h4 className="st-privacy-card__title">Privacy &amp; Security</h4>
                </div>
                <p className="st-privacy-card__text">
                  Protect your academic account using encrypted authentication methods and two-factor verification.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="st-privacy-btn"
                >
                  Manage Passwords
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
                <h3 className="st-modal__title">Security Update</h3>
                <p className="st-modal__subtitle">Create a strong password to protect results</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="st-modal__form">
                <div className="st-modal__field">
                  <label className="st-modal__label">Current Password</label>
                  <input
                    type="password"
                    className="st-modal__input"
                    placeholder="••••••••"
                  />
                </div>

                <div className="st-modal__field">
                  <label className="st-modal__label">New Secure Password</label>
                  <input
                    type="password"
                    className="st-modal__input"
                    placeholder="••••••••"
                  />
                </div>

                <div className="st-modal__submit-wrap">
                  <button className="st-modal__submit-btn">
                    Revoke &amp; Secure
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  );
}

export default Setting;
