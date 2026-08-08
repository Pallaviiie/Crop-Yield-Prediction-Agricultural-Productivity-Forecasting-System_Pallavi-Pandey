import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  CloudSun,
  Gauge,
  TrendingUp,
  Globe2,
} from "lucide-react";

import cropLogo from "../../assets/crop-logo.png";
import farmHero from "../../assets/farm-hero.png";
import googleLogo from "../../assets/google-logo.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("farmer");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE NORMAL INPUT CHANGE
  // ==============================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==============================
  // NORMAL LOGIN
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please enter your email and password.");
      }

      // TEMPORARY: Navigation for testing
      // Later connect this with your FastAPI login API

      if (role === "farmer") {
        navigate("/dashboard");
      } else if (role === "consultant") {
        navigate("/consultant-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // GOOGLE LOGIN
  // ==============================
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError("");
        setLoading(true);

        console.log("Google Login Success:", tokenResponse);

        const response = await fetch(
          "http://127.0.0.1:8000/auth/google",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              access_token: tokenResponse.access_token,
              role: role,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          throw new Error(
            errorData.detail ||
              "Google authentication failed. Please try again."
          );
        }

        const data = await response.json();

        console.log("Backend response:", data);

        // Save JWT token
        if (data.access_token) {
          localStorage.setItem(
            "access_token",
            data.access_token
          );
        }

        // Save user information
        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        // Get role from backend or selected role
        const userRole = data.user?.role || role;

        // Redirect based on role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (
          userRole === "consultant" ||
          userRole === "agri_consultant"
        ) {
          navigate("/consultant-dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Google login error:", error);

        setError(
          error.message ||
            "Google sign-in failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      console.error("Google Login Failed");

      setError(
        "Google sign-in was cancelled or failed. Please try again."
      );

      setLoading(false);
    },
  });

  return (
    <div className="login-page">

      {/* ================= LEFT SIDE ================= */}
      <section
        className="login-left"
        style={{
          backgroundImage: `url(${farmHero})`,
        }}
      >
        <div className="login-overlay" />

        {/* Logo */}
        <Link to="/" className="login-brand">
          <div className="login-logo-circle">
            <img
              src={cropLogo}
              alt="YieldSense AI"
            />
          </div>

          <span>
            YieldSense <b>AI</b>
          </span>
        </Link>

        {/* Main content */}
        <div className="login-left-content">
          <h1>
            Grow with intelligence,
            <br />
            <span>harvest with confidence.</span>
          </h1>

          <p>
            Access real-time crop yield predictions,
            weather insights, and AI-powered farming
            recommendations.
          </p>

          <div className="feature-grid">

            <div className="login-feature-card">
              <div className="feature-icon">
                <Gauge size={20} />
              </div>

              <div>
                <strong>94% Accuracy</strong>
                <span>Yield predictions</span>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="feature-icon">
                <CloudSun size={20} />
              </div>

              <div>
                <strong>Live Weather</strong>
                <span>Real-time data</span>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="feature-icon">
                <Gauge size={20} />
              </div>

              <div>
                <strong>Soil Health</strong>
                <span>NPK monitoring</span>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="feature-icon">
                <TrendingUp size={20} />
              </div>

              <div>
                <strong>Analytics</strong>
                <span>Smart insights</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom trust section */}
        <div className="login-trust">
          <span>
            <ShieldCheck size={16} />
            Secure
          </span>

          <span className="trust-divider" />

          <span>
            <Globe2 size={16} />
            Trusted by 2,400+ farmers
          </span>
        </div>

      </section>

      {/* ================= RIGHT SIDE ================= */}
      <section className="login-right">

        <div className="login-form-container">

          {/* Heading */}
          <div className="login-heading">
            <h2>Welcome back</h2>

            <p>
              Sign in to your YieldSense AI account
            </p>
          </div>

          {/* Role tabs */}
          <div className="role-tabs">

            <button
              type="button"
              className={
                role === "farmer" ? "active" : ""
              }
              onClick={() => setRole("farmer")}
            >
              Farmer
            </button>

            <button
              type="button"
              className={
                role === "consultant" ? "active" : ""
              }
              onClick={() => setRole("consultant")}
            >
              Consultant
            </button>

            <button
              type="button"
              className={
                role === "admin" ? "active" : ""
              }
              onClick={() => setRole("admin")}
            >
              Admin
            </button>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-form-group">

              <label>
                Email Address <span>*</span>
              </label>

              <div className="login-input">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

            </div>

            {/* Password */}
            <div className="login-form-group">

              <label>
                Password <span>*</span>
              </label>

              <div className="login-input">

                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  minLength="6"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember / Forgot */}
            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                <span>Remember me</span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert(
                    "Forgot password feature coming soon."
                  )
                }
              >
                Forgot password?
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
              className="sign-in-button"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn size={19} />
                  Sign In
                </>
              )}
            </button>

            {/* Google Login - Only for Farmer and Consultant */}
{role !== "admin" && (
  <>
    {/* Divider */}
    <div className="or-divider">
      <span />
      <p>or continue with</p>
      <span />
    </div>

    {/* Google */}
    <button
      type="button"
      className="google-button"
      onClick={() => handleGoogleLogin()}
      disabled={loading}
    >
      <img
        src={googleLogo}
        alt="Google"
        className="google-icon"
      />

      <span>Continue with Google</span>
    </button>
  </>
)}


          </form>


          {/* Register - Only for Farmer and Consultant */}
{role !== "admin" && (
  <p className="register-text">
    Don't have an account?{" "}
    <Link to="/register">
      Create one free
    </Link>
  </p>
)}

        </div>

      </section>

    </div>
  );
}

export default Login;