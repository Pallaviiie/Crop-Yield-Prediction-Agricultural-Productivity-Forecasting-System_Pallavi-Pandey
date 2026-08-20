import { useState } from "react";

import {
  AlertTriangle,
  Beaker,
  Droplets,
  Leaf,
  Thermometer,
  Wind,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";

import { api } from "../../services/api";

import "../../styles/farmer/SoilHealth.css";


const SoilHealth = () => {

  // ==========================================================
  // FORM
  // ==========================================================

  const [form, setForm] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    crop_type: "",
    nitrogen: "",
    potassium: "",
    phosphorous: "",
  });


  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================================
  // ANALYZE SOIL
  // ==========================================================

  const handleAnalyze = async (event) => {

    event.preventDefault();

    setError("");

    setAnalysis(null);

    try {

      setLoading(true);

      const payload = {
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        moisture: Number(form.moisture),

        soil_type: form.soil_type,
        crop_type: form.crop_type,

        nitrogen: Number(form.nitrogen),
        potassium: Number(form.potassium),
        phosphorous: Number(form.phosphorous),
      };


      const result = await api.analyzeSoil(payload);

      console.log(
        "SOIL ANALYSIS RESPONSE:",
        result
      );

      setAnalysis(result);

    } catch (err) {

      console.error(
        "Soil analysis error:",
        err
      );

      setError(
        err?.message ||
        "Unable to analyze soil."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // PARAMETERS
  // ==========================================================

  const parameters =
    analysis?.parameters || {};


  const parameterCards = [

    {
      key: "nitrogen",
      title: "Nitrogen (N)",
      icon: Leaf,
      data: parameters.nitrogen,
    },

    {
      key: "phosphorous",
      title: "Phosphorous (P)",
      icon: Beaker,
      data: parameters.phosphorous,
    },

    {
      key: "potassium",
      title: "Potassium (K)",
      icon: Leaf,
      data: parameters.potassium,
    },

    {
      key: "moisture",
      title: "Moisture",
      icon: Droplets,
      data: parameters.moisture,
    },

    {
      key: "humidity",
      title: "Humidity",
      icon: Wind,
      data: parameters.humidity,
    },

    {
      key: "temperature",
      title: "Temperature",
      icon: Thermometer,
      data: parameters.temperature,
    },

  ];


  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  const getStatusClass = (status) => {

    if (!status) {
      return "";
    }

    const value =
      status.toLowerCase();

    if (
      value === "good" ||
      value === "optimal" ||
      value === "healthy"
    ) {
      return "status-good";
    }

    return "status-warning";
  };


  // ==========================================================
  // PROGRESS
  // ==========================================================

  const getProgress = (data) => {

    if (!data) {
      return 0;
    }

    const value =
      Number(data.value);

    if (
      data.status === "Low"
    ) {
      return 30;
    }

    if (
      data.status === "High"
    ) {
      return 90;
    }

    if (
      data.status === "Optimal"
    ) {
      return 75;
    }

    if (
      data.status === "Good"
    ) {
      return 70;
    }

    return Math.min(
      100,
      Math.max(0, value)
    );
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div className="soil-health-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="soil-page-header">

        <div>

          <h2>
            Soil Health Analysis
          </h2>

          <p>
            Enter your soil conditions to get an
            AI-assisted soil health analysis and
            fertilizer recommendation.
          </p>

        </div>

      </div>


      {/* ====================================================
          INPUT FORM
      ==================================================== */}

      <section className="soil-input-card">

        <div className="soil-input-heading">

          <div>

            <h3>
              Soil Sample Information
            </h3>

            <p>
              Enter the values from your soil test.
            </p>

          </div>

        </div>


        <form
          className="soil-form"
          onSubmit={handleAnalyze}
        >

          <div className="soil-form-group">

            <label>
              Temperature (°C)
            </label>

            <input
              type="number"
              step="0.1"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              placeholder="e.g. 27"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Humidity (%)
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="humidity"
              value={form.humidity}
              onChange={handleChange}
              placeholder="e.g. 65"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Soil Moisture (%)
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="moisture"
              value={form.moisture}
              onChange={handleChange}
              placeholder="e.g. 42"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Soil Type
            </label>

            <input
              type="text"
              name="soil_type"
              value={form.soil_type}
              onChange={handleChange}
              placeholder="e.g. Loamy"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Crop Type
            </label>

            <input
              type="text"
              name="crop_type"
              value={form.crop_type}
              onChange={handleChange}
              placeholder="e.g. Rice"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Nitrogen (N)
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              name="nitrogen"
              value={form.nitrogen}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Phosphorous (P)
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              name="phosphorous"
              value={form.phosphorous}
              onChange={handleChange}
              placeholder="e.g. 30"
              required
            />

          </div>


          <div className="soil-form-group">

            <label>
              Potassium (K)
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              name="potassium"
              value={form.potassium}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />

          </div>


          <div className="soil-form-submit">

            <button
              type="submit"
              disabled={loading}
              className="soil-analyze-button"
            >

              {loading ? (

                <>
                  <Loader2
                    size={17}
                    className="soil-spinner"
                  />

                  Analyzing Soil...

                </>

              ) : (

                <>
                  <Search size={17} />

                  Analyze Soil
                </>

              )}

            </button>

          </div>

        </form>

      </section>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (

        <div className="soil-error">

          <AlertTriangle size={19} />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ====================================================
          RESULTS
      ==================================================== */}

      {analysis && (

        <>

          {/* =================================================
              OVERALL SCORE
          ================================================= */}

          <section className="soil-score-card">

            <div>

              <span className="soil-score-label">
                Overall Soil Health
              </span>

              <strong className="soil-score">
                {analysis.soil_health.score}
                <small>/100</small>
              </strong>

              <span
                className={
                  `soil-score-status ${
                    getStatusClass(
                      analysis.soil_health.status
                    )
                  }`
                }
              >
                {analysis.soil_health.status}
              </span>

            </div>


            <div className="soil-score-message">

              <CheckCircle2 size={24} />

              <p>
                Soil health is evaluated using
                nutrient and moisture conditions
                from your submitted sample.
              </p>

            </div>

          </section>


          {/* =================================================
              PARAMETER CARDS
          ================================================= */}

          <div className="soil-health-grid">

            {parameterCards.map((item) => {

              if (!item.data) {
                return null;
              }

              const Icon =
                item.icon;

              const progress =
                getProgress(item.data);

              return (

                <div
                  className="soil-card"
                  key={item.key}
                >

                  <div className="soil-card-header">

                    <h3>
                      <Icon size={16} />

                      {item.title}
                    </h3>

                    <span
                      className={
                        `soil-status ${
                          getStatusClass(
                            item.data.status
                          )
                        }`
                      }
                    >
                      {item.data.status}
                    </span>

                  </div>


                  <div className="soil-value">

                    {item.data.value}

                    {item.data.unit && (
                      <small>
                        {" "}
                        {item.data.unit}
                      </small>
                    )}

                  </div>


                  <div className="soil-progress-track">

                    <div
                      className="soil-progress-fill progress-green"
                      style={{
                        width:
                          `${progress}%`,
                      }}
                    />

                  </div>


                  <p className="soil-card-message">

                    {item.data.message}

                  </p>

                </div>

              );

            })}

          </div>


          {/* =================================================
              FERTILIZER RECOMMENDATION
          ================================================= */}

          {analysis.fertilizer_recommendation && (

            <section className="soil-recommendation-card">

              <div className="soil-recommendation-icon">

                <Leaf size={25} />

              </div>


              <div>

                <h2>
                  Fertilizer Recommendation
                </h2>

                <h3>

                  {
                    analysis
                      .fertilizer_recommendation
                      .fertilizer ||
                    "No recommendation"
                  }

                </h3>

                <p>

                  {
                    analysis
                      .fertilizer_recommendation
                      .reason
                  }

                </p>

              </div>

            </section>

          )}


          {/* =================================================
              ALERTS
          ================================================= */}

          <section className="soil-alert-card">

            <div className="soil-alert-header">

              <h2>
                Soil Analysis Alerts
              </h2>

            </div>


            <div className="weather-alert-list">

              {analysis.alerts.map(
                (alert, index) => (

                  <div
                    className={
                      `weather-alert ${
                        alert.severity === "good"
                          ? "good"
                          : "warning"
                      }`
                    }
                    key={
                      `${alert.type}-${index}`
                    }
                  >

                    <div className="alert-icon">

                      {alert.severity === "good" ? (

                        <CheckCircle2
                          size={17}
                        />

                      ) : (

                        <AlertTriangle
                          size={17}
                        />

                      )}

                    </div>


                    <div>

                      <strong>
                        {alert.title}
                      </strong>

                      <p>
                        {alert.message}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        </>

      )}

    </div>
  );
};


export default SoilHealth;