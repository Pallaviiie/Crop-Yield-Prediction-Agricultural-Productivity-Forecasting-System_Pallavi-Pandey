import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  X,
  User,
  MapPin,
  Sprout,
  CalendarDays,
  Droplets,
  Thermometer,
  Wind,
  FlaskConical,
  Gauge,
  MessageSquare,
  Loader2,
  Check,
  Send,
} from "lucide-react";

import api from "../../services/api";

import "../../styles/consultant/PredictionReview.css";


// ============================================================
// HELPERS
// ============================================================

const formatNumber = (
  value,
  decimals = 2
) => {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(decimals);
};


const formatDate = (value) => {

  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {

  pending: {
    label: "Pending",
    className: "pending",
    icon: Clock,
  },

  approved: {
    label: "Approved",
    className: "approved",
    icon: CheckCircle2,
  },

  needs_changes: {
    label: "Needs Changes",
    className: "needs-changes",
    icon: AlertTriangle,
  },

  rejected: {
    label: "Rejected",
    className: "rejected",
    icon: XCircle,
  },
};


// ============================================================
// COMPONENT
// ============================================================

export default function PredictionReview() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [predictions, setPredictions] =
    useState([]);

  const [summary, setSummary] =
    useState({
      total: 0,
      pending: 0,
      approved: 0,
      needs_changes: 0,
      rejected: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [selectedPrediction, setSelectedPrediction] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [comment, setComment] =
    useState("");

  const [savingStatus, setSavingStatus] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadPredictions = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response =
        await api.getPredictionReviews();

      setPredictions(
        response?.predictions || []
      );

      setSummary(
        response?.summary || {
          total: 0,
          pending: 0,
          approved: 0,
          needs_changes: 0,
          rejected: 0,
        }
      );

    } catch (err) {

      console.error(
        "Prediction review error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load prediction reviews."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadPredictions();
  }, []);


  // ==========================================================
  // FILTERED PREDICTIONS
  // ==========================================================

  const filteredPredictions = useMemo(() => {

    const searchValue =
      search
        .trim()
        .toLowerCase();

    return predictions.filter(
      (prediction) => {

        const status =
          prediction?.review?.status ||
          "pending";

        const matchesFilter =
          filter === "all" ||
          status === filter;

        const matchesSearch =
          !searchValue ||
          String(
            prediction.farmer_name || ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          String(
            prediction.crop || ""
          )
            .toLowerCase()
            .includes(searchValue) ||

          String(
            prediction.area || ""
          )
            .toLowerCase()
            .includes(searchValue);

        return (
          matchesFilter &&
          matchesSearch
        );
      }
    );

  }, [
    predictions,
    search,
    filter,
  ]);


  // ==========================================================
  // OPEN REVIEW
  // ==========================================================

  const openReview = async (
    prediction
  ) => {

    try {

      setError("");

      const response =
        await api.getPredictionReview(
          prediction.id
        );

      const detailedPrediction =
        response?.prediction ||
        prediction;

      setSelectedPrediction(
        detailedPrediction
      );

      setComment(
        detailedPrediction?.review?.comment ||
        ""
      );

      setModalOpen(true);

    } catch (err) {

      console.error(err);

      setError(
        err?.message ||
        "Unable to load prediction details."
      );
    }
  };


  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {

    if (savingStatus) {
      return;
    }

    setModalOpen(false);

    setSelectedPrediction(null);

    setComment("");
  };


  // ==========================================================
  // SAVE REVIEW
  // ==========================================================

  const saveReview = async (
    status
  ) => {

    if (!selectedPrediction) {
      return;
    }

    // --------------------------------------------------------
    // Comment required for changes/rejection
    // --------------------------------------------------------

    if (
      (
        status === "needs_changes" ||
        status === "rejected"
      ) &&
      !comment.trim()
    ) {

      setError(
        status === "rejected"
          ? "Please provide a reason before rejecting the prediction."
          : "Please explain what needs to be changed."
      );

      return;
    }

    try {

      setSavingStatus(status);

      setError("");

      setSuccess("");

      const response =
        await api.reviewPrediction(
          selectedPrediction.id,
          status,
          comment
        );

      const updatedPrediction =
        response?.prediction;

      // ------------------------------------------------------
      // Update local list immediately
      // ------------------------------------------------------

      if (updatedPrediction) {

        setPredictions(
          (previous) =>
            previous.map(
              (prediction) =>
                prediction.id ===
                updatedPrediction.id
                  ? updatedPrediction
                  : prediction
            )
        );

        setSelectedPrediction(
          updatedPrediction
        );
      }

      setSuccess(
        status === "approved"
          ? "Prediction approved successfully."
          : status === "needs_changes"
          ? "Change request sent successfully."
          : status === "rejected"
          ? "Prediction rejected successfully."
          : "Review updated successfully."
      );

      // ------------------------------------------------------
      // Refresh summary
      // ------------------------------------------------------

      const refreshed =
        await api.getPredictionReviews();

      setPredictions(
        refreshed?.predictions || []
      );

      setSummary(
        refreshed?.summary || summary
      );

      // ------------------------------------------------------
      // Close after successful action
      // ------------------------------------------------------

      setTimeout(() => {

        setModalOpen(false);

        setSelectedPrediction(null);

        setComment("");

        setSuccess("");

      }, 700);

    } catch (err) {

      console.error(
        "Save review error:",
        err
      );

      setError(
        err?.message ||
        "Unable to save review."
      );

    } finally {

      setSavingStatus("");
    }
  };


  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const StatusBadge = ({
    status,
  }) => {

    const config =
      STATUS_CONFIG[status] ||
      STATUS_CONFIG.pending;

    const Icon = config.icon;

    return (
      <span
        className={`prediction-status ${config.className}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="prediction-review-page">

        <div className="prediction-review-loading">

          <Loader2
            size={30}
            className="prediction-review-spinner"
          />

          <p>
            Loading prediction reviews...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="prediction-review-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="prediction-review-header">

        <div>

          <div className="prediction-review-title-row">

            <div className="prediction-review-title-icon">
              <ClipboardCheck size={25} />
            </div>

            <div>

              <h1>
                Prediction Reviews
              </h1>

              <p>
                Review and validate crop yield predictions
                submitted by your farmers.
              </p>

            </div>

          </div>

        </div>

        <button
          className="prediction-refresh-btn"
          onClick={() =>
            loadPredictions(false)
          }
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (
        <div className="prediction-review-alert error">

          <AlertTriangle size={18} />

          <span>
            {error}
          </span>

          <button
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>

        </div>
      )}


      {/* ====================================================
          SUMMARY CARDS
      ==================================================== */}

      <div className="prediction-review-summary">

        <button
          className={`review-summary-card ${
            filter === "all"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("all")
          }
        >

          <div className="review-summary-icon total">
            <ClipboardCheck size={20} />
          </div>

          <div>

            <span>
              Total Predictions
            </span>

            <strong>
              {summary.total || 0}
            </strong>

          </div>

        </button>


        <button
          className={`review-summary-card ${
            filter === "pending"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("pending")
          }
        >

          <div className="review-summary-icon pending">
            <Clock size={20} />
          </div>

          <div>

            <span>
              Pending Review
            </span>

            <strong>
              {summary.pending || 0}
            </strong>

          </div>

        </button>


        <button
          className={`review-summary-card ${
            filter === "approved"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("approved")
          }
        >

          <div className="review-summary-icon approved">
            <CheckCircle2 size={20} />
          </div>

          <div>

            <span>
              Approved
            </span>

            <strong>
              {summary.approved || 0}
            </strong>

          </div>

        </button>


        <button
          className={`review-summary-card ${
            filter === "needs_changes"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("needs_changes")
          }
        >

          <div className="review-summary-icon changes">
            <AlertTriangle size={20} />
          </div>

          <div>

            <span>
              Needs Changes
            </span>

            <strong>
              {summary.needs_changes || 0}
            </strong>

          </div>

        </button>


        <button
          className={`review-summary-card ${
            filter === "rejected"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter("rejected")
          }
        >

          <div className="review-summary-icon rejected">
            <XCircle size={20} />
          </div>

          <div>

            <span>
              Rejected
            </span>

            <strong>
              {summary.rejected || 0}
            </strong>

          </div>

        </button>

      </div>


      {/* ====================================================
          TOOLBAR
      ==================================================== */}

      <div className="prediction-review-toolbar">

        <div className="prediction-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search farmer, crop or location..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              onClick={() =>
                setSearch("")
              }
            >
              <X size={15} />
            </button>
          )}

        </div>


        <div className="prediction-filter">

          <span>
            Filter:
          </span>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
          >

            <option value="all">
              All Predictions
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="needs_changes">
              Needs Changes
            </option>

            <option value="rejected">
              Rejected
            </option>

          </select>

        </div>

      </div>


      {/* ====================================================
          TABLE
      ==================================================== */}

      <div className="prediction-review-card">

        <div className="prediction-review-card-header">

          <div>

            <h2>
              Prediction Submissions
            </h2>

            <p>
              {filteredPredictions.length} prediction
              {filteredPredictions.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>


        {filteredPredictions.length === 0 ? (

          <div className="prediction-review-empty">

            <div className="prediction-empty-icon">
              <ClipboardCheck size={30} />
            </div>

            <h3>
              No predictions found
            </h3>

            <p>
              {predictions.length === 0
                ? "Your managed farmers have not submitted any predictions yet."
                : "No predictions match your current search or filter."}
            </p>

          </div>

        ) : (

          <div className="prediction-table-wrapper">

            <table className="prediction-review-table">

              <thead>

                <tr>

                  <th>
                    Farmer
                  </th>

                  <th>
                    Crop
                  </th>

                  <th>
                    Area
                  </th>

                  <th>
                    Predicted Yield
                  </th>

                  <th>
                    Confidence
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPredictions.map(
                  (prediction) => {

                    const status =
                      prediction?.review?.status ||
                      "pending";

                    return (
                      <tr
                        key={prediction.id}
                      >

                        <td>

                          <div className="farmer-cell">

                            <div className="farmer-avatar">
                              {(
                                prediction.farmer_name ||
                                "F"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {prediction.farmer_name ||
                                  "Unknown Farmer"}
                              </strong>

                              <span>
                                {prediction.farmer_email ||
                                  `Farmer #${prediction.farmer_id}`}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="crop-name">
                            <Sprout size={15} />
                            {prediction.crop ||
                              "Unknown"}
                          </span>

                        </td>


                        <td>
                          {prediction.area || "—"}
                        </td>


                        <td>

                          <strong className="yield-value">
                            {formatNumber(
                              prediction.predicted_yield
                            )}
                          </strong>

                        </td>


                        <td>

                          <div className="confidence-cell">

                            <div className="confidence-bar">

                              <span
                                style={{
                                  width: `${Math.min(
                                    Number(
                                      prediction.confidence ||
                                      0
                                    ),
                                    100
                                  )}%`,
                                }}
                              />

                            </div>

                            <span>
                              {prediction.confidence || 0}%
                            </span>

                          </div>

                        </td>


                        <td>
                          {formatDate(
                            prediction.created_at
                          )}
                        </td>


                        <td>
                          <StatusBadge
                            status={status}
                          />
                        </td>


                        <td>

                          <button
                            className="review-view-btn"
                            onClick={() =>
                              openReview(
                                prediction
                              )
                            }
                          >

                            <Eye size={16} />

                            Review

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ====================================================
          REVIEW MODAL
      ==================================================== */}

      {modalOpen &&
        selectedPrediction && (

          <div
            className="prediction-modal-overlay"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closeModal();
              }

            }}
          >

            <div className="prediction-modal">

              {/* ------------------------------------------------
                  MODAL HEADER
              ------------------------------------------------ */}

              <div className="prediction-modal-header">

                <div>

                  <span>
                    Prediction Review
                  </span>

                  <h2>
                    {selectedPrediction.crop ||
                      "Crop"}{" "}
                    Prediction
                  </h2>

                </div>

                <button
                  className="modal-close-btn"
                  onClick={closeModal}
                  disabled={!!savingStatus}
                >
                  <X size={20} />
                </button>

              </div>


              {/* ------------------------------------------------
                  MODAL BODY
              ------------------------------------------------ */}

              <div className="prediction-modal-body">

                {/* Farmer */}

                <div className="review-detail-farmer">

                  <div className="review-detail-avatar">
                    {(
                      selectedPrediction.farmer_name ||
                      "F"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>
                      {selectedPrediction.farmer_name ||
                        "Unknown Farmer"}
                    </strong>

                    <span>
                      {selectedPrediction.farmer_email ||
                        "Farmer"}
                    </span>

                  </div>

                  <StatusBadge
                    status={
                      selectedPrediction?.review?.status ||
                      "pending"
                    }
                  />

                </div>


                {/* Prediction result */}

                <div className="prediction-result-box">

                  <div>

                    <span>
                      Predicted Yield
                    </span>

                    <strong>
                      {formatNumber(
                        selectedPrediction.predicted_yield
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {selectedPrediction.confidence ||
                        0}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Category
                    </span>

                    <strong>
                      {selectedPrediction.category ||
                        "Average"}
                    </strong>

                  </div>

                </div>


                {/* Input details */}

                <div className="review-section">

                  <h3>
                    <Sprout size={18} />
                    Prediction Information
                  </h3>

                  <div className="review-info-grid">

                    <div className="review-info-item">

                      <span>
                        <User size={15} />
                        Farmer
                      </span>

                      <strong>
                        {selectedPrediction.farmer_name ||
                          "—"}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <Sprout size={15} />
                        Crop
                      </span>

                      <strong>
                        {selectedPrediction.crop ||
                          "—"}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <MapPin size={15} />
                        Area
                      </span>

                      <strong>
                        {selectedPrediction.area ||
                          "—"}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <CalendarDays size={15} />
                        Year
                      </span>

                      <strong>
                        {selectedPrediction.year ||
                          "—"}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <Droplets size={15} />
                        Rainfall
                      </span>

                      <strong>
                        {formatNumber(
                          selectedPrediction.rainfall
                        )}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <Thermometer size={15} />
                        Temperature
                      </span>

                      <strong>
                        {formatNumber(
                          selectedPrediction.temperature
                        )}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <Droplets size={15} />
                        Humidity
                      </span>

                      <strong>
                        {formatNumber(
                          selectedPrediction.humidity
                        )}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <Wind size={15} />
                        Wind Speed
                      </span>

                      <strong>
                        {formatNumber(
                          selectedPrediction.wind_speed
                        )}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <FlaskConical size={15} />
                        Pesticides
                      </span>

                      <strong>
                        {formatNumber(
                          selectedPrediction.pesticides
                        )}
                      </strong>

                    </div>


                    <div className="review-info-item">

                      <span>
                        <Gauge size={15} />
                        Season
                      </span>

                      <strong>
                        {selectedPrediction.season ||
                          "—"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* Recommendation */}

                {selectedPrediction.recommendation && (

                  <div className="review-section">

                    <h3>
                      <MessageSquare size={18} />
                      AI Recommendation
                    </h3>

                    <div className="review-recommendation">

                      {selectedPrediction.recommendation}

                    </div>

                  </div>

                )}


                {/* Existing comment */}

                {selectedPrediction?.review?.comment &&
                  selectedPrediction?.review?.status !==
                    "pending" && (

                    <div className="previous-review">

                      <span>
                        Previous Consultant Review
                      </span>

                      <p>
                        {
                          selectedPrediction.review.comment
                        }
                      </p>

                    </div>
                  )}


                {/* Consultant comment */}

                <div className="review-section">

                  <h3>
                    <MessageSquare size={18} />
                    Consultant Comment
                  </h3>

                  <textarea
                    className="review-comment"
                    placeholder="Write your feedback, observations or reason for requesting changes..."
                    value={comment}
                    onChange={(event) =>
                      setComment(
                        event.target.value
                      )
                    }
                    disabled={!!savingStatus}
                    rows={4}
                  />

                  <small>
                    A comment is required when requesting
                    changes or rejecting a prediction.
                  </small>

                </div>

              </div>


              {/* ------------------------------------------------
                  MODAL FOOTER
              ------------------------------------------------ */}

              <div className="prediction-modal-footer">

                <button
                  className="modal-secondary-btn"
                  onClick={closeModal}
                  disabled={!!savingStatus}
                >
                  Cancel
                </button>


                <div className="review-action-buttons">

                  <button
                    className="review-action reject"
                    onClick={() =>
                      saveReview(
                        "rejected"
                      )
                    }
                    disabled={!!savingStatus}
                  >

                    {savingStatus ===
                    "rejected" ? (
                      <Loader2
                        size={16}
                        className="spin"
                      />
                    ) : (
                      <XCircle size={16} />
                    )}

                    Reject

                  </button>


                  <button
                    className="review-action changes"
                    onClick={() =>
                      saveReview(
                        "needs_changes"
                      )
                    }
                    disabled={!!savingStatus}
                  >

                    {savingStatus ===
                    "needs_changes" ? (
                      <Loader2
                        size={16}
                        className="spin"
                      />
                    ) : (
                      <AlertTriangle size={16} />
                    )}

                    Request Changes

                  </button>


                  <button
                    className="review-action approve"
                    onClick={() =>
                      saveReview(
                        "approved"
                      )
                    }
                    disabled={!!savingStatus}
                  >

                    {savingStatus ===
                    "approved" ? (
                      <Loader2
                        size={16}
                        className="spin"
                      />
                    ) : (
                      <Check size={16} />
                    )}

                    Approve

                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}