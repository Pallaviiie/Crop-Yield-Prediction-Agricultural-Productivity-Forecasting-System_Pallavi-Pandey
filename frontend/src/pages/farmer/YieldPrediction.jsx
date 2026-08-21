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
  ArrowUp,
  ArrowDown,
  Minus,
  CircleCheck,
  ShieldAlert,
} from "lucide-react";

import {
  predictCropYield,
  assessFarmRisk,
} from "../../services/api";

import "../../styles/farmer/YieldPrediction.css";

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    crop: "",
    country: "",
     year: new Date().getFullYear(),
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
  const [riskAssessment, setRiskAssessment] = useState(null);

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

  const generateOptimizationAdvice = () => {
  const advice = [];

  const rainfall = Number(formData.rainfall || 0);
  const temperature = Number(formData.temperature || 0);
  const soilPh = Number(formData.soilPh || 0);
  const fertilizer = Number(formData.fertilizer || 0);
  const pesticide = Number(formData.pesticide || 0);

  let score = 100;

  /*
   * ==========================================
   * SOIL PH OPTIMIZATION
   * ==========================================
   */

  if (!formData.soilPh) {
    score -= 10;

    advice.push({
      title: "Soil pH Assessment",
      category: "Soil",
      priority: "Medium",
      icon: Sprout,
      action:
        "Perform a soil test before applying lime or soil amendments.",
      message:
        "Soil pH was not provided. Testing the soil will help determine the correct amendment and nutrient strategy.",
      type: "medium",
    });
  } else if (soilPh < 5.5) {
    score -= 20;

    advice.push({
      title: "Increase Soil pH",
      category: "Soil",
      priority: "High",
      icon: ArrowUp,
      action:
        "Consider agricultural lime based on soil-test recommendations.",
      message:
        `Current pH is ${soilPh}. The soil is acidic and may reduce nutrient availability for many crops.`,
      type: "high",
    });
  } else if (soilPh > 7.5) {
    score -= 20;

    advice.push({
      title: "Reduce Soil Alkalinity",
      category: "Soil",
      priority: "High",
      icon: ArrowDown,
      action:
        "Use soil-test-guided amendments and organic matter to improve nutrient availability.",
      message:
        `Current pH is ${soilPh}. High pH can reduce the availability of nutrients such as iron, zinc and phosphorus.`,
      type: "high",
    });
  } else {
    advice.push({
      title: "Maintain Soil pH",
      category: "Soil",
      priority: "Low",
      icon: CircleCheck,
      action:
        "Maintain the current soil management and test pH periodically.",
      message:
        `Current pH is ${soilPh}, which is within a generally suitable range for many crops.`,
      type: "good",
    });
  }

  /*
   * ==========================================
   * IRRIGATION OPTIMIZATION
   * ==========================================
   */

  if (rainfall < 500) {
    score -= 20;

    advice.push({
      title: "Increase Irrigation Support",
      category: "Irrigation",
      priority: "High",
      icon: Droplets,
      action:
        "Use supplemental irrigation during critical crop growth stages.",
      message:
        `Annual rainfall of ${rainfall} mm is relatively low. Monitor soil moisture and provide additional water when required.`,
      type: "high",
    });
  } else if (rainfall > 1500) {
    score -= 15;

    advice.push({
      title: "Improve Field Drainage",
      category: "Irrigation",
      priority: "High",
      icon: Droplets,
      action:
        "Improve drainage channels and avoid unnecessary irrigation after heavy rainfall.",
      message:
        `Rainfall of ${rainfall} mm may increase waterlogging and root-disease risk.`,
      type: "high",
    });
  } else {
    advice.push({
      title: "Optimize Water Management",
      category: "Irrigation",
      priority: "Low",
      icon: CircleCheck,
      action:
        "Adjust irrigation according to rainfall, soil moisture and crop growth stage.",
      message:
        `Rainfall of ${rainfall} mm is within a moderate range. Avoid both over-irrigation and water stress.`,
      type: "good",
    });
  }

  /*
   * ==========================================
   * TEMPERATURE OPTIMIZATION
   * ==========================================
   */

  if (temperature > 35) {
    score -= 20;

    advice.push({
      title: "Heat Protection",
      category: "Temperature",
      priority: "High",
      icon: Thermometer,
      action:
        "Increase moisture monitoring and provide irrigation during heat-stress periods.",
      message:
        `Temperature of ${temperature}°C may increase evaporation and heat stress.`,
      type: "high",
    });
  } else if (temperature < 10) {
    score -= 20;

    advice.push({
      title: "Cold Stress Protection",
      category: "Temperature",
      priority: "High",
      icon: Thermometer,
      action:
        "Monitor crop growth and protect sensitive crops from unusually low temperatures.",
      message:
        `Temperature of ${temperature}°C may slow crop development.`,
      type: "high",
    });
  } else if (temperature >= 30) {
    score -= 8;

    advice.push({
      title: "Monitor Heat Conditions",
      category: "Temperature",
      priority: "Medium",
      icon: Thermometer,
      action:
        "Increase soil-moisture monitoring and irrigate according to crop requirements.",
      message:
        `Temperature of ${temperature}°C is relatively warm. Monitor evaporation and crop water demand.`,
      type: "medium",
    });
  } else {
    advice.push({
      title: "Maintain Temperature Conditions",
      category: "Temperature",
      priority: "Low",
      icon: CircleCheck,
      action:
        "Continue monitoring weather conditions during the crop cycle.",
      message:
        `Temperature of ${temperature}°C appears suitable for general crop growth.`,
      type: "good",
    });
  }

  /*
   * ==========================================
   * FERTILIZER OPTIMIZATION
   * ==========================================
   */

  if (!formData.fertilizer || fertilizer === 0) {
    score -= 15;

    advice.push({
      title: "Improve Nutrient Management",
      category: "Fertilizer",
      priority: "Medium",
      icon: FlaskConical,
      action:
        "Use soil-test-based fertilizer recommendations instead of applying nutrients without measurement.",
      message:
        "No fertilizer quantity was provided. Balanced nutrient management can improve productivity and reduce unnecessary input costs.",
      type: "medium",
    });
  } else if (fertilizer > 200) {
    score -= 15;

    advice.push({
      title: "Review Fertilizer Quantity",
      category: "Fertilizer",
      priority: "High",
      icon: FlaskConical,
      action:
        "Review fertilizer application using soil testing and crop nutrient requirements.",
      message:
        `The entered fertilizer quantity is ${fertilizer} kg/Ha. Avoid excessive application to reduce nutrient loss and unnecessary cost.`,
      type: "high",
    });
  } else if (fertilizer < 30) {
    score -= 8;

    advice.push({
      title: "Review Nutrient Supply",
      category: "Fertilizer",
      priority: "Medium",
      icon: FlaskConical,
      action:
        "Check soil nutrient levels and determine whether additional nutrients are required.",
      message:
        `The entered fertilizer quantity is ${fertilizer} kg/Ha. Soil testing can help determine whether this amount is sufficient.`,
      type: "medium",
    });
  } else {
    advice.push({
      title: "Maintain Fertilizer Strategy",
      category: "Fertilizer",
      priority: "Low",
      icon: CircleCheck,
      action:
        "Continue balanced fertilizer application based on crop and soil requirements.",
      message:
        `The entered fertilizer quantity is ${fertilizer} kg/Ha.`,
      type: "good",
    });
  }

  /*
   * ==========================================
   * PESTICIDE OPTIMIZATION
   * ==========================================
   */

  if (pesticide > 5) {
    score -= 15;

    advice.push({
      title: "Reduce Pesticide Dependency",
      category: "Pest Control",
      priority: "High",
      icon: Bug,
      action:
        "Adopt integrated pest management and apply pesticides only when necessary.",
      message:
        `Pesticide usage of ${pesticide} tonnes appears high. Excessive use can increase costs and environmental impact.`,
      type: "high",
    });
  } else if (pesticide > 2) {
    score -= 7;

    advice.push({
      title: "Optimize Pest Control",
      category: "Pest Control",
      priority: "Medium",
      icon: Bug,
      action:
        "Regularly monitor pest levels and use targeted treatment instead of routine spraying.",
      message:
        `Pesticide usage is ${pesticide} tonnes. Consider monitoring pest pressure before additional applications.`,
      type: "medium",
    });
  } else {
    advice.push({
      title: "Maintain Pest Monitoring",
      category: "Pest Control",
      priority: "Low",
      icon: CircleCheck,
      action:
        "Continue regular crop inspection and use targeted pest treatment when required.",
      message:
        "Current pesticide input is relatively low. Preventive crop monitoring can help maintain healthy plants.",
      type: "good",
    });
  }

  /*
   * ==========================================
   * FINAL SCORE
   * ==========================================
   */

  score = Math.max(0, Math.min(100, score));

  let scoreLabel = "Excellent";
  let scoreType = "excellent";

  if (score < 60) {
    scoreLabel = "Needs Improvement";
    scoreType = "poor";
  } else if (score < 75) {
    scoreLabel = "Moderate";
    scoreType = "moderate";
  } else if (score < 90) {
    scoreLabel = "Good";
    scoreType = "good";
  }

  return {
    advice,
    score,
    scoreLabel,
    scoreType,
  };
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
    setRiskAssessment(null);

    try {
      const requestData = {
        area: formData.country,
        item: formData.crop,
        year: Number(formData.year),
        season: formData.season,
        average_rain_fall_mm_per_year: Number(formData.rainfall),
        pesticides_tonnes: Number(formData.pesticide),
        avg_temp: Number(formData.temperature),
      };

      const data = await predictCropYield(requestData);

      setPrediction(data);

      const riskInputData = {
        rainfall: Number(formData.rainfall || 0),
        temperature: Number(formData.temperature || 0),
        soil_ph: Number(formData.soilPh || 0),
        fertilizer: Number(formData.fertilizer || 0),
        pesticide: Number(formData.pesticide || 0),
      };

      const riskResponse = await assessFarmRisk(riskInputData);

      setRiskAssessment(riskResponse);
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

  const optimization = prediction
    ? generateOptimizationAdvice()
    : null;

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
    Prediction Year <span>*</span>
  </label>

  <input
    type="number"
    name="year"
    value={formData.year}
    onChange={handleChange}
    min="2000"
    max="2100"
    step="1"
    placeholder="e.g. 2026"
    required
  />
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
    <span>Year</span>
    <strong>{formData.year || "—"}</strong>
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

{/* ================= RISK ASSESSMENT ================= */}

{riskAssessment && (
  <div className="risk-assessment-card">

    <div className="risk-assessment-header">

      <div>
        <h3>Farm Risk Assessment</h3>
        <p>
          AI-based analysis of potential farming risks
        </p>
      </div>

      <div
        className={`overall-risk-badge ${riskAssessment.overall_risk_level.toLowerCase()}`}
      >
        <strong>
          {riskAssessment.overall_risk_score}/100
        </strong>

        <span>
          {riskAssessment.overall_risk_level} Risk
        </span>
      </div>

    </div>

    <div className="risk-grid">

      {riskAssessment.risks.map((risk, index) => (

        <div
          key={index}
          className={`risk-item ${risk.level.toLowerCase()}`}
        >

          <div className="risk-item-header">
            <strong>{risk.category}</strong>

            <span>
              {risk.level}
            </span>
          </div>

          <p>{risk.message}</p>

          <div className="risk-score">
            Risk Score: {risk.score}/25
          </div>

        </div>

      ))}

    </div>

  </div>
)}
{/* ================= OPTIMIZATION ADVICE ================= */}

<div className="optimization-card">

  {/* HEADER */}

  <div className="optimization-header">

    <div className="optimization-title-icon">
      <Gauge size={20} />
    </div>

    <div>
      <h3>Farm Optimization Advice</h3>
      <p>
        AI-generated actions to improve productivity and farm efficiency
      </p>
    </div>

  </div>


  {/* SCORE */}

  <div className="optimization-score-section">

    <div className="optimization-score-circle">

      <div className="optimization-score-number">
        {optimization?.score}
      </div>

      <span>/ 100</span>

    </div>

    <div className="optimization-score-content">

      <strong>
        {optimization?.scoreLabel} Farm Optimization
      </strong>

      <p>
        Your score is based on soil, rainfall, temperature,
        fertilizer and pest-management conditions.
      </p>

      <div className="optimization-score-bar">

        <div
          className={`optimization-score-fill ${optimization?.scoreType}`}
          style={{
            width: `${optimization?.score || 0}%`,
          }}
        />

      </div>

    </div>

  </div>


  {/* PRIORITY SUMMARY */}

  <div className="priority-summary">

    <div className="priority-item high">
      <ShieldAlert size={15} />
      <span>High Priority</span>
      <strong>
        {
          optimization?.advice.filter(
            (item) => item.priority === "High"
          ).length
        }
      </strong>
    </div>

    <div className="priority-item medium">
      <AlertTriangle size={15} />
      <span>Medium Priority</span>
      <strong>
        {
          optimization?.advice.filter(
            (item) => item.priority === "Medium"
          ).length
        }
      </strong>
    </div>

    <div className="priority-item low">
      <CircleCheck size={15} />
      <span>Low Priority</span>
      <strong>
        {
          optimization?.advice.filter(
            (item) => item.priority === "Low"
          ).length
        }
      </strong>
    </div>

  </div>


  {/* ADVICE CARDS */}

  <div className="optimization-grid">

    {optimization?.advice.map((item, index) => {

      const Icon = item.icon;

      return (
        <div
          className={`optimization-advice-card ${item.type}`}
          key={index}
        >

          <div className="optimization-advice-top">

            <div className="optimization-advice-icon">
              <Icon size={18} />
            </div>

            <div className="optimization-advice-heading">

              <strong>{item.title}</strong>

              <span>
                {item.category}
              </span>

            </div>

            <div className={`priority-badge ${item.priority.toLowerCase()}`}>
              {item.priority}
            </div>

          </div>


          <div className="optimization-action">

            <span>Recommended Action</span>

            <p>
              {item.action}
            </p>

          </div>


          <div className="optimization-reason">

            <span>Why this matters</span>

            <p>
              {item.message}
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