import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  RefreshCw,
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  X,
} from "lucide-react";

import { getAdminPredictions } from "../../services/adminApi";
import "../../styles/admin/Predictions.css";

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const loadPredictions = async () => {
    try {
      setLoading(true);

      const data = await getAdminPredictions();

      const predictionList = Array.isArray(data)
        ? data
        : data?.predictions ||
          data?.data ||
          [];

      setPredictions(predictionList);
    } catch (error) {
      console.error("Prediction loading error:", error);

      alert(
        error.message ||
          "Unable to load predictions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const formatNumber = (value) => {
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

    return number.toLocaleString("en-IN");
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN");
  };

  const getStatus = (prediction) => {
    const status = String(
      prediction?.status || "Completed"
    ).toLowerCase();

    if (
      status.includes("fail") ||
      status.includes("error")
    ) {
      return "Failed";
    }

    if (
      status.includes("pending") ||
      status.includes("processing")
    ) {
      return "Pending";
    }

    return "Completed";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "completed";

      case "Pending":
        return "pending";

      case "Failed":
        return "failed";

      default:
        return "completed";
    }
  };

  const filteredPredictions = useMemo(() => {
    const searchText = search.toLowerCase();

    return predictions.filter((prediction) => {
      const status = getStatus(prediction);

      const matchesSearch =
        String(prediction?.crop || "")
          .toLowerCase()
          .includes(searchText) ||
        String(prediction?.district || "")
          .toLowerCase()
          .includes(searchText) ||
        String(prediction?.season || "")
          .toLowerCase()
          .includes(searchText) ||
        String(prediction?.id || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    predictions,
    search,
    statusFilter,
  ]);

  const statistics = useMemo(() => {
    const completed = predictions.filter(
      (prediction) =>
        getStatus(prediction) === "Completed"
    ).length;

    const pending = predictions.filter(
      (prediction) =>
        getStatus(prediction) === "Pending"
    ).length;

    const failed = predictions.filter(
      (prediction) =>
        getStatus(prediction) === "Failed"
    ).length;

    const confidenceValues = predictions
      .map((prediction) => {
        const value = Number(
          prediction?.confidence
        );

        return Number.isNaN(value)
          ? null
          : value;
      })
      .filter(
        (value) => value !== null
      );

    const averageConfidence =
      confidenceValues.length > 0
        ? confidenceValues.reduce(
            (sum, value) =>
              sum + value,
            0
          ) / confidenceValues.length
        : 0;

    return {
      total: predictions.length,
      completed,
      pending,
      failed,
      averageConfidence,
    };
  }, [predictions]);

  return (
    <div className="admin-predictions-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-page-header">
        <div>
          <h1>Prediction Monitor</h1>

          <p>
            Monitor crop yield predictions
            generated across the YieldSense
            platform.
          </p>
        </div>

        <button
          type="button"
          className="prediction-refresh"
          onClick={loadPredictions}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "admin-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="prediction-stats">

        <div className="prediction-stat-card">
          <div className="prediction-stat-icon total">
            <Activity size={21} />
          </div>

          <div>
            <span>
              Total Predictions
            </span>

            <strong>
              {formatNumber(
                statistics.total
              )}
            </strong>
          </div>
        </div>

        <div className="prediction-stat-card">
          <div className="prediction-stat-icon success">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>
              Completed
            </span>

            <strong>
              {formatNumber(
                statistics.completed
              )}
            </strong>
          </div>
        </div>

        <div className="prediction-stat-card">
          <div className="prediction-stat-icon pending">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {formatNumber(
                statistics.pending
              )}
            </strong>
          </div>
        </div>

        <div className="prediction-stat-card">
          <div className="prediction-stat-icon confidence">
            <Activity size={21} />
          </div>

          <div>
            <span>
              Avg. Confidence
            </span>

            <strong>
              {statistics.averageConfidence
                ? `${statistics.averageConfidence.toFixed(
                    1
                  )}%`
                : "—"}
            </strong>
          </div>
        </div>

      </div>

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="prediction-toolbar">

        <div className="prediction-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search crop, district, season..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div className="prediction-filter">

          <label>
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>
          </select>

        </div>

        <div className="prediction-count">
          {filteredPredictions.length}{" "}
          {filteredPredictions.length === 1
            ? "Prediction"
            : "Predictions"}
        </div>

      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div className="prediction-card">

        {loading ? (
          <div className="prediction-loading">
            <RefreshCw
              size={30}
              className="admin-spin"
            />

            <span>
              Loading predictions...
            </span>
          </div>
        ) : filteredPredictions.length ===
          0 ? (
          <div className="prediction-empty">

            <div className="prediction-empty-icon">
              <Activity size={42} />
            </div>

            <h3>
              No predictions found
            </h3>

            <p>
              {search ||
              statusFilter !== "All"
                ? "No predictions match your current filters."
                : "There are no prediction records available."}
            </p>

          </div>
        ) : (
          <div className="prediction-table-wrapper">

            <table className="prediction-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Crop</th>
                  <th>District</th>
                  <th>Season</th>
                  <th>Predicted Yield</th>
                  <th>Confidence</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>

              <tbody>

                {filteredPredictions.map(
                  (prediction, index) => {
                    const status =
                      getStatus(
                        prediction
                      );

                    return (
                      <tr
                        key={
                          prediction?.id ||
                          index
                        }
                      >

                        {/* ID */}

                        <td>
                          <span className="prediction-id">
                            #
                            {prediction?.id ||
                              index + 1}
                          </span>
                        </td>

                        {/* CROP */}

                        <td>
                          <div className="prediction-crop">

                            <div className="prediction-crop-icon">
                              <Activity
                                size={17}
                              />
                            </div>

                            <strong>
                              {prediction?.crop ||
                                "Unknown"}
                            </strong>

                          </div>
                        </td>

                        {/* DISTRICT */}

                        <td>
                          {prediction?.district ||
                            "Unknown"}
                        </td>

                        {/* SEASON */}

                        <td>
                          {prediction?.season ||
                            "—"}
                        </td>

                        {/* YIELD */}

                        <td>
                          <strong className="prediction-yield">
                            {prediction?.yield !==
                              undefined &&
                            prediction?.yield !==
                              null
                              ? formatNumber(
                                  prediction.yield
                                )
                              : "—"}
                          </strong>
                        </td>

                        {/* CONFIDENCE */}

                        <td>
                          {prediction?.confidence !==
                            undefined &&
                          prediction?.confidence !==
                            null ? (
                            <div className="confidence-cell">

                              <div className="confidence-bar">
                                <div
                                  className="confidence-fill"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        Number(
                                          prediction.confidence
                                        ) || 0
                                      )
                                    )}%`,
                                  }}
                                />
                              </div>

                              <span>
                                {Number(
                                  prediction.confidence
                                ).toFixed(1)}
                                %
                              </span>

                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* DATE */}

                        <td>
                          <span className="prediction-date">
                            {formatDate(
                              prediction?.date ||
                                prediction?.created_at
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`prediction-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {status ===
                            "Completed" ? (
                              <CheckCircle
                                size={15}
                              />
                            ) : status ===
                              "Pending" ? (
                              <AlertCircle
                                size={15}
                              />
                            ) : (
                              <XCircle
                                size={15}
                              />
                            )}

                            {status}
                          </span>
                        </td>

                        {/* VIEW */}

                        <td>
                          <button
                            type="button"
                            className="prediction-view"
                            title="View prediction"
                            onClick={() =>
                              setSelectedPrediction(
                                prediction
                              )
                            }
                          >
                            <Eye
                              size={17}
                            />
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

      {/* =========================
          VIEW MODAL
      ========================= */}

      {selectedPrediction && (
        <div
          className="prediction-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setSelectedPrediction(
                null
              );
            }
          }}
        >

          <div className="prediction-modal">

            <div className="prediction-modal-header">

              <div>
                <h2>
                  Prediction Details
                </h2>

                <p>
                  Prediction #
                  {selectedPrediction.id ||
                    "—"}
                </p>
              </div>

              <button
                type="button"
                className="prediction-modal-close"
                onClick={() =>
                  setSelectedPrediction(
                    null
                  )
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="prediction-modal-body">

              <div className="prediction-detail-grid">

                <div className="prediction-detail">
                  <span>
                    Crop
                  </span>

                  <strong>
                    {selectedPrediction.crop ||
                      "Unknown"}
                  </strong>
                </div>

                <div className="prediction-detail">
                  <span>
                    District
                  </span>

                  <strong>
                    {selectedPrediction.district ||
                      "Unknown"}
                  </strong>
                </div>

                <div className="prediction-detail">
                  <span>
                    Season
                  </span>

                  <strong>
                    {selectedPrediction.season ||
                      "—"}
                  </strong>
                </div>

                <div className="prediction-detail">
                  <span>
                    Predicted Yield
                  </span>

                  <strong>
                    {selectedPrediction.yield !==
                    undefined &&
                    selectedPrediction.yield !==
                      null
                      ? formatNumber(
                          selectedPrediction.yield
                        )
                      : "—"}
                  </strong>
                </div>

                <div className="prediction-detail">
                  <span>
                    Confidence
                  </span>

                  <strong>
                    {selectedPrediction.confidence !==
                    undefined &&
                    selectedPrediction.confidence !==
                      null
                      ? `${Number(
                          selectedPrediction.confidence
                        ).toFixed(1)}%`
                      : "—"}
                  </strong>
                </div>

                <div className="prediction-detail">
                  <span>
                    Status
                  </span>

                  <strong>
                    {getStatus(
                      selectedPrediction
                    )}
                  </strong>
                </div>

                <div className="prediction-detail">
                  <span>
                    Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedPrediction.date ||
                        selectedPrediction.created_at
                    )}
                  </strong>
                </div>

              </div>

            </div>

            <div className="prediction-modal-footer">

              <button
                type="button"
                onClick={() =>
                  setSelectedPrediction(
                    null
                  )
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Predictions;