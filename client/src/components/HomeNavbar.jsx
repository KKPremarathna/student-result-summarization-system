import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/campus-logo.png";
import "../styles/HomeNavbar.css";

function HomeNavbar() {
  return (
    <header className="home-navbar">
      <div className="home-navbar__brand">
        <img src={logo} alt="Campus Logo" className="home-navbar__logo" />
        <div className="home-navbar__text">
          <h2>FACULTY OF ENGINEERING</h2>
          <h1>UNIVERSITY OF JAFFNA</h1>
        </div>
      </div>

      <nav className="home-navbar__links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        <Link to="/signin">SignIn</Link>
        <Link to="/signup">SignUp</Link>
      </nav>
    </header>
  );
}

export default HomeNavbar;