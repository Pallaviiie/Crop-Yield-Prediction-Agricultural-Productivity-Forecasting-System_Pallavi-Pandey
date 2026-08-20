import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  MapPin,
  Globe,
  Sprout,
  Ruler,
  Mountain,
  Leaf,
  Camera,
  Loader2,
  Save,
  X,
} from "lucide-react";

import { api } from "../../services/api";
import "../../styles/farmer/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    state: "",
    country: "",
    farm_location: "",
    farm_size: "",
    soil_type: "",
    primary_crops: "",
  });

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.getCurrentUser();

      console.log("PROFILE DATA:", data);

      setProfile(data);

      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        location: data.location || "",
        state: data.state || "",
        country: data.country || "",
        farm_location: data.farm_location || "",
        farm_size: data.farm_size || "",
        soil_type: data.soil_type || "",
        primary_crops: data.primary_crops || "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);

      setError(
        err?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // UPDATE PROFILE
  // ============================================================

 const handleSave = async () => {
  try {
    setSaving(true);
    setError("");
    setSuccess("");

    const response = await api.updateCurrentUser(formData);

    console.log("PROFILE UPDATE RESPONSE:", response);

    // Backend may return:
    // 1. { profile: {...} }
    // 2. { data: {...} }
    // 3. {...profile directly}
    const updatedProfile =
      response?.profile ||
      response?.data?.profile ||
      response?.data ||
      response;

    if (!updatedProfile) {
      throw new Error("Profile update returned no user data.");
    }

    console.log("UPDATED PROFILE:", updatedProfile);

    setProfile(updatedProfile);

    setFormData({
      full_name: updatedProfile.full_name || "",
      phone: updatedProfile.phone || "",
      location: updatedProfile.location || "",
      state: updatedProfile.state || "",
      country: updatedProfile.country || "",
      farm_location: updatedProfile.farm_location || "",
      farm_size: updatedProfile.farm_size || "",
      soil_type: updatedProfile.soil_type || "",
      primary_crops: updatedProfile.primary_crops || "",
    });

    setEditMode(false);
    setSuccess("Profile updated successfully.");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  } catch (err) {
    console.error("Profile update error:", err);

    setError(
      err?.message ||
        "Unable to update profile."
    );
  } finally {
    setSaving(false);
  }
};

  // ============================================================
  // CANCEL EDIT
  // ============================================================

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      state: profile?.state || "",
      country: profile?.country || "",
      farm_location: profile?.farm_location || "",
      farm_size: profile?.farm_size || "",
      soil_type: profile?.soil_type || "",
      primary_crops: profile?.primary_crops || "",
    });

    setEditMode(false);
  };

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile image must be smaller than 5 MB."
      );

      return;
    }

    // Only images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      return;
    }

    try {
      setError("");

      const updated = await api.uploadProfileImage(file);

      setProfile(updated);

      setSuccess(
        "Profile picture updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Profile image upload error:",
        err
      );

      setError(
        err?.message ||
          "Unable to upload profile image."
      );
    }

    // Allows selecting the same file again
    event.target.value = "";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader2
          size={34}
          className="profile-spinner"
        />

        <p>Loading your profile...</p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (!profile) {
    return (
      <div className="profile-error">
        <h3>Unable to load profile</h3>

        <p>
          {error ||
            "Something went wrong while loading your profile."}
        </p>

        <button onClick={loadProfile}>
          Try Again
        </button>
      </div>
    );
  }

  // ============================================================
  // INITIALS
  // ============================================================

  const initials =
    profile.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="profile-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="profile-page-header">
        <div>
          <h1>My Profile</h1>

          <p>
            Manage your YieldSense AI account information.
          </p>
        </div>

        {!editMode ? (
          <button
            className="profile-edit-btn"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        ) : (
          <div className="profile-edit-actions">

            <button
              className="profile-cancel-btn"
              onClick={handleCancel}
              disabled={saving}
            >
              <X size={16} />
              Cancel
            </button>

            <button
              className="profile-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="profile-spinner"
                />
              ) : (
                <Save size={16} />
              )}

              Save Changes
            </button>

          </div>
        )}
      </div>

      {/* =====================================================
          SUCCESS / ERROR
      ===================================================== */}

      {success && (
        <div className="profile-success">
          {success}
        </div>
      )}

      {error && (
        <div className="profile-error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          PROFILE HEADER CARD
      ===================================================== */}

      <section className="profile-hero">

        <div className="profile-photo-wrapper">

          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={profile.full_name}
              className="profile-photo"
            />
          ) : (
            <div className="profile-photo-placeholder">
              {initials}
            </div>
          )}

          <label
            htmlFor="profile-image-upload"
            className="profile-camera-button"
            title="Upload profile picture"
          >
            <Camera size={17} />

            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>

        </div>

        <div className="profile-hero-info">

          <h2>
            {profile.full_name || "Farmer"}
          </h2>

          <div className="profile-role">
            <ShieldCheck size={15} />

            {profile.role || "farmer"}
          </div>

          <div className="profile-email">
            <Mail size={15} />

            {profile.email}
          </div>

        </div>

      </section>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <section className="profile-section">

        <div className="profile-section-heading">

          <div>
            <h2>Personal Information</h2>

            <p>
              Your account and personal details
            </p>
          </div>

        </div>

        <div className="profile-info-grid">

          {/* FULL NAME */}

          <div className="profile-info-item">

            <User size={19} />

            <div>
              <span>Full Name</span>

              {editMode ? (
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.full_name || "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* EMAIL */}

          <div className="profile-info-item">

            <Mail size={19} />

            <div>
              <span>Email Address</span>

              <strong>
                {profile.email || "Not provided"}
              </strong>
            </div>

          </div>

          {/* PHONE */}

          <div className="profile-info-item">

            <Phone size={19} />

            <div>
              <span>Phone Number</span>

              {editMode ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.phone || "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* ROLE */}

          <div className="profile-info-item">

            <ShieldCheck size={19} />

            <div>
              <span>Account Role</span>

              <strong>
                {profile.role || "farmer"}
              </strong>
            </div>

          </div>

          {/* MEMBER SINCE */}

          <div className="profile-info-item">

            <CalendarDays size={19} />

            <div>
              <span>Member Since</span>

              <strong>
                {profile.created_at
                  ? new Date(
                      profile.created_at
                    ).toLocaleDateString("en-IN")
                  : "Not available"}
              </strong>
            </div>

          </div>

          {/* LOCATION */}

          <div className="profile-info-item">

            <MapPin size={19} />

            <div>
              <span>Location</span>

              {editMode ? (
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.location || "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* STATE */}

          <div className="profile-info-item">

            <MapPin size={19} />

            <div>
              <span>State</span>

              {editMode ? (
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.state || "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* COUNTRY */}

          <div className="profile-info-item">

            <Globe size={19} />

            <div>
              <span>Country</span>

              {editMode ? (
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.country || "Not provided"}
                </strong>
              )}
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FARM INFORMATION
      ===================================================== */}

      <section className="profile-section">

        <div className="profile-section-heading">

          <div>
            <h2>Farm Information</h2>

            <p>
              Information you provided during farmer registration
            </p>
          </div>

          <Sprout size={22} />

        </div>

        <div className="profile-info-grid">

          {/* FARM LOCATION */}

          <div className="profile-info-item">

            <MapPin size={19} />

            <div>
              <span>Farm Location</span>

              {editMode ? (
                <input
                  name="farm_location"
                  value={formData.farm_location}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.farm_location ||
                    "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* FARM SIZE */}

          <div className="profile-info-item">

            <Ruler size={19} />

            <div>
              <span>Farm Size</span>

              {editMode ? (
                <input
                  name="farm_size"
                  value={formData.farm_size}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.farm_size
                    ? `${profile.farm_size} hectare`
                    : "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* SOIL TYPE */}

          <div className="profile-info-item">

            <Mountain size={19} />

            <div>
              <span>Soil Type</span>

              {editMode ? (
                <input
                  name="soil_type"
                  value={formData.soil_type}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.soil_type ||
                    "Not provided"}
                </strong>
              )}
            </div>

          </div>

          {/* PRIMARY CROPS */}

          <div className="profile-info-item">

            <Leaf size={19} />

            <div>
              <span>Primary Crops</span>

              {editMode ? (
                <input
                  name="primary_crops"
                  value={formData.primary_crops}
                  onChange={handleChange}
                />
              ) : (
                <strong>
                  {profile.primary_crops ||
                    "Not provided"}
                </strong>
              )}
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Profile;