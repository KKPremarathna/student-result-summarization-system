import { useEffect, useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { getLecturerDetails } from "../services/lecturerApi.js";
import profile from '../assets/profile.png';
import dashboardBg from '../assets/dashboard-bg.png';
import "../styles/LecturerHome.css";
import { Link } from "react-router-dom";
import {
  User,
  BookOpen,
  GraduationCap,
  Settings,
  Bell,
  Search,
  LayoutDashboard,
  Calendar,
  Loader2
} from "lucide-react";

function LecturerHome() {
  const [lecturer, setLecturer] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLecturerDetails();
        if (res.data.success) {
          setLecturer(res.data.data);
          setSubjects(res.data.subjects || []);
        }
      } catch (error) {
        console.error("Error fetching lecturer details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  if (loading) {
    return (
      <LecturerLayout>
        <div className="lh-loading">
          <Loader2 className="lh-loader-icon" />
          <p>Loading dashboard...</p>
        </div>
      </LecturerLayout>
    );
  }

  const fullName = lecturer ? `${lecturer.title || ""} ${lecturer.firstName} ${lecturer.lastName}` : "User Name";

  return (
    <LecturerLayout>
      <div className="lh-page">

        {/* Hero Section */}
        <div className="lh-hero">
          <img
            src={dashboardBg}
            alt="Dashboard Background"
            className="lh-hero__bg"
          />
          <div className="lh-hero__overlay">
            <div className="lh-hero__meta">
              <span className="lh-hero__badge">Staff Dashboard</span>
              <span className="lh-hero__date">
                <Calendar size={14} />
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="lh-hero__title">
              Welcome back, <span>{fullName}</span>..!
            </h1>
            <p className="lh-hero__subtitle">
              Your academic performance and subject management portal is up to date.
              Check your assigned modules and recent results below.
            </p>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="lh-grid">

          {/* Left Column: Profile Card */}
          <div className="lh-profile-col">
            <div className="lh-card lh-card--center">
              <div className="lh-avatar-wrap">
                <div className="lh-avatar-glow"></div>
                <div className="lh-avatar">
                  <img
                    src={lecturer?.profilePicture || DEFAULT_AVATAR}
                    alt="Lecturer Profile"
                    className="lh-avatar__img"
                    onError={handleImageError}
                  />
                </div>
              </div>

              <h2 className="lh-profile__name">{fullName}</h2>
              <div className="lh-profile__role">
                <GraduationCap size={18} />
                {lecturer?.position || "Staff Member"}
              </div>

              <div className="lh-profile__info">
                <div className="lh-info-row">
                  <div className="lh-info-row__key">
                    <LayoutDashboard size={18} />
                    <span>Faculty</span>
                  </div>
                  <span className="lh-info-row__value">{lecturer?.faculty || "Not Specified"}</span>
                </div>

                <div className="lh-info-row">
                  <div className="lh-info-row__key">
                    <User size={18} />
                    <span>University</span>
                  </div>
                  <span className="lh-info-row__value">{lecturer?.university || "University Of Jaffna"}</span>
                </div>
              </div>

              <div className="lh-profile__actions">
                <Link to="/lecturer/setting">
                  <button className="lh-settings-btn">
                    <Settings size={18} />
                    Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lh-right-col">

            {/* Stats Cards */}
            <div className="lh-stats">
              <div className="lh-stat-card lh-stat-card--teal">
                <div className="lh-stat-card__top">
                  <div className="lh-stat-card__icon">
                    <BookOpen size={28} />
                  </div>
                  <span className="lh-stat-card__number">
                    {subjects.length.toString().padStart(2, '0')}
                  </span>
                </div>
                <h3 className="lh-stat-card__label">Total Subjects</h3>
                <p className="lh-stat-card__sub">Modules Managed</p>
                <div className="lh-stat-card__blob"></div>
              </div>

              <div className="lh-stat-card lh-stat-card--dark">
                <div className="lh-stat-card__top">
                  <div className="lh-stat-card__icon">
                    <Bell size={28} />
                  </div>
                  <span className="lh-stat-card__number">00</span>
                </div>
                <h3 className="lh-stat-card__label">Recent Activities</h3>
                <p className="lh-stat-card__sub">Pending Tasks</p>
                <div className="lh-stat-card__blob"></div>
              </div>
            </div>

            {/* Assigned Subjects */}
            <div className="lh-card">
              <div className="lh-subjects__header">
                <h3 className="lh-subjects__title">
                  <BookOpen className="lh-subjects__title-icon" />
                  Assigned Subjects
                </h3>
                <div className="lh-search-wrap">
                  <Search className="lh-search__icon" size={16} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    className="lh-search__input"
                  />
                </div>
              </div>

              <div className="lh-subjects-grid">
                {subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <div key={index} className="lh-subject-item">
                      <div className="lh-subject-item__initial">
                        {subject.courseCode?.charAt(0) || "S"}
                      </div>
                      <div>
                        <h4 className="lh-subject-item__name">{subject.courseName}</h4>
                        <p className="lh-subject-item__year">{subject.courseCode} | {subject.batch}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lh-empty-state">
                    <BookOpen size={48} className="lh-empty-state__icon" />
                    <p className="lh-empty-state__text">No subjects assigned yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </LecturerLayout>
  );
}

export default LecturerHome;
