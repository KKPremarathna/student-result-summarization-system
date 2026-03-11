import React from "react";
import "../styles/home.css";
import heroBg from "../assets/images/hero-bg.jpg";
import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";

function Home() {
  return (
    <div className="home-page">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="overlay"></div>

        <HomeNavbar />

        <div className="hero-content">
          <h1 className="title">Academet</h1>
          <h2>Welcome to Academet !</h2>
          <p>A Secure Result Management And Analysis System</p>

          <div className="email-box">
            <input type="email" placeholder="Enter Your Email" />
            <Link to="/signup">
              <button>SignUp</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;