import { useState } from "react";

import {
  Target,
  Zap,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Droplets,
  Sprout,
  Bug,
  CloudRain,
  FlaskConical,
  Thermometer,
  MapPin,
  BarChart3,
  Leaf,
  AlertTriangle,
  Gauge,
} from "lucide-react";

import { predictCropYield } from "../../services/api";

import "../../styles/farmer/YieldPrediction.css";

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    crop: "",
    country: "",
    season: "",
    areaHectares: "",
    soilType: "",
    soilPh: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    fertilizer: "",
    pesticide: "",
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const crops = [
    "Cassava",
    "Maize",
    "Plantains and others",
    "Potatoes",
    "Rice, paddy",
    "Sorghum",
    "Soybeans",
    "Sweet potatoes",
    "Wheat",
    "Yams",
  ];

  const countries = [
    "Brazil",
    "India",
    "Argentina",
    "Australia",
    "Canada",
    "China",
    "France",
    "Germany",
    "Indonesia",
    "Mexico",
    "United States",
  ];

  const seasons = [
  "Summer",
  "Winter",
  "Monsoon",
  "Spring",
  "Pre-Winter",
  "Autumn",
];

  const soilTypes = [
    "Alluvial Soil",
    "Black Soil",
    "Red Soil",
    "Laterite Soil",
    "Sandy Soil",
    "Clay Soil",
    "Loamy Soil",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateRecommendations = () => {
    const recommendations = [];

    const rainfall = Number(formData.rainfall || 0);
    const temperature = Number(formData.temperature || 0);
    const soilPh = Number(formData.soilPh || 0);
    const fertilizer = Number(formData.fertilizer || 0);
    const pesticide = Number(formData.pesticide || 0);

    // Soil
    if (soilPh && (soilPh < 5.5 || soilPh > 7.5)) {
      recommendations.push({
        title: "Improve Soil pH",
        icon: Sprout,
        message:
          "Your soil pH is outside the commonly suitable range. Consider soil testing and appropriate amendments.",
        type: "warning",
      });
    } else {
      recommendations.push({
        title: "Soil Health",
        icon: Sprout,
        message:
          "Maintain regular soil testing and monitor pH and nutrient levels for healthy crop growth.",
        type: "good",
      });
    }

    // Irrigation
    if (rainfall < 500) {
      recommendations.push({
        title: "Increase Irrigation",
        icon: Droplets,
        message:
          "Rainfall is relatively low. Consider supplemental irrigation during important crop growth stages.",
        type: "warning",
      });
    } else if (rainfall > 1500) {
      recommendations.push({
        title: "Improve Drainage",
        icon: Droplets,
        message:
          "High rainfall may increase waterlogging risk. Ensure proper field drainage.",
        type: "warning",
      });
    } else {
      recommendations.push({
        title: "Irrigation",
        icon: Droplets,
        message:
          "Maintain adequate soil moisture and adjust irrigation according to rainfall and crop stage.",
        type: "good",
      });
    }

    // Temperature
    if (temperature > 35) {
      recommendations.push({
        title: "Heat Stress Risk",
        icon: Thermometer,
        message:
          "High temperature can increase crop water demand. Monitor moisture stress carefully.",
        type: "warning",
      });
    } else if (temperature < 10) {
      recommendations.push({
        title: "Low Temperature",
        icon: Thermometer,
        message:
          "Low temperature may slow crop development. Monitor crop growth and weather conditions.",
        type: "warning",
      });
    } else {
      recommendations.push({
        title: "Temperature",
        icon: CloudRain,
        message:
          "Current temperature appears suitable. Continue monitoring upcoming weather conditions.",
        type: "good",
      });
    }

    // Fertilizer
    if (fertilizer === 0) {
      recommendations.push({
        title: "Nutrient Management",
        icon: FlaskConical,
        message:
          "No fertilizer amount was entered. Use soil-test-based nutrient recommendations.",
        type: "warning",
      });
    } else {
      recommendations.push({
        title: "Fertilizer",
        icon: FlaskConical,
        message:
          "Maintain balanced fertilizer application and avoid excessive nutrient use.",
        type: "good",
      });
    }

    // Pest
    if (pesticide > 5) {
      recommendations.push({
        title: "Reduce Pesticide Use",
        icon: Bug,
        message:
          "Pesticide usage appears high. Prefer integrated pest management where possible.",
        type: "warning",
      });
    } else {
      recommendations.push({
        title: "Pest Monitoring",
        icon: Bug,
        message:
          "Regularly inspect crops for insects, fungal infections and leaf damage.",
        type: "good",
      });
    }

    return recommendations;
  };

  const getYieldStatus = (yieldValue) => {
    if (yieldValue >= 5) {
      return {
        label: "High Yield Potential",
        type: "high",
        icon: TrendingUp,
      };
    }

    if (yieldValue >= 3) {
      return {
        label: "Good Yield Potential",
        type: "medium",
        icon: CheckCircle2,
      };
    }

    return {
      label: "Needs Attention",
      type: "low",
      icon: AlertTriangle,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const requestData = {
        area: formData.country,
        item: formData.crop,
        year: new Date().getFullYear(),
        season: formData.season,
        average_rain_fall_mm_per_year: Number(formData.rainfall),
        pesticides_tonnes: Number(formData.pesticide),
        avg_temp: Number(formData.temperature),
      };

      const data = await predictCropYield(requestData);

      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        err?.message || "Unable to generate crop yield prediction."
      );
    } finally {
      setLoading(false);
    }
  };

  const predictedTonnes = prediction?.predicted_yield
    ? Number(prediction.predicted_yield) / 10000
    : 0;

  const recommendations = prediction
    ? generateRecommendations()
    : [];

  const yieldStatus = getYieldStatus(predictedTonnes);
  const StatusIcon = yieldStatus.icon;

  return (
    <div className="yield-page">
      <div className="yield-grid">

        {/* ================= LEFT FORM ================= */}

        <div className="prediction-form-card">

          <div className="prediction-heading">
            <div className="prediction-icon">
              <Target size={23} />
            </div>

            <div>
              <h2>Crop Yield Prediction</h2>
              <p>
                Enter your farm details for AI-powered yield analysis
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="prediction-form-grid">

              <div className="form-group">
                <label>
                  Crop <span>*</span>
                </label>

                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Crop</option>

                  {crops.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Country <span>*</span>
                </label>

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Country</option>

                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

<div className="form-group">
  <label>
    Growing Season <span>*</span>
  </label>

  <select
    name="season"
    value={formData.season}
    onChange={handleChange}
    required
  >
    <option value="">Select Season</option>

    {seasons.map((season) => (
      <option key={season} value={season}>
        {season}
      </option>
    ))}
  </select>
</div>

              <div className="form-group">
                <label>
                  Farm Area (Hectares) <span>*</span>
                </label>

                <input
                  type="number"
                  name="areaHectares"
                  value={formData.areaHectares}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  placeholder="e.g. 5"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Soil Type <span>*</span>
                </label>

                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Soil Type</option>

                  {soilTypes.map((soil) => (
                    <option key={soil} value={soil}>
                      {soil}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Soil pH</label>

                <input
                  type="number"
                  name="soilPh"
                  value={formData.soilPh}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="e.g. 6.5"
                />
              </div>

              <div className="form-group">
                <label>
                  Rainfall (mm) <span>*</span>
                </label>

                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 600"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Temperature (°C) <span>*</span>
                </label>

                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="e.g. 28"
                  required
                />
              </div>

              <div className="form-group">
                <label>Humidity (%)</label>

                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g. 60"
                />
              </div>

              <div className="form-group">
                <label>Fertilizer (kg/Ha)</label>

                <input
                  type="number"
                  name="fertilizer"
                  value={formData.fertilizer}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g. 50"
                />
              </div>

              <div className="form-group">
                <label>
                  Pesticide (Tonnes) <span>*</span>
                </label>

                <input
                  type="number"
                  name="pesticide"
                  value={formData.pesticide}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g. 2"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="predict-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spin" size={18} />
                  Analyzing Farm Data...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Predict Crop Yield
                </>
              )}
            </button>

          </form>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="prediction-right-section">

          {!prediction ? (

            <div className="ready-card">

              <div className="ready-icon">
                <BarChart3 size={30} />
              </div>

              <h2>Ready for AI Analysis</h2>

              <p>
                Enter your crop, soil and weather information
                to generate an estimated yield and personalized
                farming recommendations.
              </p>

              <div className="ready-features">
                <span>
                  <Leaf size={14} />
                  Yield Forecast
                </span>

                <span>
                  <TrendingUp size={14} />
                  AI Insights
                </span>

                <span>
                  <Sprout size={14} />
                  Farm Recommendations
                </span>
              </div>

            </div>

          ) : (

            <>

              {/* ================= RESULT ================= */}

              <div className="prediction-result-card">

                <div className="prediction-result-header">

                  <div>
                    <span className="prediction-small-title">
                      ESTIMATED CROP YIELD
                    </span>

                    <div className="prediction-number">
                      {predictedTonnes.toFixed(2)}
                    </div>

                    <span className="prediction-unit">
                      Tonnes / Hectare
                    </span>
                  </div>

                  <div className="prediction-success-icon">
                    <TrendingUp size={29} />
                  </div>

                </div>

                {/* STATUS */}

                <div className={`yield-status ${yieldStatus.type}`}>
                  <StatusIcon size={18} />

                  <div>
                    <strong>{yieldStatus.label}</strong>
                    <span>
                      Based on your current farm inputs
                    </span>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="prediction-details">

                  <div>
                    <MapPin size={15} />
                    <span>Country</span>
                    <strong>{formData.country}</strong>
                  </div>

                  <div>
                    <Sprout size={15} />
                    <span>Crop</span>
                    <strong>{formData.crop}</strong>
                  </div>

                  <div>
                    <BarChart3 size={15} />
                    <span>Farm Area</span>
                    <strong>
                      {formData.areaHectares || "—"} ha
                    </strong>
                  </div>

                  <div>
                    <Thermometer size={15} />
                    <span>Temperature</span>
                    <strong>
                      {formData.temperature || "—"} °C
                    </strong>
                  </div>

                </div>

              </div>

              {/* ================= INPUT SUMMARY ================= */}

              <div className="input-summary-card">

                <div className="section-title">
                  <Gauge size={18} />
                  <div>
                    <h3>Key Farm Conditions</h3>
                    <p>Inputs considered for this prediction</p>
                  </div>
                </div>

                <div className="condition-grid">

                  <div>
                    <span>Rainfall</span>
                    <strong>
                      {formData.rainfall || "—"} mm
                    </strong>
                  </div>

                  <div>
                    <span>Soil pH</span>
                    <strong>
                      {formData.soilPh || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Humidity</span>
                    <strong>
                      {formData.humidity || "—"}%
                    </strong>
                  </div>

                  <div>
                    <span>Fertilizer</span>
                    <strong>
                      {formData.fertilizer || "—"} kg/Ha
                    </strong>
                  </div>

                </div>

              </div>

              {/* ================= RECOMMENDATIONS ================= */}

              <div className="ai-recommendations-card">

                <div className="recommendations-header">

                  <div className="recommendations-title-icon">
                    <Zap size={19} />
                  </div>

                  <div>
                    <h3>AI Recommendations</h3>
                    <p>
                      Suggestions based on your farm conditions
                    </p>
                  </div>

                </div>

                <div className="recommendations-grid">

                  {recommendations.map((recommendation, index) => {

                    const Icon = recommendation.icon;

                    return (
                      <div
                        className={`recommendation-card ${recommendation.type}`}
                        key={index}
                      >

                        <div className="recommendation-icon">
                          <Icon size={18} />
                        </div>

                        <div className="recommendation-content">

                          <strong>
                            {recommendation.title}
                          </strong>

                          <p>
                            {recommendation.message}
                          </p>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </div>

            </>

          )}

          {error && (
            <div className="prediction-error">
              {error}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default YieldPrediction;