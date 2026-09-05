import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import "../../styles/admin/Profile.css";


// ======================================================
// PROFILE
// ======================================================

const Profile = () => {
  const [user, setUser] = useState({});

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    state: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  // ====================================================
  // LOAD LOGGED-IN ADMIN
  // ====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        if (!storedUser || !storedUser.id) {
          throw new Error(
            "Unable to find logged-in user. Please login again."
          );
        }

        setUser(storedUser);

        setForm({
          full_name: storedUser.full_name || "",
          email: storedUser.email || "",
          phone: storedUser.phone || "",
          city: storedUser.city || "",
          district: storedUser.district || "",
          state: storedUser.state || "",
        });
      } catch (err) {
        console.error(
          "Unable to load admin profile:",
          err
        );

        setError(
          err.message ||
            "Unable to load profile information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);


  // ====================================================
  // HANDLE INPUT
  // ====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };


  // ====================================================
  // SAVE PROFILE
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }


      // ----------------------------------------------
      // ONLY EDITABLE FIELDS
      // ----------------------------------------------

      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
      };


      // ----------------------------------------------
      // BACKEND REQUEST
      // ----------------------------------------------

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "http://127.0.0.1:8000";

      const response = await fetch(
        `${baseUrl}/users/me`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );


      // ----------------------------------------------
      // READ RESPONSE
      // ----------------------------------------------

      const data = await response
        .json()
        .catch(() => ({}));


      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to update profile."
        );
      }


      // ----------------------------------------------
      // HANDLE DIFFERENT BACKEND RESPONSE SHAPES
      // ----------------------------------------------

      const updatedData =
        data?.user ||
        data?.profile ||
        data ||
        {};


      const updatedUser = {
        ...user,
        ...updatedData,
        ...payload,

        email:
          updatedData?.email ||
          user?.email ||
          form.email,
      };


      // ----------------------------------------------
      // UPDATE STATE
      // ----------------------------------------------

      setUser(updatedUser);

      setForm({
        full_name:
          updatedUser?.full_name || "",

        email:
          updatedUser?.email || "",

        phone:
          updatedUser?.phone || "",

        city:
          updatedUser?.city || "",

        district:
          updatedUser?.district || "",

        state:
          updatedUser?.state || "",
      });


      // ----------------------------------------------
      // UPDATE LOCAL STORAGE
      // ----------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );


      // ----------------------------------------------
      // SUCCESS
      // ----------------------------------------------

      setSuccess(
        "Profile updated successfully."
      );

    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="admin-profile-page">

        <div className="profile-loading">

          <RefreshCw
            size={28}
            className="admin-spin"
          />

          <span>
            Loading profile...
          </span>

        </div>

      </div>
    );
  }


  // ====================================================
  // PROFILE PAGE
  // ====================================================

  return (
    <div className="admin-profile-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-page-header">

        <div>

          <h1>
            Profile
          </h1>

          <p>
            Manage your administrator account
            information.
          </p>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="profile-message profile-success">

          <CheckCircle size={18} />

          <span>
            {success}
          </span>

        </div>
      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="profile-message profile-error">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =================================================
          PROFILE LAYOUT
      ================================================= */}

      <div className="profile-layout">


        {/* =================================================
            LEFT PROFILE SUMMARY
        ================================================= */}

        <div className="profile-summary-card">


          {/* AVATAR */}

          <div className="profile-avatar">

            {form.full_name
              ? form.full_name
                  .charAt(0)
                  .toUpperCase()
              : "A"}

          </div>


          {/* NAME */}

          <h2>
            {form.full_name ||
              "Administrator"}
          </h2>


          {/* EMAIL */}

          <p className="profile-summary-email">

            {form.email ||
              "admin@yieldsense.ai"}

          </p>


          {/* ROLE */}

          <div className="profile-role">

            <ShieldCheck size={16} />

            <span>
              Administrator
            </span>

          </div>


          <div className="profile-summary-divider" />


          {/* EMAIL INFO */}

          <div className="profile-summary-item">

            <Mail size={17} />

            <div>

              <span>
                Email
              </span>

              <strong>
                {form.email || "—"}
              </strong>

            </div>

          </div>


          {/* ROLE INFO */}

          <div className="profile-summary-item">

            <ShieldCheck size={17} />

            <div>

              <span>
                Role
              </span>

              <strong>
                Administrator
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT EDIT FORM
        ================================================= */}

        <div className="profile-form-card">


          {/* CARD HEADER */}

          <div className="profile-card-header">

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Update your account details below.
              </p>

            </div>


            <div className="profile-card-icon">

              <UserCircle size={24} />

            </div>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="profile-form"
          >


            {/* =================================================
                FULL NAME
            ================================================= */}

            <div className="profile-field">

              <label htmlFor="full_name">
                Full Name
              </label>

              <div className="profile-input-wrapper">

                <UserCircle size={18} />

                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="profile-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="profile-input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  disabled
                />

              </div>

              <small>
                Email address cannot be changed
                from the profile page.
              </small>

            </div>


            {/* =================================================
                PHONE
            ================================================= */}

            <div className="profile-field">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="profile-input-wrapper">

                <Phone size={18} />

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>

            </div>


            {/* =================================================
                CITY
            ================================================= */}

            <div className="profile-field">

              <label htmlFor="city">
                City
              </label>

              <div className="profile-input-wrapper">

                <MapPin size={18} />

                <input
                  id="city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />

              </div>

            </div>


            {/* =================================================
                DISTRICT
            ================================================= */}

            <div className="profile-field">

              <label htmlFor="district">
                District
              </label>

              <div className="profile-input-wrapper">

                <MapPin size={18} />

                <input
                  id="district"
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                />

              </div>

            </div>


            {/* =================================================
                STATE
            ================================================= */}

            <div className="profile-field">

              <label htmlFor="state">
                State
              </label>

              <div className="profile-input-wrapper">

                <MapPin size={18} />

                <input
                  id="state"
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />

              </div>

            </div>


            {/* =================================================
                SAVE
            ================================================= */}

            <div className="profile-form-actions">

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >

                {saving ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="admin-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />

                    Save Changes
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Profile;