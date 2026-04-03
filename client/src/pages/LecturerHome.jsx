import { useEffect, useState } from "react";
import LecturerLayout from "../components/LecturerLayout.jsx";
import { getLecturerDetails } from "../services/lecturerApi.js";
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
  Loader2,
  Edit3
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
        <div className="sh-loading">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </LecturerLayout>
    );
  }

  const fullName = lecturer ? `${lecturer.title || ""} ${lecturer.firstName} ${lecturer.lastName}` : "User Name";

  return (
    <LecturerLayout>
      <div className="lh-page">
        <div className="lh-grid">

          {/* Left Column: Profile Card */}
          <div className="lh-profile-col">
            <div className="lh-card lh-card--center">
              <div className="lh-avatar-wrap">
                <div className="lh-avatar-ring">
                  <div className="lh-avatar">
                    <img
                      src={lecturer?.profilePicture || DEFAULT_AVATAR}
                      alt="Lecturer Profile"
                      className="lh-avatar__img"
                      onError={handleImageError}
                    />
                  </div>
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

              <Link to="/lecturer/setting" className="lh-settings-btn-wrap">
                 <button className="lh-settings-btn">
                   <Settings size={18} />
                   <span>Profile Settings</span>
                 </button>
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lh-right-col">

            {/* Stats Cards */}
            <div className="lh-stats">
              <div className="lh-stat-card lh-stat-card--teal">
                <div className="lh-stat-card__icon-wrap">
                  <BookOpen size={28} />
                </div>
                <div className="lh-stat-card__content">
                  <h3 className="lh-stat-card__label">Total Subjects</h3>
                  <p className="lh-stat-card__sub">MODULES MANAGED</p>
                </div>
                <span className="lh-stat-card__number">
                  {subjects.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="lh-stat-card lh-stat-card--dark">
                <div className="lh-stat-card__icon-wrap">
                  <Bell size={28} />
                </div>
                <div className="lh-stat-card__content">
                  <h3 className="lh-stat-card__label">Recent Activities</h3>
                  <p className="lh-stat-card__sub">PENDING TASKS</p>
                </div>
                <span className="lh-stat-card__number">00</span>
              </div>
            </div>

            {/* Assigned Subjects */}
            <div className="lh-subjects-card">
              <div className="lh-subjects__header">
                <h3 className="lh-subjects__title">
                  <BookOpen size={24} className="lh-subjects__title-icon" />
                  Assigned Subjects
                </h3>
                <div className="lh-search-wrap">
                  <Search className="lh-search__icon" size={18} />
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
                      <div className="lh-subject-item__info">
                        <h4 className="lh-subject-item__name">{subject.courseName}</h4>
                        <p className="lh-subject-item__year">{subject.courseCode} | {subject.batch}</p>
                      </div>
                      <div className="lh-subject-item__actions">
                        <Link 
                          to={`/lecturer/edit-subject/${subject._id}`} 
                          className="lh-subject-item__edit" 
                          title="Edit Subject"
                        >
                          <Edit3 size={18} />
                        </Link>
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
