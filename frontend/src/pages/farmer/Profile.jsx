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
  Trash2,
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
  const [deletingImage, setDeletingImage] = useState(false);

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
        err?.message || "Unable to load your profile."
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

      const updatedProfile =
        await api.updateCurrentUser(formData);

      console.log("UPDATED PROFILE:", updatedProfile);

      if (!updatedProfile) {
        throw new Error(
          "Profile update returned no user data."
        );
      }

      setProfile(updatedProfile);

      setFormData({
        full_name: updatedProfile.full_name || "",
        phone: updatedProfile.phone || "",
        location: updatedProfile.location || "",
        state: updatedProfile.state || "",
        country: updatedProfile.country || "",
        farm_location:
          updatedProfile.farm_location || "",
        farm_size: updatedProfile.farm_size || "",
        soil_type: updatedProfile.soil_type || "",
        primary_crops:
          updatedProfile.primary_crops || "",
      });

      setEditMode(false);

      setSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
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
      farm_location:
        profile?.farm_location || "",
      farm_size: profile?.farm_size || "",
      soil_type: profile?.soil_type || "",
      primary_crops:
        profile?.primary_crops || "",
    });

    setError("");
    setEditMode(false);
  };

  // ============================================================
  // UPLOAD PROFILE IMAGE
  // ============================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    // Only image files
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      event.target.value = "";
      return;
    }

    try {
      setSaving(true);

      const updated =
        await api.uploadProfileImage(file);

      console.log(
        "PROFILE IMAGE UPDATED:",
        updated
      );

      if (!updated) {
        throw new Error(
          "Profile image upload returned no user data."
        );
      }

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
    } finally {
      setSaving(false);

      // Allows selecting same image again
      event.target.value = "";
    }
  };

  // ============================================================
  // DELETE PROFILE IMAGE
  // ============================================================

  const handleDeleteImage = async () => {
    // Safety check
    if (!profile?.profile_image) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingImage(true);
      setError("");
      setSuccess("");

      const updated =
        await api.deleteProfileImage();

      console.log(
        "PROFILE IMAGE DELETED:",
        updated
      );

      if (!updated) {
        throw new Error(
          "Profile image deletion returned no user data."
        );
      }

      // Update profile immediately
      setProfile(updated);

      setSuccess(
        "Profile picture removed successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Profile image delete error:",
        err
      );

      setError(
        err?.message ||
          "Unable to remove profile picture."
      );
    } finally {
      setDeletingImage(false);
    }
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
  // ERROR / NO PROFILE
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
      .filter(Boolean)
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
            onClick={() => {
              setError("");
              setSuccess("");
              setEditMode(true);
            }}
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
                <>
                  <Loader2
                    size={16}
                    className="profile-spinner"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>

          </div>
        )}
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="profile-success">
          <ShieldCheck size={17} />
          <span>{success}</span>
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="profile-error-message">
          <X size={17} />
          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          PROFILE HEADER CARD
      ===================================================== */}

      <section className="profile-hero">

        {/* ===================================================
            PROFILE PHOTO
        =================================================== */}

        <div className="profile-photo-section">

          <div className="profile-photo-wrapper">

            {/* PROFILE IMAGE */}

            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={
                  profile.full_name ||
                  "Profile"
                }
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo-placeholder">
                {initials}
              </div>
            )}

            {/* =============================================
                IMAGE ACTION BUTTONS
                ============================================= */}

            <div className="profile-photo-actions">

              {/* CAMERA / UPLOAD */}

              <label
                htmlFor="profile-image-upload"
                className="profile-camera-button"
                title={
                  profile.profile_image
                    ? "Change profile picture"
                    : "Upload profile picture"
                }
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="profile-button-spinner"
                  />
                ) : (
                  <Camera size={16} />
                )}

                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                  disabled={
                    saving ||
                    deletingImage
                  }
                />
              </label>

              {/* DELETE BUTTON */}

              {profile.profile_image && (
                <button
                  type="button"
                  className="profile-delete-image-button"
                  onClick={handleDeleteImage}
                  title="Remove profile picture"
                  disabled={
                    saving ||
                    deletingImage
                  }
                >
                  {deletingImage ? (
                    <Loader2
                      size={15}
                      className="profile-button-spinner"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              )}

            </div>

          </div>

          {/* ===============================================
              PROFILE NAME / ROLE
              =============================================== */}

          <div className="profile-photo-info">

            <h2>
              {profile.full_name ||
                "User"}
            </h2>

            <div className="profile-role">
              <ShieldCheck size={14} />

              <span>
                {profile.role || "farmer"}
              </span>
            </div>

            <p>
              {profile.profile_image
                ? "Use the camera to change your photo or trash icon to remove it."
                : "Add a profile picture using the camera button."}
            </p>

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
                  {profile.full_name ||
                    "Not provided"}
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
                {profile.email ||
                  "Not provided"}
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
                  {profile.phone ||
                    "Not provided"}
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
                {profile.role ||
                  "farmer"}
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
                    ).toLocaleDateString(
                      "en-IN"
                    )
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
                  {profile.location ||
                    "Not provided"}
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
                  {profile.state ||
                    "Not provided"}
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
                  {profile.country ||
                    "Not provided"}
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
                  value={
                    formData.farm_location
                  }
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
                  value={
                    formData.soil_type
                  }
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
                  value={
                    formData.primary_crops
                  }
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