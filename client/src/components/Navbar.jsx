import React from "react";
import logo from "../assets/images/campus-logo.png";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo-section">
        <img src={logo} alt="Campus Logo" className="logo" />
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/calendar">Academic Calendar</a>
        <a href="/signin">SignIn</a>
        <a href="/signup">SignUp</a>
      </div>
    </div>
  );
}

export default Navbar;