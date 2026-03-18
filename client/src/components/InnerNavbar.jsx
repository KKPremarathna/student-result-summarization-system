import React from "react";
import { Link } from "react-router-dom";
import academetLogo from "../assets/images/academet-logo.png";
import "../styles/InnerNavbar.css";

function InnerNavbar() {
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch (e) { }

  const calendarLink = user?.role === "admin" ? "/AdminCalendar" : "/calendar";

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
        <Link to={calendarLink}>Academic Calendar</Link>
        <Link to="/signin">SignIn</Link>
        <Link to="/signup">SignUp</Link>
      </nav>
    </header>
  );
}

export default InnerNavbar;