import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpeg';

/*
Student Navbar component
Appears at the top of every student page
*/

function StudentNavbar({ toggleSidebar }) {
  return (
    <div className="navbar student-navbar">
      {/* Logo Section */}
      <div className="logo-container">
        <div className="logo">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
          <h2 className="navbar-logo-text">ACADEMET</h2>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/student/home">HOME</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/calendar">ACADEMIC CALENDER</Link></li>
        <li><Link to="/logout">LOGOUT</Link></li>
        <li><Link to="/student/profile">PROFILE</Link></li>
      </ul>
    </div>
  );
}

export default StudentNavbar;
