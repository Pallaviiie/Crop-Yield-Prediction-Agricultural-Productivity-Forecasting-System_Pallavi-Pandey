import React, { useEffect, useState } from "react";

import {
  Zap,
  Sprout,
  CloudRain,
  Thermometer,
  CalendarDays,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  generateRecommendations,
} from "../../services/api";

import {
  getLatestPrediction,
} from "../../services/predictionStorage";

import "../../styles/farmer/AIRecommendations.css";


const AIRecommendations = () => {

  const [prediction, setPrediction] =
    useState(null);

  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD LATEST PREDICTION
  // =========================================================

  useEffect(() => {

    const latest =
      getLatestPrediction();

    if (!latest) {

      setError(
        "Please complete a Yield Prediction first."
      );

      return;
    }

    setPrediction(latest);

    generateAIRecommendations(latest);

  }, []);


  // =========================================================
  // GENERATE RECOMMENDATIONS
  // =========================================================

  const generateAIRecommendations = async (
    latestPrediction
  ) => {

    setLoading(true);
    setError("");

    try {

      const requestData = {

        area:
          latestPrediction.area,

        item:
          latestPrediction.item,

        year:
          Number(latestPrediction.year),

        rainfall:
          Number(
            latestPrediction
              .average_rain_fall_mm_per_year
          ),

        temperature:
          Number(
            latestPrediction.avg_temp
          ),

        season:
          latestPrediction.season || null,

        soil_type:
          latestPrediction.soilType || null,

        predicted_yield:
          Number(
            latestPrediction.predicted_yield
          ),

        pesticides_tonnes:
          Number(
            latestPrediction.pesticides_tonnes || 0
          ),

      };


      const response =
        await generateRecommendations(
          requestData
        );


      setRecommendations(
        response.recommendations || []
      );


    } catch (err) {

      console.error(
        "Recommendation error:",
        err
      );

      setError(
        err.message ||
        "Unable to generate recommendations."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // NO PREDICTION
  // =========================================================

  if (!prediction) {

    return (

      <div className="ai-recommendations-page">

        <div className="recommendation-banner">

          <div className="banner-title">

            <Zap size={25} />

            <h2>
              AI Crop Recommendations
            </h2>

          </div>

          <p>
            Complete a Yield Prediction to receive
            personalized crop recommendations.
          </p>

        </div>

        {error && (

          <div className="recommendation-error">

            <AlertTriangle size={18} />

            {error}

          </div>

        )}

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="ai-recommendations-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="recommendation-banner">

        <div className="banner-title">

          <Zap size={25} />

          <h2>
            AI Crop Recommendations
          </h2>

        </div>

        <p>
          Recommendations generated automatically from
          your latest Yield Prediction.
        </p>

      </div>


      {/* =====================================================
          PREDICTION SUMMARY
      ===================================================== */}

      <div className="recommendation-summary-card">

        <div>

          <span>
            SELECTED CROP
          </span>

          <h2>
            {prediction.item}
          </h2>

        </div>

        <div>

          <span>
            PREDICTED YIELD
          </span>

          <h2>
            {Number(
              prediction.predicted_yield
            ).toLocaleString()}
          </h2>

          <small>
            {prediction.unit || "hg/ha"}
          </small>

        </div>

        <div>

          <span>
            AREA
          </span>

          <h2>
            {prediction.area}
          </h2>

        </div>

        <div>

          <span>
            YEAR
          </span>

          <h2>
            {prediction.year}
          </h2>

        </div>

      </div>


      {/* =====================================================
          CONDITIONS
      ===================================================== */}

      <div className="recommendation-condition-card">

        <h3>
          Farm Conditions Used
        </h3>

        <div className="recommendation-condition-grid">

          <div>
            <MapPin size={17} />
            <span>
              Area
            </span>
            <strong>
              {prediction.area}
            </strong>
          </div>

          <div>
            <CloudRain size={17} />
            <span>
              Rainfall
            </span>
            <strong>
              {
                prediction
                  .average_rain_fall_mm_per_year
              } mm
            </strong>
          </div>

          <div>
            <Thermometer size={17} />
            <span>
              Temperature
            </span>
            <strong>
              {prediction.avg_temp} °C
            </strong>
          </div>

          <div>
            <CalendarDays size={17} />
            <span>
              Season
            </span>
            <strong>
              {prediction.season || "—"}
            </strong>
          </div>

          <div>
            <Sprout size={17} />
            <span>
              Soil Type
            </span>
            <strong>
              {prediction.soilType || "—"}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="recommendation-loading">

          <div className="recommendation-spinner" />

          <p>
            AI is analyzing your crop, yield,
            soil and weather conditions...
          </p>

        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="recommendation-error">

          <AlertTriangle size={18} />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          RESULTS
      ===================================================== */}

      {!loading &&
        recommendations.length > 0 && (

        <>

          <div className="recommendation-results-header">

            <div>

              <h2>
                Recommended Crops
              </h2>

              <p>
                Based on your latest yield prediction
                and farm conditions
              </p>

            </div>

          </div>


          <div className="recommendation-grid">

            {recommendations.map(
              (item, index) => (

                <div
                  className={
                    `recommendation-card ${
                      index === 0
                        ? "recommendation-best"
                        : index === 1
                        ? "recommendation-good"
                        : "recommendation-medium"
                    }`
                  }
                  key={item.crop}
                >

                  {/* HEADER */}

                  <div className="recommendation-card-top">

                    <div className="crop-icon-box">

                      <Sprout size={23} />

                    </div>

                    <span className="match-badge">

                      {Math.round(
                        item.suitability_score
                      )}
                      % match

                    </span>

                  </div>


                  {/* CROP */}

                  <h3>
                    {item.crop}

                    {item.crop === prediction.item && (

                      <span>
                        &nbsp;✓ Selected Crop
                      </span>

                    )}

                  </h3>


                  {/* YIELD */}

                  {item.expected_yield !== null && (

                    <p className="expected-yield">

                      Predicted:

                      <strong>

                        {" "}

                        {Number(
                          item.expected_yield
                        ).toLocaleString()}

                        {" "}

                        {item.yield_unit}

                      </strong>

                    </p>

                  )}


                  {/* DETAILS */}

                  <div className="recommendation-details">

                    <div className="recommendation-detail">

                      <CloudRain size={16} />

                      <span>
                        Rainfall:{" "}
                        {item.rainfall[0]}
                        –
                        {item.rainfall[1]}
                        mm
                      </span>

                    </div>


                    <div className="recommendation-detail">

                      <Thermometer size={16} />

                      <span>
                        Temperature:{" "}
                        {item.temperature[0]}
                        –
                        {item.temperature[1]}
                        °C
                      </span>

                    </div>


                    <div className="recommendation-detail">

                      <CalendarDays size={16} />

                      <span>
                        Season:{" "}
                        {Array.isArray(item.season)
                          ? item.season.join(", ")
                          : item.season}
                      </span>

                    </div>


                    <div className="recommendation-detail">

                      <Sprout size={16} />

                      <span>
                        Soil:{" "}
                        {item.soil.join(", ")}
                      </span>

                    </div>

                  </div>


                  {/* WHY */}

                  {item.reasons?.length > 0 && (

                    <div className="recommendation-reason">

                      <strong>
                        Why this crop?
                      </strong>

                      <ul>

                        {item.reasons.map(
                          (reason, reasonIndex) => (

                            <li key={reasonIndex}>
                              <CheckCircle2
                                size={14}
                              />

                              {reason}

                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}


                  {/* ADVICE */}

                  {item.advice?.length > 0 && (

                    <div className="recommendation-advice">

                      <strong>
                        🌱 Farming Advice
                      </strong>

                      <ul>

                        {item.advice.map(
                          (advice, adviceIndex) => (

                            <li key={adviceIndex}>
                              {advice}
                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}


                  {/* RISKS */}

                  {item.risks?.length > 0 && (

                    <div className="recommendation-risks">

                      <strong>
                        ⚠ Risks
                      </strong>

                      <ul>

                        {item.risks.map(
                          (risk, riskIndex) => (

                            <li key={riskIndex}>
                              {risk}
                            </li>

                          )
                        )}

                      </ul>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </>

      )}

    </div>

  );

};


export default AIRecommendations;