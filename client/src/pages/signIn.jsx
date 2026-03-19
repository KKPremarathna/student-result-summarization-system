import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InnerNavbar from "../components/InnerNavbar";
import { Mail, Lock, Eye, EyeOff, LogIn, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import "../styles/signIn.css";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage({ type: "success", text: "Login successful! Redirecting..." });

        setTimeout(() => {
          if (user.role === "admin") navigate("/adminhome");
          else if (user.role === "lecturer") navigate("/lecturer/home");
          else if (user.role === "student") navigate("/student/home");
          else navigate("/");
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page winter-theme">
      <InnerNavbar />

      <main className="signin-container">
        <div className="signin-card">
          <header className="signin-header">
            <div className="signin-icon-container">
              <LogIn size={32} />
            </div>
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-subtitle">Enter your credentials to continue</p>
          </header>

          {message.text && (
            <div className={`signin-status-message ${message.type}`}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="signin-input-group">
              <label>Email Address</label>
              <div className="signin-input-wrapper">
                <Mail className="signin-input-icon" size={18} />
                <input
                  type="email"
                  placeholder="name@university.ac.lk"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="signin-input-group">
              <label>Password</label>
              <div className="signin-input-wrapper">
                <Lock className="signin-input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="signin-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="signin-footer">
              <Link to="/forgot-password" title="Reset your password">
                <span className="signin-forgot-link">Forgot Password?</span>
              </Link>
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ChevronRight size={18} />}
            </button>

            <p className="signup-prompt">
              Don't have an Account?{" "}
              <Link to="/signup" className="signup-link">
                Create One
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signin;