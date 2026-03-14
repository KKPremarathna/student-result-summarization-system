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
          <div className="hero-badge">Modern Result Management</div>
          <h1 className="title">Academet</h1>
          <h2 className="subtitle">Precision. Security. Efficiency.</h2>
          <p className="hero-desc">
            A premium result management and architectural analysis system 
            designed for modern educational excellence.
          </p>

          <div className="cta-container">
            <div className="glass-input-group">
              <input type="email" placeholder="Enter your academic email" />
              <Link to="/SignUp">
                <button className="gold-btn">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;