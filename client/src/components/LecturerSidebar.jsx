import "../styles/Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from 'react-icons/fa';

/*
Sidebar Dashboard for Lecturer
Collapsible toggle logic added
*/

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { name: "Lecturer Home", path: "/lecturer/home" },
    { name: "View Results", path: "/lecturer/results" },
    { name: "Manage Subjects", path: "/lecturer/addsubject" },
    { name: "Incourse Marks", path: "/lecturer/addincourse" },
    { name: "Pending Review", path: "/lecturer/pending" },
    { name: "Final Result", path: "/lecturer/final" },
    { name: "Profile Settings", path: "/lecturer/setting" },
  ];

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
          {menuItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? "active" : ""}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;