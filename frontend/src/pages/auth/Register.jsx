import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Leaf,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Sprout,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import "./Register.css";
import cropLogo from "../../assets/crop-logo.png";
const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",

    role: "farmer",

    city: "",
    district: "",
    state: "",
    country: "India",

    // Farmer
    farm_location: "",
    farm_size: "",
    soil_type: "",
    primary_crop: "",

    // Consultant
    specialization: "",
    experience: "",
    qualification: "",
    license_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const selectRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    setError("");
  };

  // ============================================================
  // STEP 1 VALIDATION
  // ============================================================

  const validateStepOne = () => {
    if (!formData.full_name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return false;
    }

    if (!formData.password) {
      setError("Please create a password.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return false;
    }

    if (!formData.role) {
      setError("Please select your role.");
      return false;
    }

    if (!formData.state) {
      setError("Please select your state.");
      return false;
    }

    return true;
  };

  // ============================================================
  // NEXT STEP
  // ============================================================

  const nextStep = () => {
    if (!validateStepOne()) {
      return;
    }

    setError("");
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // PREVIOUS STEP
  // ============================================================

  const previousStep = () => {
    setError("");
    setStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // STEP 2 VALIDATION
  // ============================================================

  const validateStepTwo = () => {
    if (formData.role === "farmer") {
      if (!formData.farm_location.trim()) {
        setError("Please enter your farm location.");
        return false;
      }

      if (!formData.farm_size) {
        setError("Please enter your farm size.");
        return false;
      }

      if (Number(formData.farm_size) <= 0) {
        setError("Farm size must be greater than 0.");
        return false;
      }

      if (!formData.soil_type) {
        setError("Please select your soil type.");
        return false;
      }

      if (!formData.primary_crop) {
        setError("Please select your primary crop.");
        return false;
      }
    }

    if (formData.role === "consultant") {
      if (!formData.specialization.trim()) {
        setError("Please enter your area of specialization.");
        return false;
      }

      if (!formData.experience) {
        setError("Please select your experience.");
        return false;
      }

      if (!formData.qualification.trim()) {
        setError("Please enter your qualification.");
        return false;
      }

      if (!formData.license_number.trim()) {
        setError("Please enter your license / registration number.");
        return false;
      }
    }

    return true;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStepTwo()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,

        phone: formData.phone.trim(),

        city: formData.city.trim() || null,
        district: formData.district.trim() || null,
        state: formData.state,
        country: formData.country || "India",

        farm_location: null,
        farm_size: null,
        soil_type: null,
        primary_crop: null,

        specialization: null,
        experience: null,
        qualification: null,
        license_number: null,
      };

      // Farmer data
      if (formData.role === "farmer") {
        payload.farm_location = formData.farm_location.trim();
        payload.farm_size = Number(formData.farm_size);
        payload.soil_type = formData.soil_type;
        payload.primary_crop = formData.primary_crop;
      }

      // Consultant data
      if (formData.role === "consultant") {
        payload.specialization = formData.specialization.trim();
        payload.experience = formData.experience;
        payload.qualification = formData.qualification.trim();
        payload.license_number = formData.license_number.trim();
      }

      console.log("Registration payload:", payload);

      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Registration failed."
        );
      }

      alert("Account created successfully! Please sign in.");

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* =========================================================
          LEFT PANEL
      ========================================================= */}

      <section className="register-left">

        <div className="brand">
  <img
    src={cropLogo}
    alt="YieldSense AI"
    className="brand-logo-image"
  />

  <div className="brand-name">
    YieldSense <span>AI</span>
  </div>
</div>

        <div className="left-content">

          <div className="progress-lines">
            <div
              className={`progress-line ${
                step >= 1 ? "active" : ""
              }`}
            />

            <div
              className={`progress-line ${
                step >= 2 ? "active" : ""
              }`}
            />
          </div>

          {step === 1 ? (
            <>
              <h1>
                Create your
                <br />
                account
              </h1>

              <p className="left-description">
                Join farmers and consultants using
                AI-powered agriculture.
              </p>
            </>
          ) : (
            <>
              <h1>
                Tell us about
                <br />
                your role
              </h1>

              <p className="left-description">
                Provide role-specific details for
                personalized recommendations.
              </p>
            </>
          )}

          <div className="benefits-list">

            <div className="benefit">
              <CheckCircle2 size={18} />
              <span>AI-powered yield predictions</span>
            </div>

            <div className="benefit">
              <CheckCircle2 size={18} />
              <span>Real-time weather integration</span>
            </div>

            <div className="benefit">
              <CheckCircle2 size={18} />
              <span>Expert consultant network</span>
            </div>

            <div className="benefit">
              <CheckCircle2 size={18} />
              <span>Soil & crop health monitoring</span>
            </div>

          </div>
        </div>

        <div className="left-footer">
          © 2026 YieldSense AI · Privacy · Terms
        </div>

      </section>

      {/* =========================================================
          RIGHT PANEL
      ========================================================= */}

      <section className="register-right">

        <div className="register-container">

          {/* =====================================================
              STEP 1
          ===================================================== */}

          {step === 1 ? (
            <>
              <div className="form-heading">
                <h2>Create your account</h2>

                <p>
                  Step 1 of 2 · Basic information
                </p>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="register-form"
              >

                {/* FULL NAME */}

                <div className="form-group">
                  <label>
                    Full Name <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <User size={18} />

                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="form-group">
                  <label>
                    Email Address <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <Mail size={18} />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div className="form-group">
                  <label>
                    Phone Number <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <Phone size={18} />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 xxxx-xxxxxx"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* PASSWORDS */}

                <div className="two-column">

                  <div className="form-group">
                    <label>
                      Password <span>*</span>
                    </label>

                    <div className="input-wrapper password-wrapper">
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
                        placeholder="8+ characters"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="eye-button"
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
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Confirm Password <span>*</span>
                    </label>

                    <div className="input-wrapper password-wrapper">
                      <Lock size={18} />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="eye-button"
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
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                </div>

                {/* ROLE */}

                <div className="form-group">

                  <label>
                    Register as <span>*</span>
                  </label>

                  <div className="role-options">

                    <button
                      type="button"
                      className={`role-card ${
                        formData.role === "farmer"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectRole("farmer")
                      }
                    >
                      <Sprout size={21} />

                      <div>
                        <strong>Farmer</strong>
                        <small>
                          Manage your farm
                        </small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`role-card ${
                        formData.role === "consultant"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectRole("consultant")
                      }
                    >
                      <Award size={21} />

                      <div>
                        <strong>
                          Agricultural Consultant
                        </strong>

                        <small>
                          Advise farmers
                        </small>
                      </div>
                    </button>

                  </div>

                  <div className="admin-note">
                    <ShieldCheck size={14} />
                    <span>
                      Admin registration is restricted.
                    </span>
                  </div>

                </div>

                {/* CITY + DISTRICT */}

                <div className="two-column">

                  <div className="form-group">
                    <label>City</label>

                    <div className="input-wrapper">
                      <MapPin size={18} />

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City Name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>District</label>

                    <div className="input-wrapper">
                      <MapPin size={18} />

                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="District Name"
                      />
                    </div>
                  </div>

                </div>

                {/* STATE */}

                <div className="form-group">

                  <label>
                    State <span>*</span>
                  </label>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select State
                    </option>

                    <option>Andhra Pradesh</option>
                    <option>Arunachal Pradesh</option>
                    <option>Assam</option>
                    <option>Bihar</option>
                    <option>Chhattisgarh</option>
                    <option>Goa</option>
                    <option>Gujarat</option>
                    <option>Haryana</option>
                    <option>Himachal Pradesh</option>
                    <option>Jharkhand</option>
                    <option>Karnataka</option>
                    <option>Kerala</option>
                    <option>Madhya Pradesh</option>
                    <option>Maharashtra</option>
                    <option>Manipur</option>
                    <option>Meghalaya</option>
                    <option>Mizoram</option>
                    <option>Nagaland</option>
                    <option>Odisha</option>
                    <option>Punjab</option>
                    <option>Rajasthan</option>
                    <option>Sikkim</option>
                    <option>Tamil Nadu</option>
                    <option>Telangana</option>
                    <option>Tripura</option>
                    <option>Uttar Pradesh</option>
                    <option>Uttarakhand</option>
                    <option>West Bengal</option>
                    <option>Delhi</option>
                  </select>

                </div>

                {/* COUNTRY */}

                <div className="form-group">

                  <label>Country</label>

                  <input
                    className="plain-input"
                    type="text"
                    value="India"
                    readOnly
                  />

                </div>

                {/* ERROR */}

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* NEXT */}

                <button
                  type="button"
                  className="primary-button"
                  onClick={nextStep}
                >
                  <span>Next: Role Details</span>
                  <ArrowRight size={18} />
                </button>

                <div className="login-link">
                  Already have an account?{" "}
                  <Link to="/login">Sign in</Link>
                </div>

              </form>
            </>
          ) : (

            /* =====================================================
               STEP 2
            ===================================================== */

            <>
              <div className="form-heading">
                <h2>Role-specific information</h2>

                <p>
                  Step 2 of 2 · Professional details
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="register-form"
              >

                {/* FARMER */}

                {formData.role === "farmer" && (
                  <>
                    <div className="role-info">
                      <Sprout size={21} />

                      <div>
                        <strong>Farmer Details</strong>

                        <p>
                          Provide your farm information
                          for accurate yield predictions.
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Farm Location / Village
                        <span>*</span>
                      </label>

                      <div className="input-wrapper">
                        <MapPin size={18} />

                        <input
                          type="text"
                          name="farm_location"
                          value={
                            formData.farm_location
                          }
                          onChange={handleChange}
                          placeholder="Village Bhai Rupa, Ludhiana"
                        />
                      </div>
                    </div>

                    <div className="two-column">

                      <div className="form-group">
                        <label>
                          Farm Size (acres)
                          <span>*</span>
                        </label>

                        <div className="input-wrapper">
                          <Sprout size={18} />

                          <input
                            type="number"
                            name="farm_size"
                            value={
                              formData.farm_size
                            }
                            onChange={handleChange}
                            placeholder="12.5"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          Soil Type <span>*</span>
                        </label>

                        <select
                          name="soil_type"
                          value={
                            formData.soil_type
                          }
                          onChange={handleChange}
                        >
                          <option value="">
                            Select Soil Type
                          </option>

                          <option>
                            Alluvial Soil
                          </option>

                          <option>
                            Black Soil
                          </option>

                          <option>
                            Red Soil
                          </option>

                          <option>
                            Laterite Soil
                          </option>

                          <option>
                            Desert Soil
                          </option>

                          <option>
                            Mountain Soil
                          </option>
                        </select>
                      </div>

                    </div>

                    <div className="form-group">
                      <label>
                        Primary Crop <span>*</span>
                      </label>

                      <select
                        name="primary_crop"
                        value={
                          formData.primary_crop
                        }
                        onChange={handleChange}
                      >
                        <option value="">
                          Select Primary Crop
                        </option>

                        <option>Wheat</option>
                        <option>Rice</option>
                        <option>Maize</option>
                        <option>Cotton</option>
                        <option>Sugarcane</option>
                        <option>Potato</option>
                        <option>Tomato</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </>
                )}

                {/* CONSULTANT */}

                {formData.role === "consultant" && (
                  <>
                    <div className="role-details-card">
                      <Award size={22} />

                      <div>
                        <strong>
                          Agricultural Consultant Details
                        </strong>

                        <p>
                          Tell us about your professional
                          experience and expertise.
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Highest Qualification
                        <span>*</span>
                      </label>

                      <input
                        className="plain-input"
                        type="text"
                        name="qualification"
                        value={
                          formData.qualification
                        }
                        onChange={handleChange}
                        placeholder="M.Sc Agriculture / Ph.D"
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Area of Specialization
                        <span>*</span>
                      </label>

                      <input
                        className="plain-input"
                        type="text"
                        name="specialization"
                        value={
                          formData.specialization
                        }
                        onChange={handleChange}
                        placeholder="Soil Science, Crop Protection..."
                      />
                    </div>

                    <div className="two-column">

                      <div className="form-group">
                        <label>
                          Years of Experience
                          <span>*</span>
                        </label>

                        <select
                          name="experience"
                          value={
                            formData.experience
                          }
                          onChange={handleChange}
                        >
                          <option value="">
                            Select Experience
                          </option>

                          <option value="0-2 years">
                            0–2 years
                          </option>

                          <option value="3-5 years">
                            3–5 years
                          </option>

                          <option value="6-10 years">
                            6–10 years
                          </option>

                          <option value="10+ years">
                            10+ years
                          </option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>
                          License / Registration No.
                          <span>*</span>
                        </label>

                        <input
                          className="plain-input"
                          type="text"
                          name="license_number"
                          value={
                            formData.license_number
                          }
                          onChange={handleChange}
                          placeholder="AGR/KA/2019/1234"
                        />
                      </div>

                    </div>
                  </>
                )}

                {/* ERROR */}

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* BUTTONS */}

                <div className="button-row">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={previousStep}
                  >
                    <ArrowLeft size={17} />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>

                </div>

                <div className="login-link">
                  Already have an account?{" "}
                  <Link to="/">Sign in</Link>
                </div>

              </form>
            </>
          )}

        </div>
      </section>
    </div>
  );
}

export default Register;