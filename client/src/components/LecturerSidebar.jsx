import "../styles/Sidebar.css";
import { Link } from "react-router-dom";
import { FaBars } from 'react-icons/fa';

/*
Sidebar Dashboard for Lecturer
Collapsible toggle logic added
*/

function Sidebar({ isOpen, toggleSidebar }) {

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
          <li><Link to="/lecturer/home">Lecturer Home</Link></li>
          <li><Link to="/lecturer/results">View Results</Link></li>
          <li><Link to="/lecturer/addsubject">Manage Subjects</Link></li>
          <li><Link to="/lecturer/addincourse">Incourse Marks</Link></li>
          <li><Link to="/lecturer/pending">Pending Review</Link></li>
          <li><Link to="/lecturer/final">Final Result</Link></li>
          <li><Link to="/lecturer/setting">Profile Settings</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;