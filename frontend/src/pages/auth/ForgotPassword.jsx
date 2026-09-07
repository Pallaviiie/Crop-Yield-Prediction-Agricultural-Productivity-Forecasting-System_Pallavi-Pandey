import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import cropLogo from "../../assets/crop-logo.png";
import "./ForgotPassword.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (data) => {
    if (!data) {
      return "Something went wrong. Please try again.";
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.msg || "Invalid input"
        )
        .join(", ");
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    return "Unable to complete the request.";
  };

  // =========================
  // STEP 1 - SEND OTP
  // =========================
  const handleSendOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data));
      }

      setEmail(cleanEmail);

      setSuccess(
        "If an account exists with this email, a password reset OTP has been sent."
      );

      setStep(2);
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);

      setError(
        err.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STEP 2 - VERIFY OTP
  // =========================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanOTP = otp.trim();

    if (!/^\d{6}$/.test(cleanOTP)) {
      setError("OTP must contain exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            otp: cleanOTP,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data));
      }

      setOtp(cleanOTP);

      setSuccess(
        "OTP verified successfully. Create your new password."
      );

      setStep(3);
    } catch (err) {
      console.error("OTP VERIFICATION ERROR:", err);

      setError(
        err.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STEP 3 - RESET PASSWORD
  // =========================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            new_password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data));
      }

      setPassword("");
      setConfirmPassword("");

      setSuccess(
        "Your password has been reset successfully."
      );

      setStep(4);
    } catch (err) {
      console.error("PASSWORD RESET ERROR:", err);

      setError(
        err.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data));
      }

      setOtp("");

      setSuccess(
        "A new password reset OTP has been sent to your email."
      );
    } catch (err) {
      console.error("RESEND OTP ERROR:", err);

      setError(
        err.message ||
          "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GO BACK TO EMAIL
  // =========================
  const handleChangeEmail = () => {
    setStep(1);
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">

        {/* BRAND */}
        <Link to="/" className="forgot-brand">
          <div className="forgot-logo">
            <img
              src={cropLogo}
              alt="YieldSense AI"
            />
          </div>

          <span>
            YieldSense <b>AI</b>
          </span>
        </Link>

        {/* TOP ICON */}
        <div className="forgot-icon-wrapper">
          {step === 4 ? (
            <CheckCircle2 size={30} />
          ) : step === 3 ? (
            <Lock size={30} />
          ) : step === 2 ? (
            <ShieldCheck size={30} />
          ) : (
            <KeyRound size={30} />
          )}
        </div>

        {/* HEADING */}
        <div className="forgot-heading">
          <h1>
            {step === 1 &&
              "Forgot your password?"}

            {step === 2 &&
              "Verify your OTP"}

            {step === 3 &&
              "Create new password"}

            {step === 4 &&
              "Password reset complete"}
          </h1>

          <p>
            {step === 1 &&
              "Enter your registered email address and we'll send you a password reset OTP."}

            {step === 2 &&
              `Enter the 6-digit OTP sent to ${email}.`}

            {step === 3 &&
              "Choose a strong new password for your YieldSense AI account."}

            {step === 4 &&
              "Your password has been successfully changed."}
          </p>
        </div>

        {/* =========================
            STEP 1
        ========================= */}
        {step === 1 && (
          <form
            onSubmit={handleSendOTP}
            className="forgot-form"
          >
            <div className="forgot-form-group">
              <label>
                Email Address <span>*</span>
              </label>

              <div className="forgot-input">
                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="forgot-error">
                {error}
              </div>
            )}

            {success && (
              <div className="forgot-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="forgot-primary-button"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send Reset OTP"}
            </button>
          </form>
        )}

        {/* =========================
            STEP 2
        ========================= */}
        {step === 2 && (
          <form
            onSubmit={handleVerifyOTP}
            className="forgot-form"
          >
            <div className="forgot-form-group">
              <label>
                Verification OTP <span>*</span>
              </label>

              <div className="forgot-input otp-input">
                <KeyRound size={18} />

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                    setOtp(value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="forgot-error">
                {error}
              </div>
            )}

            {success && (
              <div className="forgot-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="forgot-primary-button"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            <button
              type="button"
              className="forgot-secondary-button"
              onClick={handleResendOTP}
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send OTP Again"}
            </button>

            <button
              type="button"
              className="forgot-text-button"
              onClick={handleChangeEmail}
              disabled={loading}
            >
              Change email address
            </button>
          </form>
        )}

        {/* =========================
            STEP 3
        ========================= */}
        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
            className="forgot-form"
          >
            {/* NEW PASSWORD */}
            <div className="forgot-form-group">
              <label>
                New Password <span>*</span>
              </label>

              <div className="forgot-input">
                <Lock size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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

            {/* CONFIRM PASSWORD */}
            <div className="forgot-form-group">
              <label>
                Confirm Password <span>*</span>
              </label>

              <div className="forgot-input">
                <Lock size={18} />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="forgot-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* PASSWORD REQUIREMENT */}
            <div className="password-requirement">
              <ShieldCheck size={17} />

              <span>
                Password must contain at least 8
                characters.
              </span>
            </div>

            {error && (
              <div className="forgot-error">
                {error}
              </div>
            )}

            {success && (
              <div className="forgot-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="forgot-primary-button"
              disabled={loading}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </form>
        )}

        {/* =========================
            STEP 4
        ========================= */}
        {step === 4 && (
          <div className="reset-complete">
            <div className="complete-icon">
              <CheckCircle2 size={42} />
            </div>

            <p>
              You can now sign in using your new
              password.
            </p>

            <button
              type="button"
              className="forgot-primary-button"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        )}

        {/* BACK TO LOGIN */}
        {step !== 4 && (
          <Link
            to="/login"
            className="back-to-login"
          >
            <ArrowLeft size={17} />
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;