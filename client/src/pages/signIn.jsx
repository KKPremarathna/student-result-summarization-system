import React, { useState } from "react";
import { Link } from "react-router-dom";
import InnerNavbar from "../components/InnerNavbar";
import signinImage from "../assets/images/signup-image.png";
import "../styles/signIn.css";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signin-page">
      <InnerNavbar />

      <div className="signin-main">
        <div className="signin-left">
          <img
            src={signinImage}
            alt="Signin illustration"
            className="signin-image"
          />
        </div>

        <div className="signin-right">
          <form className="signin-form">
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-subtitle">Enter your credentials to continue</p>

            <input type="email" placeholder="Email" />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>

            <p className="forgot-password">Forgot Password ?</p>

            <button type="submit" className="signin-btn">
              Sign In
            </button>

            <p className="signup-text">
              Don’t have an Account ?{" "}
              <Link to="/signup">
                <span>Create One</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;