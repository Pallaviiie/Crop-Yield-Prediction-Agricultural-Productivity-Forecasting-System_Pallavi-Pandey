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


/* ============================================================
   API URL
   ============================================================ */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


/* ============================================================
   LOGIN COMPONENT
   ============================================================ */

function Login() {

  const navigate = useNavigate();


  /* ==========================================================
     STATE
     ========================================================== */

  const [role, setRole] = useState(
    "farmer"
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const [formData, setFormData] = useState({

    email: "",

    password: "",

    remember: false,

  });


  /* ==========================================================
     ERROR FORMATTER
     ========================================================== */

  const getErrorMessage = (data) => {

    if (!data) {

      return (
        "Something went wrong. Please try again."
      );

    }


    if (
      Array.isArray(
        data.detail
      )
    ) {

      return data.detail
        .map((item) => {

          if (
            typeof item ===
            "string"
          ) {

            return item;

          }

          return (
            item.msg ||
            "Invalid input"
          );

        })
        .join(", ");

    }


    if (
      typeof data.detail ===
      "string"
    ) {

      return data.detail;

    }


    if (
      typeof data.message ===
      "string"
    ) {

      return data.message;

    }


    return (
      "Unable to complete the request."
    );

  };


  /* ==========================================================
     INPUT CHANGE
     ========================================================== */

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));


    setError("");

  };


  /* ==========================================================
     ROLE CHANGE
     ========================================================== */

  const handleRoleChange = (
    selectedRole
  ) => {

    setRole(
      selectedRole
    );

    setError("");

  };


  /* ==========================================================
     REDIRECT
     ========================================================== */

  const redirectUser = (
    userRole
  ) => {

    const normalizedRole =
      String(
        userRole || ""
      )
        .toLowerCase()
        .trim();


    if (
      normalizedRole ===
      "farmer"
    ) {

      navigate(
        "/dashboard"
      );

      return;

    }


    if (

      normalizedRole ===
        "consultant" ||

      normalizedRole ===
        "agri_consultant"

    ) {

      navigate(
        "/consultant-dashboard"
      );

      return;

    }


    if (
      normalizedRole ===
      "admin"
    ) {

      navigate(
        "/admin-dashboard"
      );

      return;

    }


    navigate(
      "/dashboard"
    );

  };


  /* ==========================================================
     NORMAL LOGIN
     ========================================================== */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");


    const email =
      formData.email.trim();

    const password =
      formData.password;


    /* --------------------------------------------------------
       VALIDATION
       -------------------------------------------------------- */

    if (!email) {

      setError(
        "Please enter your email address."
      );

      return;

    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;

    }


    setLoading(true);


    try {

      /* ------------------------------------------------------
         REQUEST BODY
         ------------------------------------------------------ */

      const requestBody = {

        email: email,

        password: password,

      };


      console.log(
        "LOGIN REQUEST:",
        requestBody
      );


      /* ------------------------------------------------------
         API REQUEST
         ------------------------------------------------------ */

      const response =
        await fetch(
          `${API_URL}/users/login`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Accept:
                "application/json",

            },

            body:
              JSON.stringify(
                requestBody
              ),

          }
        );


      /* ------------------------------------------------------
         RESPONSE
         ------------------------------------------------------ */

      const data =
        await response.json();


      console.log(
        "LOGIN STATUS:",
        response.status
      );

      console.log(
        "LOGIN RESPONSE:",
        data
      );


      /* ------------------------------------------------------
         ERROR
         ------------------------------------------------------ */

      if (
        !response.ok
      ) {

        throw new Error(
          getErrorMessage(
            data
          )
        );

      }


      /* ------------------------------------------------------
         TOKEN CHECK
         ------------------------------------------------------ */

      if (
        !data.access_token
      ) {

        throw new Error(
          "Login succeeded, but the server did not return an access token."
        );

      }


      /* ------------------------------------------------------
         USER CHECK
         ------------------------------------------------------ */

      if (
        !data.user
      ) {

        throw new Error(
          "Login succeeded, but user information was not returned."
        );

      }


      /* ------------------------------------------------------
         STORAGE
         ------------------------------------------------------ */

      const storage =
        formData.remember
          ? localStorage
          : sessionStorage;


      storage.setItem(

        "access_token",

        data.access_token

      );


      storage.setItem(

        "user",

        JSON.stringify(
          data.user
        )

      );


      /* ------------------------------------------------------
         COMPATIBILITY STORAGE
         ------------------------------------------------------ */

      localStorage.setItem(

        "access_token",

        data.access_token

      );


      localStorage.setItem(

        "user",

        JSON.stringify(
          data.user
        )

      );


      console.log(
        "LOGIN SUCCESS:",
        data.user
      );


      /* ------------------------------------------------------
         REDIRECT
         ------------------------------------------------------ */

      redirectUser(
        data.user.role
      );


    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );


      setError(

        err.message ||

        "Unable to sign in. Please try again."

      );


    } finally {

      setLoading(false);

    }

  };


  /* ==========================================================
     GOOGLE LOGIN
     ========================================================== */

  const handleGoogleLogin =
    useGoogleLogin({

      onSuccess:
        async (
          tokenResponse
        ) => {

          setError("");

          setLoading(true);


          try {

            if (
              !tokenResponse?.access_token
            ) {

              throw new Error(
                "Google did not return an access token."
              );

            }


            const response =
              await fetch(
                `${API_URL}/auth/google`,
                {

                  method: "POST",

                  headers: {

                    "Content-Type":
                      "application/json",

                    Accept:
                      "application/json",

                  },

                  body:
                    JSON.stringify({

                      access_token:
                        tokenResponse.access_token,

                      role:
                        role,

                    }),

                }
              );


            const data =
              await response.json();


            console.log(
              "GOOGLE LOGIN STATUS:",
              response.status
            );


            console.log(
              "GOOGLE LOGIN RESPONSE:",
              data
            );


            if (
              !response.ok
            ) {

              throw new Error(
                getErrorMessage(
                  data
                )
              );

            }


            if (
              !data.access_token
            ) {

              throw new Error(
                "Google authentication succeeded, but no JWT was returned."
              );

            }


            if (
              !data.user
            ) {

              throw new Error(
                "Google authentication succeeded, but user information was not returned."
              );

            }


            localStorage.setItem(

              "access_token",

              data.access_token

            );


            localStorage.setItem(

              "user",

              JSON.stringify(
                data.user
              )

            );


            redirectUser(
              data.user.role
            );


          } catch (err) {

            console.error(
              "GOOGLE LOGIN ERROR:",
              err
            );


            setError(

              err.message ||

              "Google sign-in failed. Please try again."

            );


          } finally {

            setLoading(false);

          }

        },


      onError: () => {

        console.error(
          "Google Login Failed"
        );


        setError(
          "Google sign-in was cancelled or failed. Please try again."
        );


        setLoading(false);

      },

    });


  /* ==========================================================
     UI
     ========================================================== */

  return (

    <div className="login-page">


      {/* ======================================================
          LEFT SIDE
          ====================================================== */}

      <section

        className="login-left"

        style={{

          backgroundImage:
            `url(${farmHero})`,

        }}

      >

        <div className="login-overlay" />


        {/* BRAND */}

        <Link

          to="/"

          className="login-brand"

        >

          <div className="login-logo-circle">

            <img

              src={cropLogo}

              alt="YieldSense AI"

            />

          </div>


          <span>

            YieldSense{" "}

            <b>AI</b>

          </span>

        </Link>


        {/* LEFT CONTENT */}

        <div className="login-left-content">

          <h1>

            Grow with intelligence,

            <br />

            <span>
              harvest with confidence.
            </span>

          </h1>


          <p>

            Access real-time crop yield
            predictions, weather insights,
            and AI-powered farming
            recommendations.

          </p>


          {/* FEATURES */}

          <div className="feature-grid">


            <div className="login-feature-card">

              <div className="feature-icon">

                <Gauge size={20} />

              </div>

              <div>

                <strong>
                  94% Accuracy
                </strong>

                <span>
                  Yield predictions
                </span>

              </div>

            </div>


            <div className="login-feature-card">

              <div className="feature-icon">

                <CloudSun size={20} />

              </div>

              <div>

                <strong>
                  Live Weather
                </strong>

                <span>
                  Real-time data
                </span>

              </div>

            </div>


            <div className="login-feature-card">

              <div className="feature-icon">

                <Gauge size={20} />

              </div>

              <div>

                <strong>
                  Soil Health
                </strong>

                <span>
                  NPK monitoring
                </span>

              </div>

            </div>


            <div className="login-feature-card">

              <div className="feature-icon">

                <TrendingUp size={20} />

              </div>

              <div>

                <strong>
                  Analytics
                </strong>

                <span>
                  Smart insights
                </span>

              </div>

            </div>


          </div>

        </div>


        {/* TRUST */}

        <div className="login-trust">

          <span>

            <ShieldCheck
              size={16}
            />

            Secure

          </span>


          <span
            className="trust-divider"
          />


          <span>

            <Globe2
              size={16}
            />

            Trusted by 2,400+ farmers

          </span>

        </div>


      </section>


      {/* ======================================================
          RIGHT SIDE
          ====================================================== */}

      <section className="login-right">

        <div className="login-form-container">


          {/* HEADING */}

          <div className="login-heading">

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to your YieldSense AI account
            </p>

          </div>


          {/* ROLE TABS */}

          <div className="role-tabs">


            <button

              type="button"

              className={
                role === "farmer"
                  ? "active"
                  : ""
              }

              onClick={() =>
                handleRoleChange(
                  "farmer"
                )
              }

            >

              Farmer

            </button>


            <button

              type="button"

              className={
                role === "consultant"
                  ? "active"
                  : ""
              }

              onClick={() =>
                handleRoleChange(
                  "consultant"
                )
              }

            >

              Consultant

            </button>


            <button

              type="button"

              className={
                role === "admin"
                  ? "active"
                  : ""
              }

              onClick={() =>
                handleRoleChange(
                  "admin"
                )
              }

            >

              Admin

            </button>


          </div>


          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
          >


            {/* EMAIL */}

            <div
              className="login-form-group"
            >

              <label>

                Email Address{" "}

                <span>*</span>

              </label>


              <div
                className="login-input"
              >

                <Mail size={18} />


                <input

                  type="email"

                  name="email"

                  value={
                    formData.email
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="you@example.com"

                  autoComplete="email"

                  required

                />

              </div>

            </div>


            {/* PASSWORD */}

            <div
              className="login-form-group"
            >

              <label>

                Password{" "}

                <span>*</span>

              </label>


              <div
                className="login-input"
              >

                <Lock size={18} />


                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"

                  value={
                    formData.password
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter your password"

                  autoComplete="current-password"

                  required

                />


                <button

                  type="button"

                  className="password-toggle"

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


            {/* OPTIONS */}

            <div
              className="login-options"
            >

              <label
                className="remember-me"
              >

                <input

                  type="checkbox"

                  name="remember"

                  checked={
                    formData.remember
                  }

                  onChange={
                    handleChange
                  }

                />

                <span>
                  Remember me
                </span>

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


            {/* ERROR */}

            {error && (

              <div
                className="login-error"
              >

                {error}

              </div>

            )}


            {/* SIGN IN */}

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


            {/* GOOGLE */}

            {role !== "admin" && (

              <>

                <div
                  className="or-divider"
                >

                  <span />

                  <p>
                    or continue with
                  </p>

                  <span />

                </div>


                <button

                  type="button"

                  className="google-button"

                  onClick={() =>
                    handleGoogleLogin()
                  }

                  disabled={loading}

                >

                  <img

                    src={googleLogo}

                    alt="Google"

                    className="google-icon"

                  />


                  <span>
                    Continue with Google
                  </span>

                </button>

              </>

            )}

          </form>


          {/* REGISTER */}

          {role !== "admin" && (

            <p
              className="register-text"
            >

              Don't have an account?{" "}

              <Link
                to="/register"
              >

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