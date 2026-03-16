import { useEffect, useState } from "react";
import StudentLayout from "../components/StudentLayout.jsx";
import studentHero from "../assets/student-hero.png";
import profile from '../assets/profile.png';
import dashboardBg from '../assets/dashboard-bg.png';
import "../styles/StudentHome.css";
import { Link } from "react-router-dom";
import { getStudentDetails } from "../services/studentApi";
import {
  User,
  BookOpen,
  GraduationCap,
  Settings,
  Bell,
  LayoutDashboard,
  Calendar,
  FileText,
  Search
} from "lucide-react";

function StudentHome() {
  const [student, setStudent] = useState({
    name: "Loading...",
    email: "",
    faculty: "Faculty Of Engineering",
    university: "University Of Jaffna",
    indexNo: "---"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getStudentDetails();
      if (res.data && res.data.data) {
        const u = res.data.data;
        setStudent({
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          faculty: u.faculty || "Faculty Of Engineering",
          university: u.university || "University Of Jaffna",
          indexNo: u.studentENo || u.email.split('@')[0].toUpperCase()
        });
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  return (
    <StudentLayout>
      <div className="sh-dashboard">

        {/* Hero Section */}
        <div className="sh-hero">
          <img
            src={dashboardBg}
            alt="Dashboard Background"
            className="sh-hero__bg"
          />
          <div className="sh-hero__overlay">
            <div className="sh-hero__content">
              <div className="sh-hero__meta">
                <span className="sh-hero__badge">Student Dashboard</span>
                <span className="sh-hero__date">
                  <Calendar size={14} />
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="sh-hero__title">
                Welcome back, <span>{student?.name}</span>..!
              </h1>
              <p className="sh-hero__subtitle">
                Your academic performance and result summaries are up to date.
                Check your subject-wise and overall results below.
              </p>
            </div>

            {/* Student Hero Image on the right of the welcome banner */}
            <div className="sh-hero__image-wrap">
              <img
                src={studentHero}
                alt="Student Hero"
                className="sh-hero__student-img"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="sh-grid">

          {/* Left Column: Profile Card */}
          <div className="sh-profile-col">
            <div className="sh-card sh-card--center">
              <div className="sh-avatar-wrap">
                <div className="sh-avatar-glow"></div>
                <div className="sh-avatar">
                  <img
                    src={profile}
                    alt="Student Profile"
                    className="sh-avatar__img"
                  />
                </div>
              </div>

              <h2 className="sh-profile__name">{student?.name}</h2>
              <div className="sh-profile__role">
                <GraduationCap size={18} />
                {student?.indexNo}
              </div>

              <div className="sh-profile__info">
                <div className="sh-info-row">
                  <div className="sh-info-row__key">
                    <LayoutDashboard size={18} />
                    <span>Faculty</span>
                  </div>
                  <span className="sh-info-row__value">{student?.faculty || "Faculty Of Engineering"}</span>
                </div>

                <div className="sh-info-row">
                  <div className="sh-info-row__key">
                    <User size={18} />
                    <span>University</span>
                  </div>
                  <span className="sh-info-row__value">{student?.university || "University Of Jaffna"}</span>
                </div>
              </div>

              <div className="sh-profile__actions">
                <Link to="/student/profile">
                  <button className="sh-settings-btn">
                    <Settings size={18} />
                    Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="sh-right-col">

            {/* Stats/Action Cards */}
            <div className="sh-stats">
              <Link to="/student/subject-wise" className="sh-stat-card sh-stat-card--teal">
                <div className="sh-stat-card__top">
                  <div className="sh-stat-card__icon">
                    <BookOpen size={28} />
                  </div>
                  <span className="sh-stat-card__number">📊</span>
                </div>
                <h3 className="sh-stat-card__label">Subject-wise Result</h3>
                <p className="sh-stat-card__sub">Check Overall Summary of batch </p>
                <div className="sh-stat-card__blob"></div>
              </Link>

              <Link to="/student/student-wise" className="sh-stat-card sh-stat-card--dark">
                <div className="sh-stat-card__top">
                  <div className="sh-stat-card__icon">
                    <FileText size={28} />
                  </div>
                  <span className="sh-stat-card__number">📄</span>
                </div>
                <h3 className="sh-stat-card__label">Student-wise Result</h3>
                <p className="sh-stat-card__sub">View Individual Performance</p>
                <div className="sh-stat-card__blob"></div>
              </Link>
            </div>


          </div>

        </div>

      </div>
    </StudentLayout>
  );
}

export default StudentHome;
