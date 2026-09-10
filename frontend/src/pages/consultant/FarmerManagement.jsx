import React, { useEffect, useState } from "react";

import {
  Plus,
  Eye,
  Pencil,
  X,
  MapPin,
  Sprout,
  Mail,
  CalendarDays,
  Loader2,
} from "lucide-react";

import {
  getConsultantFarmers,
  createFarmer,
} from "../../services/api";

import "../../styles/consultant/FarmerManagement.css";

// ============================================================
// INITIAL
// ============================================================

const getInitial = (name) => {
  if (!name) return "?";

  return name
    .trim()
    .charAt(0)
    .toUpperCase();
};

// ============================================================
// FORMAT CROPS
// ============================================================

const formatCrops = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (Array.isArray(value)) {
    const result = value
      .filter(Boolean)
      .map((crop) => String(crop).trim())
      .filter(Boolean)
      .join(", ");

    return result || "—";
  }

  if (typeof value === "string") {
    const result = value.trim();

    return result || "—";
  }

  return String(value);
};

// ============================================================
// FORMAT FARMER
// ============================================================

const formatFarmer = (farmer = {}) => {
  /*
   * IMPORTANT:
   * primary_crops is the actual database field.
   *
   * Other names are kept only as fallbacks so that older
   * API responses do not break the page.
   */

  const cropValue =
    farmer.primary_crops ??
    farmer.primary_crop ??
    farmer.crops ??
    farmer.crop ??
    farmer.crop_types ??
    farmer.primaryCrop ??
    farmer.primaryCropTypes;

  return {
    id:
      farmer.id ??
      farmer._id ??
      farmer.user_id ??
      `farmer-${Date.now()}-${Math.random()}`,

    name:
      farmer.full_name ??
      farmer.name ??
      farmer.farmer_name ??
      "Unknown Farmer",

    email:
      farmer.email ??
      farmer.user_email ??
      "—",

    location:
      farmer.location ??
      farmer.farm_location ??
      farmer.address ??
      "—",

    farmSize:
      farmer.farm_size ??
      farmer.farmSize ??
      farmer.farm_area ??
      farmer.area ??
      "—",

    crops: formatCrops(cropValue),

    registered:
      farmer.created_at ??
      farmer.registered ??
      farmer.registered_date ??
      farmer.registration_date ??
      "—",

    status:
      farmer.status ??
      "active",

    phone:
      farmer.phone ??
      "—",

    state:
      farmer.state ??
      "—",

    country:
      farmer.country ??
      "—",

    soilType:
      farmer.soil_type ??
      "—",
  };
};

// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (value) => {
  if (!value || value === "—") {
    return "—";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

// ============================================================
// COMPONENT
// ============================================================

export default function FarmerManagement() {
  const [farmers, setFarmers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedFarmer, setSelectedFarmer] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [newFarmer, setNewFarmer] = useState({
    name: "",
    email: "",
    location: "",
    farmSize: "",
    crops: "",
  });

  // ============================================================
  // LOAD FARMERS
  // ============================================================

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getConsultantFarmers();

      console.log(
        "CONSULTANT FARMERS RESPONSE:",
        response
      );

      let farmerList = [];

      if (Array.isArray(response)) {
        farmerList = response;
      } else if (Array.isArray(response?.farmers)) {
        farmerList = response.farmers;
      } else if (Array.isArray(response?.data)) {
        farmerList = response.data;
      } else if (
        Array.isArray(response?.data?.farmers)
      ) {
        farmerList = response.data.farmers;
      } else if (
        Array.isArray(response?.results)
      ) {
        farmerList = response.results;
      }

      console.log(
        "FARMER LIST:",
        farmerList
      );

      /*
       * This is useful for checking whether primary_crops
       * is actually coming from the backend.
       */
      farmerList.forEach((farmer) => {
        console.log(
          "FARMER CROPS:",
          farmer.full_name,
          farmer.primary_crops
        );
      });

      const formattedFarmers =
        farmerList.map(formatFarmer);

      setFarmers(formattedFarmers);
    } catch (err) {
      console.error(
        "Failed to load farmers:",
        err
      );

      setError(
        err?.message ||
          "Failed to load farmers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ADD FARMER
  // ============================================================

  const handleAddFarmer = async (e) => {
    e.preventDefault();

    if (
      !newFarmer.name.trim() ||
      !newFarmer.email.trim()
    ) {
      setError(
        "Farmer name and email are required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * IMPORTANT:
       *
       * Database field = primary_crops
       *
       * Previously this form sent:
       * crops
       *
       * Now it sends:
       * primary_crops
       */

      const farmerData = {
        full_name:
          newFarmer.name.trim(),

        name:
          newFarmer.name.trim(),

        email:
          newFarmer.email.trim(),

        location:
          newFarmer.location.trim() || null,

        farm_size:
          newFarmer.farmSize.trim() || null,

        primary_crops:
          newFarmer.crops.trim() || null,
      };

      console.log(
        "ADDING FARMER:",
        farmerData
      );

      const response =
        await createFarmer(farmerData);

      console.log(
        "CREATE FARMER RESPONSE:",
        response
      );

      /*
       * Some endpoints return:
       * { farmer: {...} }
       *
       * Some return:
       * {...}
       */

      const createdFarmer =
        response?.farmer ??
        response?.data?.farmer ??
        response?.data ??
        response;

      if (
        createdFarmer &&
        typeof createdFarmer === "object"
      ) {
        const formattedFarmer =
          formatFarmer(createdFarmer);

        setFarmers((previous) => [
          ...previous,
          formattedFarmer,
        ]);
      } else {
        await fetchFarmers();
      }

      setNewFarmer({
        name: "",
        email: "",
        location: "",
        farmSize: "",
        crops: "",
      });

      setShowAddModal(false);
    } catch (err) {
      console.error(
        "Failed to add farmer:",
        err
      );

      setError(
        err?.message ||
          "Failed to add farmer"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewFarmer((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ============================================================
  // CLOSE MODALS
  // ============================================================

  const closeFarmerModal = () => {
    setSelectedFarmer(null);
  };

  const closeAddModal = () => {
    if (saving) return;

    setShowAddModal(false);

    setNewFarmer({
      name: "",
      email: "",
      location: "",
      farmSize: "",
      crops: "",
    });
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="farmer-management-page">

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="fm-error">
          {error}

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ======================================================
          TOP ROW
      ====================================================== */}

      <div className="fm-top-row">

        <p className="fm-count">
          {loading
            ? "Loading farmers..."
            : `${farmers.length} farmers under management`}
        </p>

        <button
          type="button"
          className="fm-add-button"
          onClick={() =>
            setShowAddModal(true)
          }
          disabled={loading}
        >
          <Plus
            size={17}
            strokeWidth={2.5}
          />

          <span>
            Add Farmer
          </span>
        </button>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="fm-table-card">

        <div className="fm-table-wrapper">

          <table className="fm-table">

            <thead>
              <tr>

                <th className="fm-farmer-column">
                  FARMER
                </th>

                <th>
                  LOCATION
                </th>

                <th>
                  FARM SIZE
                </th>

                <th>
                  CROPS
                </th>

                <th>
                  REGISTERED
                </th>

                <th>
                  STATUS
                </th>

                <th className="fm-actions-column">
                  ACTIONS
                </th>

              </tr>
            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="fm-empty-cell"
                  >
                    <Loader2
                      size={28}
                      className="fm-loading-icon"
                    />

                    <p>
                      Loading farmers...
                    </p>
                  </td>
                </tr>
              ) : farmers.length === 0 ? (

                /* EMPTY */

                <tr>
                  <td
                    colSpan="7"
                    className="fm-empty-cell"
                  >
                    <p>
                      No farmers found.
                    </p>

                    <button
                      type="button"
                      className="fm-add-button"
                      onClick={() =>
                        setShowAddModal(true)
                      }
                    >
                      <Plus size={17} />

                      Add Your First Farmer
                    </button>
                  </td>
                </tr>

              ) : (

                /* FARMERS */

                farmers.map((farmer) => (
                  <tr key={farmer.id}>

                    {/* FARMER */}

                    <td>
                      <div className="fm-farmer">

                        <div className="fm-avatar">
                          {getInitial(
                            farmer.name
                          )}
                        </div>

                        <div className="fm-farmer-info">

                          <strong>
                            {farmer.name}
                          </strong>

                          <span>
                            {farmer.email}
                          </span>

                        </div>

                      </div>
                    </td>

                    {/* LOCATION */}

                    <td>
                      <span className="fm-location">
                        {farmer.location}
                      </span>
                    </td>

                    {/* FARM SIZE */}

                    <td>
                      <span className="fm-normal-text">
                        {farmer.farmSize}
                      </span>
                    </td>

                    {/* CROPS */}

                    <td>
                      <span
                        className={`fm-crops-text ${
                          farmer.crops === "—"
                            ? "empty"
                            : ""
                        }`}
                        title={farmer.crops}
                      >
                        {farmer.crops}
                      </span>
                    </td>

                    {/* REGISTERED */}

                    <td>
                      <span className="fm-date">
                        {formatDate(
                          farmer.registered
                        )}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`fm-status ${
                          farmer.status ===
                          "inactive"
                            ? "inactive"
                            : ""
                        }`}
                      >
                        {farmer.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="fm-actions">

                        <button
                          type="button"
                          className="fm-action-button view"
                          title="View Farmer"
                          onClick={() =>
                            setSelectedFarmer(
                              farmer
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="fm-action-button edit"
                          title="Edit Farmer"
                          onClick={() =>
                            setSelectedFarmer(
                              farmer
                            )
                          }
                        >
                          <Pencil size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* ======================================================
          VIEW FARMER MODAL
      ====================================================== */}

      {selectedFarmer && (
        <div
          className="fm-modal-overlay"
          onClick={closeFarmerModal}
        >

          <div
            className="fm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="fm-modal-header">

              <div>
                <h2>
                  Farmer Details
                </h2>

                <p>
                  View farmer information
                </p>
              </div>

              <button
                type="button"
                className="fm-close-button"
                onClick={closeFarmerModal}
              >
                <X size={20} />
              </button>

            </div>

            {/* PROFILE */}

            <div className="fm-profile-header">

              <div className="fm-modal-avatar">
                {getInitial(
                  selectedFarmer.name
                )}
              </div>

              <div className="fm-profile-header-info">

                <h3>
                  {selectedFarmer.name}
                </h3>

                <p>
                  {selectedFarmer.email}
                </p>

              </div>

            </div>

            {/* DETAILS */}

            <div className="fm-details-grid">

              <div className="fm-detail">
                <MapPin size={17} />

                <div>
                  <small>
                    Location
                  </small>

                  <strong>
                    {selectedFarmer.location}
                  </strong>
                </div>
              </div>

              <div className="fm-detail">
                <Sprout size={17} />

                <div>
                  <small>
                    Farm Size
                  </small>

                  <strong>
                    {selectedFarmer.farmSize}
                  </strong>
                </div>
              </div>

              <div className="fm-detail">
                <Mail size={17} />

                <div>
                  <small>
                    Email
                  </small>

                  <strong>
                    {selectedFarmer.email}
                  </strong>
                </div>
              </div>

              <div className="fm-detail">
                <CalendarDays size={17} />

                <div>
                  <small>
                    Registered
                  </small>

                  <strong>
                    {formatDate(
                      selectedFarmer.registered
                    )}
                  </strong>
                </div>
              </div>

            </div>

            {/* CROPS */}

            <div className="fm-crops-box">

              <div className="fm-crops-title">
                <Sprout size={16} />

                <span>
                  Primary Crops
                </span>
              </div>

              <strong>
                {selectedFarmer.crops}
              </strong>

            </div>

            {/* FOOTER */}

            <div className="fm-modal-footer">

              <span
                className={`fm-status ${
                  selectedFarmer.status ===
                  "inactive"
                    ? "inactive"
                    : ""
                }`}
              >
                {selectedFarmer.status}
              </span>

              <button
                type="button"
                className="fm-modal-close"
                onClick={closeFarmerModal}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================
          ADD FARMER MODAL
      ====================================================== */}

      {showAddModal && (
        <div
          className="fm-modal-overlay"
          onClick={closeAddModal}
        >

          <div
            className="fm-modal fm-add-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="fm-modal-header">

              <div>
                <h2>
                  Add Farmer
                </h2>

                <p>
                  Add a farmer under your management
                </p>
              </div>

              <button
                type="button"
                className="fm-close-button"
                onClick={closeAddModal}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleAddFarmer}
              className="fm-form"
            >

              <label>
                Farmer Name

                <input
                  type="text"
                  name="name"
                  value={newFarmer.name}
                  onChange={handleInputChange}
                  placeholder="Enter farmer name"
                  required
                />
              </label>

              <label>
                Email

                <input
                  type="email"
                  name="email"
                  value={newFarmer.email}
                  onChange={handleInputChange}
                  placeholder="farmer@example.com"
                  required
                />
              </label>

              <label>
                Location

                <input
                  type="text"
                  name="location"
                  value={newFarmer.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              </label>

              <label>
                Farm Size

                <input
                  type="text"
                  name="farmSize"
                  value={newFarmer.farmSize}
                  onChange={handleInputChange}
                  placeholder="e.g. 10 acres"
                />
              </label>

              <label>
                Primary Crops

                <input
                  type="text"
                  name="crops"
                  value={newFarmer.crops}
                  onChange={handleInputChange}
                  placeholder="e.g. Wheat, Rice"
                />
              </label>

              <div className="fm-form-actions">

                <button
                  type="button"
                  className="fm-cancel-button"
                  onClick={closeAddModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="fm-save-button"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="fm-loading-icon"
                      />

                      Adding...
                    </>
                  ) : (
                    "Add Farmer"
                  )}

                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}