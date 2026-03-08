import React from "react";
import "./home.css";
import logo from "../assets/images/campus-logo.png";
import heroBg from "../assets/images/hero-bg.jpg";

function Home() {
  return (
    <div className="home-page">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="overlay"></div>

        <div className="top-bar">
          <div className="brand">
            <img src={logo} alt="Campus Logo" className="brand-logo" />
            <div className="brand-text">
              <h2>FACULTY OF ENGINEERING</h2>
              <h1>UNIVERSITY OF JAFFNA</h1>
            </div>
          </div>

          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/calendar">Academic Calender</a>
            <a href="/signin">SignIn</a>
            <a href="/signup">SignUp</a>
          </nav>
        </div>

        <div className="hero-content">
          <h1 className="title">Academet</h1>
          <h2>Welcome to Academet !</h2>
          <p>A Secure Result Management And Analysis System</p>

          <div className="email-box">
            <input type="email" placeholder="Enter Your Email" />
            <button>SignUp</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;