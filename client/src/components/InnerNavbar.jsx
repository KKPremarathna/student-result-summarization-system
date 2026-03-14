import React from "react";
import { Link } from "react-router-dom";
import academetLogo from "../assets/images/academet-logo.png";
import "../styles/InnerNavbar.css";

function InnerNavbar() {
  return (
    <header className="inner-navbar">
      <div className="inner-navbar__brand">
        <img
          src={academetLogo}
          alt="Academet Logo"
          className="inner-navbar__logo"
        />
        <h1 className="inner-navbar__title">Academet</h1>
      </div>

      <nav className="inner-navbar__links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/calendar">Academic Calendar</Link>
        <Link to="/SignIn">SignIn</Link>
        <Link to="/SignUp">SignUp</Link>
      </nav>
    </header>
  );
}

export default InnerNavbar;