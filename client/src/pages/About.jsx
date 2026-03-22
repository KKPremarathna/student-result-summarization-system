import React from "react";
import HomeNavbar from "../components/HomeNavbar";
import "../styles/About.css";
import { Info, Target, Cpu, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <div className="about-page">
      <HomeNavbar />
      
      <main className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-overlay"></div>
          <div className="container">
            <h1 className="animate-fade-in">About Academet</h1>
            <p className="animate-slide-up">
              Revolutionizing Education through Secure Result Management and Advanced Analytics.
            </p>
          </div>
        </section>

        {/* Info Cards */}
        <section className="about-info container">
          <div className="info-grid">
            <div className="info-card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="icon-wrapper">
                <Info className="info-icon" />
              </div>
              <h3>Who We Are</h3>
              <p>
                Academet is a comprehensive student result management and analysis system designed for the Faculty of Engineering, University of Jaffna. We provide a secure and efficient platform for managing academic performance.
              </p>
            </div>

            <div className="info-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="icon-wrapper">
                <Target className="info-icon" />
              </div>
              <h3>Our Mission</h3>
              <p>
                Our mission is to simplify the complex process of result summarization and provide actionable insights to students, lecturers, and administrators through a modern, intuitive interface.
              </p>
            </div>

            <div className="info-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="icon-wrapper">
                <Cpu className="info-icon" />
              </div>
              <h3>Our Technology</h3>
              <p>
                Built with the MERN stack (MongoDB, Express, React, Node.js), Academet leverages modern web technologies to ensure scalability, security, and high performance.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="features-section container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <CheckCircle className="feature-icon" />
              <div>
                <h4>Secure Authentication</h4>
                <p>Role-based access control for Admins, Lecturers, and Students.</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle className="feature-icon" />
              <div>
                <h4>Result Summarization</h4>
                <p>Automated generation of performance summaries and GPA calculations.</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle className="feature-icon" />
              <div>
                <h4>Interactive Dashboards</h4>
                <p>Visual representation of results using dynamic charts and graphs.</p>
              </div>
            </div>
            <div className="feature-item">
              <CheckCircle className="feature-icon" />
              <div>
                <h4>Complaint Management</h4>
                <p>Integrated system for students to raise concerns about their results.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="vision-banner">
          <div className="container">
            <h2>Empowering academic excellence through data-driven decisions.</h2>
          </div>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className="simple-footer">
        <p>© {new Date().getFullYear()} Faculty of Engineering, University of Jaffna. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
