import React, { useEffect, useState } from "react";

import {
  Brain,
  TrendingUp,
  TrendingDown,
  Sprout,
  CloudRain,
  Thermometer,
  Droplets,
  FlaskConical,
  Bug,
  CalendarDays,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  Activity,
} from "lucide-react";

import {
  getLatestPrediction,
} from "../../services/predictionStorage";

import "../../styles/farmer/AIInsights.css";


const AIInsights = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState([]);


  // =========================================================
  // LOAD LATEST PREDICTION
  // =========================================================

  useEffect(() => {
    const latest = getLatestPrediction();

    if (!latest) {
      setError(
        "Please complete a Yield Prediction first."
      );
      return;
    }

    setPrediction(latest);
    generateInsights(latest);
  }, []);


  // =========================================================
  // GENERATE AI INSIGHTS
  // =========================================================

  const generateInsights = (data) => {
    setLoading(true);
    setError("");

    try {
      const generatedInsights = [];

      const rainfall = Number(
        data.average_rain_fall_mm_per_year || 0
      );

      const temperature = Number(
        data.avg_temp || 0
      );

      const humidity = Number(
        data.humidity || 0
      );

      const fertilizer = Number(
        data.fertilizer || 0
      );

      const pesticide = Number(
        data.pesticides_tonnes || data.pesticide || 0
      );

      const soilPh = Number(
        data.soilPh || 0
      );

      const predictedYield = Number(
        data.predicted_yield || 0
      );


      // =====================================================
      // YIELD INSIGHT
      // =====================================================

      if (predictedYield >= 50000) {
        generatedInsights.push({
          type: "positive",
          category: "Yield Performance",
          title: "Strong Yield Potential",
          message:
            `The predicted yield of ${predictedYield.toLocaleString()} ${data.unit || "hg/ha"} indicates strong production potential under the selected farm conditions.`,
          icon: TrendingUp,
        });
      } else if (predictedYield >= 30000) {
        generatedInsights.push({
          type: "medium",
          category: "Yield Performance",
          title: "Moderate Yield Potential",
          message:
            `The predicted yield of ${predictedYield.toLocaleString()} ${data.unit || "hg/ha"} indicates moderate production potential. Better input and resource management may improve productivity.`,
          icon: Activity,
        });
      } else {
        generatedInsights.push({
          type: "warning",
          category: "Yield Performance",
          title: "Yield Needs Attention",
          message:
            `The predicted yield of ${predictedYield.toLocaleString()} ${data.unit || "hg/ha"} is relatively low. Review soil, irrigation, nutrient and crop-management conditions.`,
          icon: TrendingDown,
        });
      }


      // =====================================================
      // RAINFALL INSIGHT
      // =====================================================

      if (rainfall < 500) {
        generatedInsights.push({
          type: "warning",
          category: "Water Management",
          title: "Low Rainfall Condition",
          message:
            `Rainfall of ${rainfall} mm may create water-stress conditions. Monitor soil moisture and provide supplemental irrigation when required.`,
          icon: CloudRain,
        });
      } else if (rainfall > 1500) {
        generatedInsights.push({
          type: "warning",
          category: "Water Management",
          title: "High Rainfall Condition",
          message:
            `Rainfall of ${rainfall} mm may increase waterlogging and disease risk. Proper field drainage should be maintained.`,
          icon: CloudRain,
        });
      } else {
        generatedInsights.push({
          type: "positive",
          category: "Water Management",
          title: "Rainfall Conditions Are Moderate",
          message:
            `The recorded rainfall of ${rainfall} mm provides a moderate water availability condition. Irrigation should be adjusted according to crop requirements.`,
          icon: Droplets,
        });
      }


      // =====================================================
      // TEMPERATURE INSIGHT
      // =====================================================

      if (temperature > 35) {
        generatedInsights.push({
          type: "warning",
          category: "Temperature",
          title: "Heat Stress Risk",
          message:
            `The temperature of ${temperature}°C is high and may increase evaporation and heat stress. Monitor crop moisture closely.`,
          icon: Thermometer,
        });
      } else if (temperature < 10) {
        generatedInsights.push({
          type: "warning",
          category: "Temperature",
          title: "Cold Stress Risk",
          message:
            `The temperature of ${temperature}°C is low and may slow crop development.`,
          icon: Thermometer,
        });
      } else {
        generatedInsights.push({
          type: "positive",
          category: "Temperature",
          title: "Temperature Is Within a General Growth Range",
          message:
            `The recorded temperature of ${temperature}°C is generally suitable for crop growth.`,
          icon: Thermometer,
        });
      }


      // =====================================================
      // SOIL INSIGHT
      // =====================================================

      if (!data.soilType) {
        generatedInsights.push({
          type: "medium",
          category: "Soil",
          title: "Soil Information Missing",
          message:
            "Soil type information is not available. Soil testing can provide better guidance for nutrient and crop management.",
          icon: Sprout,
        });
      } else {
        generatedInsights.push({
          type: "positive",
          category: "Soil",
          title: "Soil Information Considered",
          message:
            `The selected soil type is ${data.soilType}. Crop management should be adjusted according to soil characteristics.`,
          icon: Sprout,
        });
      }


      // =====================================================
      // SOIL pH INSIGHT
      // =====================================================

      if (!data.soilPh) {
        generatedInsights.push({
          type: "medium",
          category: "Soil pH",
          title: "Soil pH Testing Recommended",
          message:
            "Soil pH was not provided. Regular soil testing can help maintain suitable nutrient availability.",
          icon: FlaskConical,
        });
      } else if (soilPh < 5.5) {
        generatedInsights.push({
          type: "warning",
          category: "Soil pH",
          title: "Acidic Soil Condition",
          message:
            `The soil pH is ${soilPh}. Acidic soil may reduce the availability of important nutrients.`,
          icon: FlaskConical,
        });
      } else if (soilPh > 7.5) {
        generatedInsights.push({
          type: "warning",
          category: "Soil pH",
          title: "Alkaline Soil Condition",
          message:
            `The soil pH is ${soilPh}. High pH can reduce the availability of nutrients such as iron, zinc and phosphorus.`,
          icon: FlaskConical,
        });
      } else {
        generatedInsights.push({
          type: "positive",
          category: "Soil pH",
          title: "Soil pH Looks Suitable",
          message:
            `The recorded soil pH of ${soilPh} is within a generally suitable range for many crops.`,
          icon: CheckCircle2,
        });
      }


      // =====================================================
      // FERTILIZER INSIGHT
      // =====================================================

      if (fertilizer === 0) {
        generatedInsights.push({
          type: "medium",
          category: "Fertilizer",
          title: "Nutrient Management Needs Attention",
          message:
            "No fertilizer quantity was provided. Use soil-test-based nutrient recommendations before applying fertilizers.",
          icon: FlaskConical,
        });
      } else if (fertilizer > 200) {
        generatedInsights.push({
          type: "warning",
          category: "Fertilizer",
          title: "High Fertilizer Input",
          message:
            `The entered fertilizer quantity is ${fertilizer} kg/Ha. Excessive fertilizer application may increase nutrient loss and production costs.`,
          icon: FlaskConical,
        });
      } else {
        generatedInsights.push({
          type: "positive",
          category: "Fertilizer",
          title: "Fertilizer Input Recorded",
          message:
            `${fertilizer} kg/Ha of fertilizer has been considered. Continue using balanced, soil-test-based nutrient management.`,
          icon: FlaskConical,
        });
      }


      // =====================================================
      // PESTICIDE INSIGHT
      // =====================================================

      if (pesticide > 5) {
        generatedInsights.push({
          type: "warning",
          category: "Pest Management",
          title: "High Pesticide Usage",
          message:
            `Pesticide usage of ${pesticide} tonnes is relatively high. Integrated pest management can help reduce unnecessary chemical use.`,
          icon: Bug,
        });
      } else {
        generatedInsights.push({
          type: "positive",
          category: "Pest Management",
          title: "Pesticide Usage Is Relatively Controlled",
          message:
            `The recorded pesticide usage is ${pesticide} tonnes. Continue monitoring pests and apply treatment when necessary.`,
          icon: Bug,
        });
      }


      // =====================================================
      // HUMIDITY INSIGHT
      // =====================================================

      if (humidity > 80) {
        generatedInsights.push({
          type: "warning",
          category: "Humidity",
          title: "High Humidity",
          message:
            `Humidity of ${humidity}% may increase the risk of fungal diseases. Monitor crops regularly.`,
          icon: Droplets,
        });
      } else if (humidity > 0) {
        generatedInsights.push({
          type: "positive",
          category: "Humidity",
          title: "Humidity Condition Recorded",
          message:
            `The recorded humidity is ${humidity}%. Continue monitoring humidity during the crop cycle.`,
          icon: Droplets,
        });
      }


      setInsights(generatedInsights);

    } catch (err) {
      console.error(
        "AI Insights Error:",
        err
      );

      setError(
        "Unable to generate AI insights."
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
      <div className="ai-insights-page">

        <div className="insights-banner">
          <div className="insights-banner-title">
            <Brain size={27} />

            <h2>
              AI Farm Insights
            </h2>
          </div>

          <p>
            Complete a Yield Prediction to receive
            personalized AI-powered farm insights.
          </p>
        </div>

        {error && (
          <div className="insights-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

      </div>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="ai-insights-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="insights-banner">

        <div className="insights-banner-title">

          <Brain size={27} />

          <div>
            <h2>
              AI Farm Insights
            </h2>

            <p>
              Intelligent analysis based on your latest
              crop yield prediction and farm conditions.
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          FARM SUMMARY
      ===================================================== */}

      <div className="insights-summary-card">

        <div className="insights-summary-header">

          <div>
            <span>
              CURRENT FARM ANALYSIS
            </span>

            <h2>
              {prediction.item}
            </h2>
          </div>

          <div className="insights-status">
            <CheckCircle2 size={17} />
            Analysis Ready
          </div>

        </div>


        <div className="insights-summary-grid">

          <div className="insight-summary-item">
            <Sprout size={18} />

            <span>Crop</span>

            <strong>
              {prediction.item || "—"}
            </strong>
          </div>


          <div className="insight-summary-item">
            <TrendingUp size={18} />

            <span>Predicted Yield</span>

            <strong>
              {Number(
                prediction.predicted_yield || 0
              ).toLocaleString()}{" "}
              {prediction.unit || "hg/ha"}
            </strong>
          </div>


          <div className="insight-summary-item">
            <MapPin size={18} />

            <span>Area</span>

            <strong>
              {prediction.area || "—"}
            </strong>
          </div>


          <div className="insight-summary-item">
            <CalendarDays size={18} />

            <span>Year</span>

            <strong>
              {prediction.year || "—"}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          CONDITIONS
      ===================================================== */}

      <div className="insights-conditions-card">

        <div className="insights-section-heading">

          <Target size={19} />

          <div>
            <h3>
              Conditions Analyzed
            </h3>

            <p>
              Farm parameters considered by the AI analysis
            </p>
          </div>

        </div>


        <div className="insights-condition-grid">

          <div>
            <CloudRain size={18} />
            <span>Rainfall</span>
            <strong>
              {prediction.average_rain_fall_mm_per_year || "—"} mm
            </strong>
          </div>


          <div>
            <Thermometer size={18} />
            <span>Temperature</span>
            <strong>
              {prediction.avg_temp || "—"} °C
            </strong>
          </div>


          <div>
            <Droplets size={18} />
            <span>Humidity</span>
            <strong>
              {prediction.humidity || "—"}%
            </strong>
          </div>


          <div>
            <Sprout size={18} />
            <span>Soil Type</span>
            <strong>
              {prediction.soilType || "—"}
            </strong>
          </div>


          <div>
            <FlaskConical size={18} />
            <span>Fertilizer</span>
            <strong>
              {prediction.fertilizer || "—"} kg/Ha
            </strong>
          </div>


          <div>
            <Bug size={18} />
            <span>Pesticide</span>
            <strong>
              {prediction.pesticides_tonnes ||
                prediction.pesticide ||
                "0"}{" "}
              tonnes
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="insights-loading">

          <div className="insights-spinner" />

          <h3>
            AI is analyzing your farm...
          </h3>

          <p>
            Evaluating yield, weather, soil and
            resource conditions.
          </p>

        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="insights-error">

          <AlertTriangle size={18} />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =====================================================
          AI INSIGHTS
      ===================================================== */}

      {!loading && insights.length > 0 && (

        <div className="insights-results">

          <div className="insights-results-header">

            <div className="insights-results-icon">
              <Lightbulb size={21} />
            </div>

            <div>
              <h2>
                AI-Generated Insights
              </h2>

              <p>
                Key observations identified from your
                current farm conditions.
              </p>
            </div>

          </div>


          <div className="insights-grid">

            {insights.map((insight, index) => {

              const Icon = insight.icon;

              return (
                <div
                  className={`insight-card ${insight.type}`}
                  key={index}
                >

                  <div className="insight-card-header">

                    <div className="insight-icon">
                      <Icon size={20} />
                    </div>

                    <div>
                      <span>
                        {insight.category}
                      </span>

                      <h3>
                        {insight.title}
                      </h3>
                    </div>

                  </div>


                  <p className="insight-message">
                    {insight.message}
                  </p>


                  <div className="insight-footer">

                    {insight.type === "positive" ? (
                      <>
                        <CheckCircle2 size={15} />
                        Positive Indicator
                      </>
                    ) : insight.type === "warning" ? (
                      <>
                        <AlertTriangle size={15} />
                        Requires Attention
                      </>
                    ) : (
                      <>
                        <Activity size={15} />
                        Monitor Condition
                      </>
                    )}

                  </div>

                </div>
              );

            })}

          </div>

        </div>

      )}

    </div>
  );
};


export default AIInsights;