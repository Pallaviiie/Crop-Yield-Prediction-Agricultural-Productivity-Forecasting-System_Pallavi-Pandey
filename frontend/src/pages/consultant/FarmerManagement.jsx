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
// GET INITIAL
// ============================================================

const getInitial = (name) => {
  if (!name) return "?";

  return name
    .trim()
    .charAt(0)
    .toUpperCase();
};


// ============================================================
// FORMAT FARMER DATA
// ============================================================
// Backend field names can be slightly different.
// This keeps the frontend compatible with common response names.
// ============================================================

const formatFarmer = (farmer) => {
  let crops = "—";

  // Handle all possible backend formats
  const cropValue =
    farmer.primary_crops ??
    farmer.crops ??
    farmer.crop ??
    farmer.crop_types ??
    farmer.primaryCrop ??
    farmer.primaryCropTypes;

  if (Array.isArray(cropValue)) {
    crops = cropValue
      .filter(Boolean)
      .map((crop) => String(crop).trim())
      .filter(Boolean)
      .join(", ");

    if (!crops) {
      crops = "—";
    }
  } else if (typeof cropValue === "string") {
    crops = cropValue.trim() || "—";
  } else if (cropValue !== null && cropValue !== undefined) {
    crops = String(cropValue);
  }

  return {
    id:
      farmer.id ??
      farmer._id ??
      farmer.user_id ??
      Date.now(),

    name:
      farmer.name ??
      farmer.full_name ??
      farmer.farmer_name ??
      "Unknown Farmer",

    email:
      farmer.email ??
      farmer.user_email ??
      "—",

    location:
      farmer.location ??
      farmer.address ??
      farmer.farm_location ??
      "—",

    farmSize:
      farmer.farmSize ??
      farmer.farm_size ??
      farmer.farm_area ??
      farmer.area ??
      "—",

    // IMPORTANT
    crops,

    registered:
      farmer.registered ??
      farmer.registered_date ??
      farmer.created_at ??
      farmer.registration_date ??
      "—",

    status:
      farmer.status ??
      "active",
  };
};


// ============================================================
// COMPONENT
// ============================================================

export default function FarmerManagement() {

  // ============================================================
  // STATE
  // ============================================================

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
  // LOAD FARMERS FROM BACKEND
  // ============================================================

  useEffect(() => {
    fetchFarmers();
  }, []);


  const fetchFarmers = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getConsultantFarmers();

      console.log(
        "CONSULTANT FARMERS RESPONSE:",
        response
      );


      // --------------------------------------------------------
      // Handle different possible backend response formats
      // --------------------------------------------------------

      let farmerList = [];

      if (Array.isArray(response)) {

        farmerList = response;

      } else if (Array.isArray(response?.farmers)) {

        farmerList = response.farmers;

      } else if (Array.isArray(response?.data)) {

        farmerList = response.data;

      } else if (Array.isArray(response?.data?.farmers)) {

        farmerList = response.data.farmers;

      }


      const formattedFarmers =
        farmerList.map(formatFarmer);


      setFarmers(formattedFarmers);

    } catch (err) {

      console.error(
        "Failed to load farmers:",
        err
      );

      setError(
        err.message ||
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
      return;
    }


    try {

      setSaving(true);
      setError("");


      // --------------------------------------------------------
      // Data sent to FastAPI
      // --------------------------------------------------------

      const farmerData = {

        name: newFarmer.name.trim(),

        email: newFarmer.email.trim(),

        location:
          newFarmer.location.trim() || null,

        farm_size:
          newFarmer.farmSize.trim() || null,

        crops:
          newFarmer.crops.trim() || null,

      };


      console.log(
        "ADDING FARMER:",
        farmerData
      );


      // --------------------------------------------------------
      // POST /chat/farmers
      // --------------------------------------------------------

      const response =
        await createFarmer(farmerData);


      console.log(
        "CREATE FARMER RESPONSE:",
        response
      );


      // --------------------------------------------------------
      // Add backend-created farmer to UI
      // --------------------------------------------------------

      const createdFarmer =
        response?.farmer ??
        response?.data ??
        response;


      if (createdFarmer) {

        const formattedFarmer =
          formatFarmer(createdFarmer);


        setFarmers((previous) => [
          ...previous,
          formattedFarmer,
        ]);

      } else {

        // If backend doesn't return the created
        // farmer, reload the list.

        await fetchFarmers();

      }


      // --------------------------------------------------------
      // Reset form
      // --------------------------------------------------------

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
        err.message ||
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
          className="fm-add-button"
          onClick={() => setShowAddModal(true)}
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
          FARMER TABLE
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


              {/* ==================================================
                  LOADING
              ================================================== */}

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
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

                /* ==================================================
                   NO FARMERS
                ================================================== */

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >

                    <p>
                      No farmers found.
                    </p>

                    <button
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

                /* ==================================================
                   FARMERS
                ================================================== */

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

                      <span className="fm-normal-text">

                        {farmer.crops}

                      </span>

                    </td>


                    {/* REGISTERED */}

                    <td>

                      <span className="fm-date">

                        {farmer.registered}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`fm-status ${
                          farmer.status === "inactive"
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
          onClick={() =>
            setSelectedFarmer(null)
          }
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
                className="fm-close-button"
                onClick={() =>
                  setSelectedFarmer(null)
                }
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


              <div>

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
                    {selectedFarmer.registered}
                  </strong>

                </div>

              </div>

            </div>


            {/* CROPS */}

            <div className="fm-crops-box">

              <span>
                Crops
              </span>

              <strong>
                {selectedFarmer.crops}
              </strong>

            </div>


            {/* FOOTER */}

            <div className="fm-modal-footer">

              <span
                className={`fm-status ${
                  selectedFarmer.status === "inactive"
                    ? "inactive"
                    : ""
                }`}
              >

                {selectedFarmer.status}

              </span>


              <button
                className="fm-modal-close"
                onClick={() =>
                  setSelectedFarmer(null)
                }
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
          onClick={() =>
            setShowAddModal(false)
          }
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
                className="fm-close-button"
                onClick={() =>
                  setShowAddModal(false)
                }
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

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

                Crops

                <input
                  type="text"
                  name="crops"
                  value={newFarmer.crops}
                  onChange={handleInputChange}
                  placeholder="e.g. Wheat, Rice"
                />

              </label>


              {/* FORM BUTTONS */}

              <div className="fm-form-actions">

                <button
                  type="button"
                  className="fm-cancel-button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
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