import { useEffect, useState } from "react";

import {
  Download,
  Eye,
  X,
  History,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { api } from "../../services/api";

import "../../styles/farmer/PredictionHistory.css";

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH PREDICTION HISTORY
  ===================================================== */

  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  const fetchPredictionHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.getPredictionHistory();

      /*
        Depending on your backend, the API may return:
        1. An array directly
        2. { predictions: [...] }
        3. { data: [...] }
      */

      const historyData = Array.isArray(data)
        ? data
        : data?.predictions ||
          data?.data ||
          [];

      setPredictions(historyData);
    } catch (err) {
      console.error("Prediction history error:", err);

      setError(
        err?.message ||
          "Unable to load prediction history."
      );

      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  /* =====================================================
     FORMAT NUMBER
  ===================================================== */

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return number.toFixed(decimals);
  };

  /* =====================================================
     CONFIDENCE
  ===================================================== */

  const getConfidence = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Math.min(Math.max(number, 0), 100);
  };

  /* =====================================================
     CATEGORY CLASS
  ===================================================== */

  const getCategoryClass = (category) => {
    if (!category) return "";

    const value = category.toLowerCase();

    if (
      value.includes("high") ||
      value.includes("good") ||
      value.includes("excellent")
    ) {
      return "high";
    }

    if (
      value.includes("low") ||
      value.includes("poor")
    ) {
      return "low";
    }

    return "medium";
  };

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const handleExport = () => {
    if (!predictions.length) {
      return;
    }

    const headers = [
      "ID",
      "Crop",
      "Area",
      "Year",
      "Rainfall",
      "Temperature",
      "Humidity",
      "Wind Speed",
      "Pesticides",
      "Predicted Yield",
      "Confidence",
      "Category",
      "Recommendation",
      "Created At",
    ];

    const rows = predictions.map((item, index) => [
      item.id ?? index + 1,
      item.crop ?? "",
      item.area ?? "",
      item.year ?? "",
      item.rainfall ?? "",
      item.temperature ?? "",
      item.humidity ?? "",
      item.wind_speed ?? "",
      item.pesticides ?? "",
      item.predicted_yield ?? "",
      item.confidence ?? "",
      item.category ?? "",
      item.recommendation ?? "",
      item.created_at ?? "",
    ]);

    const escapeCSV = (value) => {
      const stringValue = String(value ?? "");

      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "yieldsense_prediction_history.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };
  /* =====================================================
     VIEW PREDICTION
  ===================================================== */

  const handleViewPrediction = (prediction) => {
    setSelectedPrediction(prediction);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {
    setSelectedPrediction(null);
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">
          <Loader2
            size={28}
            className="history-loading-icon"
          />

          <p>Loading prediction history...</p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="history-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="history-top">

        <p>
          <History size={16} />

          {predictions.length}{" "}
          {predictions.length === 1
            ? "prediction"
            : "predictions"}{" "}
          made
        </p>

        <button
          className="export-button"
          onClick={handleExport}
          disabled={!predictions.length}
        >
          <Download size={17} />

          Export
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="history-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={fetchPredictionHistory}
          >
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!error && predictions.length === 0 && (
        <div className="history-empty">

          <div className="history-empty-icon">
            <History size={30} />
          </div>

          <h3>No predictions yet</h3>

          <p>
            Your crop yield predictions will
            appear here after you make a prediction.
          </p>

        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      {predictions.length > 0 && (
        <div className="history-table-card">

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>
                <tr>

                  <th>#</th>

                  <th>CROP</th>

                  <th>AREA</th>

                  <th>YEAR</th>

                  <th>RAINFALL</th>

                  <th>TEMPERATURE</th>

                  <th>PREDICTED YIELD</th>

                  <th>CONFIDENCE</th>

                  <th>CATEGORY</th>

                  <th>DATE</th>

                  <th>ACTIONS</th>

                </tr>
              </thead>

              <tbody>

                {predictions.map((item, index) => {

                  const confidence =
                    getConfidence(
                      item.confidence
                    );

                  return (
                    <tr
                      key={
                        item.id ??
                        item.created_at ??
                        index
                      }
                    >

                      {/* NUMBER */}

                      <td className="history-number">
                        {index + 1}
                      </td>

                      {/* CROP */}

                      <td className="crop-name">
                        {item.crop || "—"}
                      </td>

                      {/* AREA */}

                      <td>
                        {item.area || "—"}
                      </td>

                      {/* YEAR */}

                      <td>
                        {item.year || "—"}
                      </td>

                      {/* RAINFALL */}

                      <td>
                        {item.rainfall != null
                          ? `${formatNumber(
                              item.rainfall,
                              0
                            )} mm`
                          : "—"}
                      </td>

                      {/* TEMPERATURE */}

                      <td>
                        {item.temperature != null
                          ? `${formatNumber(
                              item.temperature,
                              1
                            )} °C`
                          : "—"}
                      </td>

                      {/* PREDICTED YIELD */}

                      <td className="predicted-yield">
                        {item.predicted_yield != null
                          ? `${formatNumber(
                              item.predicted_yield,
                              2
                            )} T/Ha`
                          : "—"}
                      </td>

                      {/* CONFIDENCE */}

                      <td>

                        <div className="confidence-cell">

                          <div className="confidence-track">

                            <div
                              className="confidence-fill"
                              style={{
                                width: `${confidence}%`,
                              }}
                            />

                          </div>

                          <span>
                            {item.confidence != null
                              ? `${item.confidence}%`
                              : "—"}
                          </span>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>

                        <span
                          className={`category-badge ${getCategoryClass(
                            item.category
                          )}`}
                        >
                          {item.category || "—"}
                        </span>

                      </td>

                      {/* DATE */}

                      <td>
                        {formatDate(
                          item.created_at
                        )}
                      </td>

                      {/* ACTION */}

                      <td className="actions-cell">
  <button
    type="button"
    className="view-prediction-btn"
    onClick={() => handleViewPrediction(item)}
    title="View prediction"
  >
    <Eye size={17} strokeWidth={2} />
  </button>
</td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =================================================
          PREDICTION DETAILS MODAL
      ================================================= */}

      {selectedPrediction && (

        <div
          className="prediction-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="prediction-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="prediction-modal-header">

              <h2>
                Prediction Details
              </h2>

              <button
                className="modal-close-button"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={21} />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="prediction-modal-content">

              {/* PREDICTED YIELD */}

              <div className="predicted-yield-box">

                <p>
                  Predicted Yield
                </p>

                <h1>
                  {selectedPrediction.predicted_yield != null
                    ? `${formatNumber(
                        selectedPrediction.predicted_yield,
                        2
                      )} T/Ha`
                    : "—"}
                </h1>

                <span>
                  Tonnes/Hectare
                </span>

              </div>

              {/* DETAILS */}

              <div className="prediction-details-grid">

                <div className="detail-box">
                  <span>Crop</span>

                  <strong>
                    {selectedPrediction.crop ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Area</span>

                  <strong>
                    {selectedPrediction.area ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Year</span>

                  <strong>
                    {selectedPrediction.year ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Rainfall</span>

                  <strong>
                    {selectedPrediction.rainfall != null
                      ? `${formatNumber(
                          selectedPrediction.rainfall,
                          0
                        )} mm`
                      : "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Temperature</span>

                  <strong>
                    {selectedPrediction.temperature != null
                      ? `${formatNumber(
                          selectedPrediction.temperature,
                          1
                        )} °C`
                      : "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Humidity</span>

                  <strong>
                    {selectedPrediction.humidity != null
                      ? `${formatNumber(
                          selectedPrediction.humidity,
                          1
                        )}%`
                      : "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Wind Speed</span>

                  <strong>
                    {selectedPrediction.wind_speed != null
                      ? formatNumber(
                          selectedPrediction.wind_speed,
                          2
                        )
                      : "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Pesticides</span>

                  <strong>
                    {selectedPrediction.pesticides != null
                      ? formatNumber(
                          selectedPrediction.pesticides,
                          2
                        )
                      : "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Confidence</span>

                  <strong>
                    {selectedPrediction.confidence != null
                      ? `${selectedPrediction.confidence}%`
                      : "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Category</span>

                  <strong>
                    {selectedPrediction.category ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Date</span>

                  <strong>
                    {formatDate(
                      selectedPrediction.created_at
                    )}
                  </strong>
                </div>

              </div>

              {/* AI RECOMMENDATION */}

              {selectedPrediction.recommendation && (
                <div className="modal-recommendation">

                  <span>
                    AI Recommendation
                  </span>

                  <p>
                    {
                      selectedPrediction.recommendation
                    }
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default PredictionHistory;