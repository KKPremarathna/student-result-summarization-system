import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from '../assets/logo.jpeg';
import { FaBars } from 'react-icons/fa';

/*
Navbar component
Appears at the top of every lecturer page
*/

function Navbar({ toggleSidebar }) {

  return (
    <div className="navbar">

      {/* Logo Section & Hamburger */}
      <div className="logo-container">
        <div className="logo">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
          <h2 className="navbar-logo-text">ACADEMET</h2>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/lecturer/home">Home</Link></li>
        <li><Link to="/lecturer/setting">Profile</Link></li>
        <li className="logout-item">
          <button 
            className="navbar-logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("lecturer");
              window.location.href = "/signin";
            }}
          >
            Logout
          </button>
        </li>
      </ul>

    </div>
  );
}

export default Navbar;