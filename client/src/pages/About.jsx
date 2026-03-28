import React from "react";
import HomeNavbar from "../components/HomeNavbar";
import "../styles/About.css";

function About() {
  return (
    <div className="about-page">
      <HomeNavbar />
      <div className="about-container">
        <section className="about-hero">
          <h1>About Academet</h1>
          <p className="subtitle">Enhancing Academic Excellence through Data-Driven Insights</p>
        </section>

        <section className="about-content">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              Academet is a state-of-the-art result management and analysis system designed for the Faculty of Engineering, University of Jaffna. Our mission is to streamline the academic result processing and provide deep analytical insights to students, lecturers, and administrators.
            </p>
          </div>

          <div className="about-grid">
            <div className="info-box">
              <h3>Secure & Reliable</h3>
              <p>Built with modern security standards to ensure your academic data remains private and protected at all times.</p>
            </div>
            <div className="info-box">
              <h3>Performance Analytics</h3>
              <p>Provides comprehensive visualizations and statistical tools to track student progress and course performance.</p>
            </div>
            <div className="info-box">
              <h3>Student-Centric</h3>
              <p>Easy access for students to view their results, track their GPA, and receive personalized academic feedback.</p>
            </div>
          </div>
        </section>

        <section className="about-vibe">
          <p>"Transforming academic results into actionable knowledge."</p>
        </section>
      </div>
    </div>
  );
}

export default About;
