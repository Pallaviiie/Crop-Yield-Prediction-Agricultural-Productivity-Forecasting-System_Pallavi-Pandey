import { useEffect, useMemo, useState } from "react";

import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Leaf,
  Loader2,
  RefreshCw,
  Sprout,
  Thermometer,
  Wind,
  Activity,
  Database,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

import { api } from "../../services/api";

import {
  getLatestPrediction,
} from "../../services/predictionStorage";

import "../../styles/farmer/SoilHealth.css";


// ============================================================
// HELPERS
// ============================================================

const numberValue = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


const displayValue = (
  value,
  fallback = "—"
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return value;
};


// ============================================================
// COMPONENT
// ============================================================

const SoilHealth = () => {

  const [prediction, setPrediction] =
    useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD LATEST YIELD PREDICTION
  // ==========================================================

  const loadPrediction = () => {

    const latest =
      getLatestPrediction();

    console.log(
      "LATEST YIELD PREDICTION:",
      latest
    );

    setPrediction(latest);

    return latest;
  };


  // ==========================================================
  // ANALYZE SOIL
  // ==========================================================

  const analyzeLatestSoil = async (
    latestPrediction = prediction
  ) => {

    if (!latestPrediction) {

      setAnalysis(null);

      setError(
        "Please generate a Yield Prediction first. Soil Health uses your latest Yield Prediction."
      );

      return;

    }


    const crop =
      latestPrediction.crop ||
      latestPrediction.crop_type ||
      latestPrediction.item ||
      "";


    const soilType =
      latestPrediction.soilType ||
      latestPrediction.soil_type ||
      "";


    const temperature =
      latestPrediction.temperature ??
      latestPrediction.avg_temp;


    const humidity =
      latestPrediction.humidity;


    if (!crop || !soilType) {

      setError(
        "Crop and Soil Type are required. Please complete the Yield Prediction first."
      );

      return;

    }


    if (
      temperature === null ||
      temperature === undefined ||
      temperature === ""
    ) {

      setError(
        "Temperature is missing from the latest Yield Prediction."
      );

      return;

    }


    setLoading(true);
    setError("");
    setAnalysis(null);


    try {

      const payload = {

        temperature:
          numberValue(
            temperature
          ),

        humidity:
          numberValue(
            humidity
          ),

        soil_type:
          soilType,

        crop_type:
          crop,

      };


      console.log(
        "SOIL ANALYSIS REQUEST:",
        payload
      );


      const result =
        await api.analyzeSoil(
          payload
        );


      console.log(
        "SOIL ANALYSIS RESPONSE:",
        result
      );


      setAnalysis(result);

    }

    catch (err) {

      console.error(
        "Soil analysis error:",
        err
      );


      setError(
        err?.message ||
        "Unable to analyze soil."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // LOAD WHEN PAGE OPENS
  // ==========================================================

  useEffect(() => {

    const latest =
      loadPrediction();

    if (latest) {

      analyzeLatestSoil(
        latest
      );

    }

  }, []);


  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = () => {

    const latest =
      loadPrediction();

    setError("");

    if (!latest) {

      setAnalysis(null);

      setError(
        "No Yield Prediction found. Please generate a prediction first."
      );

      return;

    }

    analyzeLatestSoil(
      latest
    );

  };


  // ==========================================================
  // EXTRACT DATA
  // ==========================================================

  const soilHealth =
    analysis?.soil_health ||
    analysis?.soilHealth ||
    {};


  const parameters =
    analysis?.parameters ||
    {};


  const fertilizer =
    analysis?.fertilizer ||
    analysis?.fertilizer_recommendation ||
    {};


  const alerts =
    analysis?.alerts ||
    analysis?.soil_alerts ||
    [];


  // ==========================================================
  // NORMALIZED VALUES
  // ==========================================================

  const nitrogen =
    numberValue(
      parameters?.nitrogen?.value ??
      analysis?.nitrogen
    );


  const phosphorous =
    numberValue(
      parameters?.phosphorous?.value ??
      parameters?.phosphorus?.value ??
      analysis?.phosphorous ??
      analysis?.phosphorus
    );


  const potassium =
    numberValue(
      parameters?.potassium?.value ??
      analysis?.potassium
    );


  const moisture =
    numberValue(
      parameters?.moisture?.value ??
      analysis?.moisture
    );


  const humidity =
    numberValue(
      parameters?.humidity?.value ??
      analysis?.humidity ??
      prediction?.humidity
    );


  const temperature =
    numberValue(
      parameters?.temperature?.value ??
      analysis?.temperature ??
      prediction?.temperature ??
      prediction?.avg_temp
    );


  const soilScore =
    numberValue(
      soilHealth?.score ??
      analysis?.soil_health_score
    );


  const soilStatus =
    soilHealth?.status ||
    analysis?.soil_health_status ||
    (
      soilScore >= 80
        ? "Healthy"
        : soilScore >= 60
        ? "Moderate"
        : "Needs Attention"
    );


  const fertilizerName =
    fertilizer?.name ||
    fertilizer?.fertilizer_name ||
    analysis?.fertilizer_name ||
    analysis?.recommended_fertilizer ||
    "No fertilizer recommendation";


  const fertilizerMessage =
    fertilizer?.message ||
    fertilizer?.description ||
    analysis?.fertilizer_message ||
    "Use soil-test-based fertilizer application according to crop requirements.";


  // ==========================================================
  // CROP / SOIL
  // ==========================================================

  const selectedCrop =
    prediction?.crop ||
    prediction?.crop_type ||
    prediction?.item ||
    "—";


  const selectedSoil =
    prediction?.soilType ||
    prediction?.soil_type ||
    "—";


  const predictedYield =
    prediction?.predicted_yield !== undefined
      ? numberValue(
          prediction.predicted_yield
        )
      : null;


  const predictedYieldDisplay =
    predictedYield !== null
      ? (
          predictedYield > 100
            ? (
                predictedYield /
                10000
              ).toFixed(2)
            : predictedYield.toFixed(2)
        )
      : "—";


  // ==========================================================
  // PARAMETER STATUS
  // ==========================================================

  const getStatus =
    (
      value,
      type
    ) => {

      if (!Number.isFinite(value)) {
        return "Unknown";
      }


      if (
        type === "nitrogen" ||
        type === "phosphorous" ||
        type === "potassium"
      ) {

        if (value < 30) {
          return "Low";
        }

        if (value > 100) {
          return "High";
        }

        return "Good";

      }


      if (type === "moisture") {

        if (value < 25) {
          return "Low";
        }

        if (value > 75) {
          return "High";
        }

        return "Good";

      }


      return "Good";

    };


  // ==========================================================
  // PROGRESS
  // ==========================================================

  const nutrientMax =
    Math.max(
      100,
      nitrogen,
      phosphorous,
      potassium
    );


  const getBarWidth =
    (
      value,
      max = nutrientMax
    ) => {

      if (!max) {
        return 0;
      }

      return Math.min(
        100,
        Math.max(
          0,
          (value / max) * 100
        )
      );

    };


  // ==========================================================
  // GRAPH DATA
  // ==========================================================

  const nutrientChart =
    useMemo(
      () => [
        {
          label: "N",
          name: "Nitrogen",
          value: nitrogen,
        },
        {
          label: "P",
          name: "Phosphorous",
          value: phosphorous,
        },
        {
          label: "K",
          name: "Potassium",
          value: potassium,
        },
      ],
      [
        nitrogen,
        phosphorous,
        potassium,
      ]
    );


  const environmentChart =
    useMemo(
      () => [
        {
          label: "Moisture",
          value: moisture,
          unit: "%",
        },
        {
          label: "Humidity",
          value: humidity,
          unit: "%",
        },
        {
          label: "Temperature",
          value: temperature,
          unit: "°C",
        },
      ],
      [
        moisture,
        humidity,
        temperature,
      ]
    );


  // ==========================================================
  // PARAMETER CARD
  // ==========================================================

  const parameterCards = [

    {
      key: "nitrogen",
      title: "Nitrogen (N)",
      icon: Leaf,
      value: nitrogen,
      unit: "dataset units",
      status:
        parameters?.nitrogen?.status ||
        getStatus(
          nitrogen,
          "nitrogen"
        ),
      message:
        parameters?.nitrogen?.message ||
        (
          nitrogen < 30
            ? "Nitrogen level is low. Crop growth may be limited."
            : "Nitrogen level is suitable for the matched soil record."
        ),
    },

    {
      key: "phosphorous",
      title: "Phosphorous (P)",
      icon: Beaker,
      value: phosphorous,
      unit: "dataset units",
      status:
        parameters?.phosphorous?.status ||
        parameters?.phosphorus?.status ||
        getStatus(
          phosphorous,
          "phosphorous"
        ),
      message:
        parameters?.phosphorous?.message ||
        parameters?.phosphorus?.message ||
        (
          phosphorous < 30
            ? "Phosphorous level is low. Phosphorous supplementation may be required."
            : "Phosphorous level is suitable for the matched soil record."
        ),
    },

    {
      key: "potassium",
      title: "Potassium (K)",
      icon: Leaf,
      value: potassium,
      unit: "dataset units",
      status:
        parameters?.potassium?.status ||
        getStatus(
          potassium,
          "potassium"
        ),
      message:
        parameters?.potassium?.message ||
        (
          potassium < 30
            ? "Potassium level is low and may affect crop development."
            : "Potassium level is suitable for the matched soil record."
        ),
    },

    {
      key: "moisture",
      title: "Moisture",
      icon: Droplets,
      value: moisture,
      unit: "%",
      status:
        parameters?.moisture?.status ||
        getStatus(
          moisture,
          "moisture"
        ),
      message:
        parameters?.moisture?.message ||
        "Soil moisture obtained from the matched soil dataset record.",
    },

    {
      key: "humidity",
      title: "Humidity",
      icon: Wind,
      value: humidity,
      unit: "%",
      status:
        parameters?.humidity?.status ||
        "Good",
      message:
        "Humidity condition used for the soil analysis.",
    },

    {
      key: "temperature",
      title: "Temperature",
      icon: Thermometer,
      value: temperature,
      unit: "°C",
      status:
        parameters?.temperature?.status ||
        "Good",
      message:
        "Temperature condition from the latest Yield Prediction.",
    },

  ];


  // ==========================================================
  // ALERTS
  // ==========================================================

  const generatedAlerts =
    alerts.length
      ? alerts
      : parameterCards
          .filter(
            (item) =>
              item.status === "Low" ||
              item.status === "High"
          )
          .map(
            (item) => ({
              title:
                `${item.title} requires attention`,
              message:
                item.message,
              level:
                item.status === "Low"
                  ? "High"
                  : "Medium",
            })
          );


  // ==========================================================
  // NO PREDICTION SCREEN
  // ==========================================================

  if (!prediction) {

    return (

      <div className="soil-health-page">

        <div className="soil-empty-card">

          <div className="soil-empty-icon">
            <Sprout size={38} />
          </div>

          <h2>
            Soil Health Analysis
          </h2>

          <p>
            Generate a Yield Prediction first.
            Soil Health automatically uses your latest
            crop, soil, temperature and humidity values
            to find the closest matching soil record.
          </p>

          <div className="soil-empty-flow">

            <span>
              <TrendingUp size={16} />
              Yield Prediction
            </span>

            <span>→</span>

            <span>
              <Database size={16} />
              Soil Dataset
            </span>

            <span>→</span>

            <span>
              <Activity size={16} />
              Soil Health
            </span>

          </div>

          <button
            className="soil-refresh-button"
            onClick={handleRefresh}
          >
            <RefreshCw size={17} />
            Check Latest Prediction
          </button>

        </div>

      </div>

    );

  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (

    <div className="soil-health-page">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="soil-page-header">

        <div>

          <div className="soil-title-row">

            <div className="soil-main-icon">
              <Sprout size={22} />
            </div>

            <div>

              <h2>
                Soil Health Analysis
              </h2>

              <p>
                Soil health automatically analyzed from
                your latest Yield Prediction.
              </p>

            </div>

          </div>

        </div>


        <button
          className="soil-refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >

          {loading ? (
            <Loader2
              size={17}
              className="soil-spinner"
            />
          ) : (
            <RefreshCw size={17} />
          )}

          Refresh Analysis

        </button>

      </div>


      {/* ======================================================
          CONNECTED PREDICTION
      ====================================================== */}

      <section className="soil-connected-card">

        <div className="soil-connected-icon">
          <CheckCircle2 size={20} />
        </div>

        <div className="soil-connected-content">

          <strong>
            Connected to Latest Yield Prediction
          </strong>

          <p>
            Soil Health is using the crop, soil type,
            temperature and humidity from your latest
            prediction.
          </p>

        </div>

        <div className="soil-connected-badge">
          LIVE DATA
        </div>

      </section>


      {/* ======================================================
          PREDICTION SUMMARY
      ====================================================== */}

      <section className="soil-prediction-summary">

        <div className="soil-summary-item">

          <span>
            Selected Crop
          </span>

          <strong>
            {selectedCrop}
          </strong>

        </div>


        <div className="soil-summary-item">

          <span>
            Soil Type
          </span>

          <strong>
            {selectedSoil}
          </strong>

        </div>


        <div className="soil-summary-item">

          <span>
            Temperature
          </span>

          <strong>
            {displayValue(
              prediction.temperature ??
              prediction.avg_temp
            )} °C
          </strong>

        </div>


        <div className="soil-summary-item">

          <span>
            Humidity
          </span>

          <strong>
            {displayValue(
              prediction.humidity
            )} %
          </strong>

        </div>


        <div className="soil-summary-item">

          <span>
            Predicted Yield
          </span>

          <strong>
            {predictedYieldDisplay}
            {predictedYield !== null
              ? " t/ha"
              : ""}
          </strong>

        </div>

      </section>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="soil-error">

          <AlertTriangle size={19} />

          <div>

            <strong>
              Soil analysis could not be completed
            </strong>

            <span>
              {error}
            </span>

          </div>

        </div>

      )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div className="soil-loading-card">

          <Loader2
            size={25}
            className="soil-spinner"
          />

          <div>

            <strong>
              Analyzing soil dataset...
            </strong>

            <span>
              Matching your crop, soil type,
              temperature and humidity.
            </span>

          </div>

        </div>

      )}


      {analysis && !loading && (

        <>


          {/* ==================================================
              OVERALL SCORE
          ================================================== */}

          <section className="soil-score-card">

            <div className="soil-score-left">

              <span className="soil-score-label">
                Overall Soil Health
              </span>

              <div className="soil-score-row">

                <strong className="soil-score">
                  {soilScore}
                </strong>

                <span className="soil-score-total">
                  /100
                </span>

              </div>

              <span
                className={`soil-score-status ${
                  String(
                    soilStatus
                  ).toLowerCase()
                    .replace(
                      /\s+/g,
                      "-"
                    )
                }`}
              >
                {soilStatus}
              </span>

            </div>


            <div className="soil-score-message">

              <Activity size={25} />

              <div>

                <strong>
                  Soil Dataset Matched
                </strong>

                <p>
                  Nutrient and moisture values were
                  obtained from the closest matching
                  soil record for your prediction inputs.
                </p>

              </div>

            </div>

          </section>


          {/* ==================================================
              ANALYTICS
          ================================================== */}

          <section className="soil-analytics-section">

            <div className="soil-section-heading">

              <div className="soil-section-heading-icon">
                <Activity size={18} />
              </div>

              <div>

                <h3>
                  Soil Analytics
                </h3>

                <p>
                  Nutrient and environmental values from
                  your matched soil record.
                </p>

              </div>

            </div>


            {/* =================================================
                NUTRIENT GRAPH
            ================================================= */}

            <div className="soil-chart-card">

              <div className="soil-chart-header">

                <div>

                  <h4>
                    Nutrient Levels
                  </h4>

                  <span>
                    Values obtained from soil.csv
                  </span>

                </div>

                <Leaf size={20} />

              </div>


              <div className="soil-bar-chart">

                {nutrientChart.map(
                  (item) => (

                    <div
                      className="soil-bar-item"
                      key={item.label}
                    >

                      <div className="soil-bar-value">
                        {item.value}
                      </div>

                      <div className="soil-bar-track">

                        <div
                          className="soil-bar-fill"
                          style={{
                            height:
                              `${getBarWidth(
                                item.value
                              )}%`,
                          }}
                        />

                      </div>

                      <strong>
                        {item.label}
                      </strong>

                      <span>
                        {item.name}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* =================================================
                ENVIRONMENT GRAPH
            ================================================= */}

            <div className="soil-chart-card">

              <div className="soil-chart-header">

                <div>

                  <h4>
                    Environmental Conditions
                  </h4>

                  <span>
                    Moisture, humidity and temperature
                  </span>

                </div>

                <Thermometer size={20} />

              </div>


              <div className="soil-environment-grid">

                {environmentChart.map(
                  (item) => {

                    const max =
                      item.unit === "°C"
                        ? 50
                        : 100;

                    const width =
                      Math.min(
                        100,
                        Math.max(
                          0,
                          (item.value /
                            max) *
                            100
                        )
                      );


                    return (

                      <div
                        className="soil-environment-item"
                        key={item.label}
                      >

                        <div className="soil-environment-top">

                          <span>
                            {item.label}
                          </span>

                          <strong>
                            {item.value}
                            {item.unit}
                          </strong>

                        </div>

                        <div className="soil-environment-track">

                          <div
                            className="soil-environment-fill"
                            style={{
                              width:
                                `${width}%`,
                            }}
                          />

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </div>

          </section>


          {/* ==================================================
              PARAMETER CARDS
          ================================================== */}

          <section className="soil-parameters-section">

            <div className="soil-section-heading">

              <div className="soil-section-heading-icon">
                <FlaskConical size={18} />
              </div>

              <div>

                <h3>
                  Soil Parameters
                </h3>

                <p>
                  Detailed values from the matched dataset record.
                </p>

              </div>

            </div>


            <div className="soil-health-grid">

              {parameterCards.map(
                (item) => {

                  const Icon =
                    item.icon;

                  const progress =
                    item.key === "temperature"
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            (item.value /
                              50) *
                              100
                          )
                        )
                      : item.key === "humidity" ||
                        item.key === "moisture"
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            item.value
                          )
                        )
                      : getBarWidth(
                          item.value
                        );


                  return (

                    <div
                      className="soil-parameter-card"
                      key={item.key}
                    >

                      <div className="soil-parameter-header">

                        <div className="soil-parameter-icon">
                          <Icon size={17} />
                        </div>

                        <div>

                          <h4>
                            {item.title}
                          </h4>

                          <span>
                            {item.unit}
                          </span>

                        </div>

                      </div>


                      <div className="soil-parameter-value">

                        {item.value}

                      </div>


                      <div
                        className={`soil-parameter-status ${
                          String(
                            item.status
                          ).toLowerCase()
                        }`}
                      >

                        {item.status}

                      </div>


                      <div className="soil-parameter-track">

                        <div
                          className="soil-parameter-fill"
                          style={{
                            width:
                              `${progress}%`,
                          }}
                        />

                      </div>


                      <p>
                        {item.message}
                      </p>

                    </div>

                  );

                }
              )}

            </div>

          </section>


          {/* ==================================================
              FERTILIZER RECOMMENDATION
          ================================================== */}

          <section className="soil-fertilizer-card">

            <div className="soil-fertilizer-icon">
              <FlaskConical size={23} />
            </div>

            <div className="soil-fertilizer-content">

              <span className="soil-ai-label">
                AI SOIL RECOMMENDATION
              </span>

              <h3>
                Fertilizer Recommendation
              </h3>

              <div className="soil-fertilizer-name">
                {fertilizerName}
              </div>

              <p>
                {fertilizerMessage}
              </p>

            </div>

          </section>


          {/* ==================================================
              ALERTS
          ================================================== */}

          {generatedAlerts.length > 0 && (

            <section className="soil-alert-section">

              <div className="soil-section-heading">

                <div className="soil-section-heading-icon">
                  <ShieldAlert size={18} />
                </div>

                <div>

                  <h3>
                    Soil Analysis Alerts
                  </h3>

                  <p>
                    Important observations from your
                    soil analysis.
                  </p>

                </div>

              </div>


              <div className="soil-alert-grid">

                {generatedAlerts.map(
                  (alert, index) => (

                    <div
                      className="soil-alert-card"
                      key={index}
                    >

                      <div className="soil-alert-icon">
                        <AlertTriangle size={18} />
                      </div>

                      <div>

                        <strong>
                          {alert.title ||
                           alert.category ||
                           "Soil Alert"}
                        </strong>

                        <p>
                          {alert.message ||
                           alert.description ||
                           alert.text}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


        </>

      )}

    </div>

  );

};


export default SoilHealth;