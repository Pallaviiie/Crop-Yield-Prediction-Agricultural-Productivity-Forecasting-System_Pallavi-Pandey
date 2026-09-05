import React, { useEffect, useState } from "react";

import {
  UserRound,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Award,
  BriefcaseBusiness,
  ShieldCheck,
  GraduationCap,
  FileBadge,
} from "lucide-react";

import {
  getConsultantProfile,
  updateConsultantProfile,
} from "../../services/api";

import "../../styles/consultant/Profile.css";

export default function Profile() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
    license_number: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getConsultantProfile();

      console.log("CONSULTANT PROFILE:", data);

      const profile =
        data?.consultant ||
        data?.profile ||
        data?.user ||
        data ||
        {};

      setForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        specialization: profile.specialization || "",
        experience: profile.experience || "",
        qualification: profile.qualification || "",
        license_number: profile.license_number || "",
        city: profile.city || "",
        district: profile.district || "",
        state: profile.state || "",
        country: profile.country || "India",
        bio: profile.bio || "",
      });

      updateLocalUser(profile);
    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);

      setError(
        err?.message || "Unable to load consultant profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // =========================================================
  // UPDATE LOCAL STORAGE
  // =========================================================

  const updateLocalUser = (profile) => {
    if (!profile) return;

    if (profile.full_name) {
      localStorage.setItem(
        "user_name",
        profile.full_name
      );
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);

      user.full_name =
        profile.full_name ?? user.full_name;

      user.name =
        profile.full_name ?? user.name;

      user.email =
        profile.email ?? user.email;

      user.phone =
        profile.phone ?? user.phone;

      user.specialization =
        profile.specialization ??
        user.specialization;

      user.experience =
        profile.experience ??
        user.experience;

      user.qualification =
        profile.qualification ??
        user.qualification;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } catch (err) {
      console.warn(
        "Could not update stored user:",
        err
      );
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    if (!form.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        specialization: form.specialization.trim(),
        experience: form.experience.trim(),
        qualification: form.qualification.trim(),
        license_number: form.license_number.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        country: form.country.trim() || "India",
        bio: form.bio.trim(),
      };

      console.log(
        "UPDATING CONSULTANT PROFILE:",
        payload
      );

      const data =
        await updateConsultantProfile(payload);

      console.log(
        "PROFILE UPDATE RESPONSE:",
        data
      );

      const updated =
        data?.consultant ||
        data?.profile ||
        data?.user ||
        data ||
        {};

      setForm((prev) => ({
        ...prev,
        ...updated,

        full_name:
          updated.full_name ??
          prev.full_name,

        email:
          updated.email ??
          prev.email,

        phone:
          updated.phone ??
          prev.phone,

        specialization:
          updated.specialization ??
          prev.specialization,

        experience:
          updated.experience ??
          prev.experience,

        qualification:
          updated.qualification ??
          prev.qualification,

        license_number:
          updated.license_number ??
          prev.license_number,

        city:
          updated.city ??
          prev.city,

        district:
          updated.district ??
          prev.district,

        state:
          updated.state ??
          prev.state,

        country:
          updated.country ??
          prev.country,

        bio:
          updated.bio ??
          prev.bio,
      }));

      updateLocalUser({
        ...form,
        ...updated,
      });

      setMessage(
        "Profile updated successfully."
      );

      // Automatically remove success message
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (err) {
      console.error(
        "PROFILE UPDATE ERROR:",
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

  // =========================================================
  // AVATAR
  // =========================================================

  const firstLetter =
    form.full_name?.trim()?.charAt(0)?.toUpperCase() ||
    "C";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="profile-page">

        <div className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              ACCOUNT SETTINGS
            </span>

            <h1>Consultant Profile</h1>

            <p>
              Manage your professional information
              and account details.
            </p>
          </div>
        </div>

        <div className="profile-loading-card">
          <Loader2
            size={22}
            className="profile-spinner"
          />

          <span>
            Loading profile...
          </span>
        </div>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="profile-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="profile-page-header">

        <div>
          <span className="profile-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Consultant Profile
          </h1>

          <p>
            Manage your professional information
            and account details.
          </p>
        </div>

      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="profile-alert profile-alert-error">
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS
          ===================================================== */}

      {message && (
        <div className="profile-alert profile-alert-success">
          <ShieldCheck size={16} />

          <span>
            {message}
          </span>
        </div>
      )}

      {/* =====================================================
          MAIN CARD
          ===================================================== */}

      <form
        className="profile-card"
        onSubmit={handleSubmit}
      >

        {/* ===================================================
            PROFILE INTRO
            =================================================== */}

        <div className="profile-intro">

          <div className="profile-avatar">
            {firstLetter}
          </div>

          <div className="profile-intro-content">

            <div className="profile-title-line">

              <h2>
                {form.full_name || "Consultant"}
              </h2>

              <span className="profile-badge">
                Consultant
              </span>

            </div>

            <p className="profile-specialization">
              {form.specialization ||
                "Agricultural Consultant"}
            </p>

            {form.email && (
              <div className="profile-email">
                <Mail size={14} />
                <span>{form.email}</span>
              </div>
            )}

          </div>

        </div>

        {/* ===================================================
            PERSONAL INFORMATION
            =================================================== */}

        <section className="profile-section">

          <div className="profile-section-header">

            <div className="profile-section-icon">
              <UserRound size={17} />
            </div>

            <div>
              <h3>
                Personal Information
              </h3>

              <p>
                Basic information associated
                with your account.
              </p>
            </div>

          </div>

          <div className="profile-form-grid">

            {/* FULL NAME */}

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <div className="profile-input-wrapper">

                <UserRound size={16} />

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-field">

              <label>
                Email
              </label>

              <div className="profile-input-wrapper profile-disabled">

                <Mail size={16} />

                <input
                  type="email"
                  value={form.email}
                  disabled
                />

              </div>

              <span className="profile-help">
                Email is managed by your account.
              </span>

            </div>

            {/* PHONE */}

            <div className="profile-field">

              <label>
                Phone
              </label>

              <div className="profile-input-wrapper">

                <Phone size={16} />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />

              </div>

            </div>

            {/* CITY */}

            <div className="profile-field">

              <label>
                City
              </label>

              <div className="profile-input-wrapper">

                <MapPin size={16} />

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                />

              </div>

            </div>

            {/* DISTRICT */}

            <div className="profile-field">

              <label>
                District
              </label>

              <div className="profile-input-wrapper">

                <MapPin size={16} />

                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="District"
                />

              </div>

            </div>

            {/* STATE */}

            <div className="profile-field">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />

            </div>

            {/* COUNTRY */}

            <div className="profile-field">

              <label>
                Country
              </label>

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            PROFESSIONAL INFORMATION
            =================================================== */}

        <section className="profile-section">

          <div className="profile-section-header">

            <div className="profile-section-icon">
              <Award size={17} />
            </div>

            <div>
              <h3>
                Professional Information
              </h3>

              <p>
                Information about your agricultural
                expertise and experience.
              </p>
            </div>

          </div>

          <div className="profile-form-grid">

            {/* SPECIALIZATION */}

            <div className="profile-field">

              <label>
                Specialization
              </label>

              <div className="profile-input-wrapper">

                <Award size={16} />

                <input
                  type="text"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Crop Management"
                />

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="profile-field">

              <label>
                Experience
              </label>

              <div className="profile-input-wrapper">

                <BriefcaseBusiness size={16} />

                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 years"
                />

              </div>

            </div>

            {/* QUALIFICATION */}

            <div className="profile-field">

              <label>
                Qualification
              </label>

              <div className="profile-input-wrapper">

                <GraduationCap size={16} />

                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="Educational qualification"
                />

              </div>

            </div>

            {/* LICENSE */}

            <div className="profile-field">

              <label>
                License / Registration Number
              </label>

              <div className="profile-input-wrapper">

                <FileBadge size={16} />

                <input
                  type="text"
                  name="license_number"
                  value={form.license_number}
                  onChange={handleChange}
                  placeholder="License / registration number"
                />

              </div>

            </div>

            {/* BIO */}

            <div className="profile-field profile-field-full">

              <label>
                Professional Bio
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write a short description about your agricultural expertise..."
                rows={5}
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <div className="profile-footer">

          <div className="profile-security">

            <ShieldCheck size={16} />

            <span>
              Your profile information is securely stored.
            </span>

          </div>

          <button
            type="submit"
            className="profile-save-btn"
            disabled={saving}
          >

            {saving ? (
              <>
                <Loader2
                  size={15}
                  className="profile-spinner"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={15} />

                Save Changes
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}