import { Link } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import "../styles/Sidebar.css";

/*
Sidebar Dashboard for Student
*/

function StudentSidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-toggle-container">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-section">Main Menu</div>
        <ul>
          <li><Link to="/student/home">Student Home</Link></li>
          <li><Link to="/student/subject-wise">Subject-wise Result</Link></li>
          <li><Link to="/student/student-wise">Student-wise Result</Link></li>
          <li><Link to="/student/profile">Profile Settings</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default StudentSidebar;
