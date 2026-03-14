import React from "react";
import { Link } from "react-router-dom";

function Navbar({ logo, title }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
        <div className="navbar-title">
          {title}
        </div>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Academic Calendar</Link>
        <Link to="/SignIn">SignIn</Link>
        <Link to="/SignUp">SignUp</Link>
      </div>
    </div>
  );
}

export default Navbar;