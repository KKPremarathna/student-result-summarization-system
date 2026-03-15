import React from "react";
import { Link, useNavigate } from "react-router-dom";
import academetLogo from "../assets/images/academet-logo.png";
import "../styles/InnerNavbar.css";

function InnerNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/SignIn");
  };

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
        
        {token ? (
          <>
            <Link to={user?.role === 'admin' ? '/AdminHome' : '/home'}>Dashboard</Link>
            <button onClick={handleLogout} className="logout-nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/SignIn">SignIn</Link>
            <Link to="/SignUp">SignUp</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default InnerNavbar;