import {
  Zap,
  Sprout,
  Gauge,
  CloudRain,
  Thermometer,
  CalendarDays,
} from "lucide-react";

import "../../styles/farmer/AIRecommendations.css";

const AIRecommendations = () => {
  const recommendations = [
    {
      name: "Wheat",
      variety: "HD-2967",
      yield: "5.2 T/Ha",
      match: "95% match",
      soil: "Alluvial",
      rainfall: "400-600mm",
      temperature: "15-25°C",
      season: "Rabi",
      reason:
        "Excellent soil match, historically high yields in your region.",
      className: "recommendation-best",
    },
    {
      name: "Mustard",
      variety: "Pusa Bold",
      yield: "2.8 T/Ha",
      match: "88% match",
      soil: "Alluvial/Sandy",
      rainfall: "300-450mm",
      temperature: "10-25°C",
      season: "Rabi",
      reason:
        "Good crop diversification with relatively low water requirement.",
      className: "recommendation-good",
    },
    {
      name: "Barley",
      variety: "DL-88",
      yield: "2.8 T/Ha",
      match: "82% match",
      soil: "Sandy Loam",
      rainfall: "300-500mm",
      temperature: "12-22°C",
      season: "Rabi",
      reason:
        "Good market demand and a relatively drought-tolerant variety.",
      className: "recommendation-medium",
    },
  ];

  return (
    <div className="ai-recommendations-page">

      {/* =====================================================
          TOP BANNER
      ===================================================== */}

      <div className="recommendation-banner">

        <div className="banner-title">
          <Zap size={25} />

          <h2>AI Crop Recommendations</h2>
        </div>

        <p>
          Personalized recommendations based on your soil, weather,
          and market data for Ludhiana, Punjab.
        </p>

      </div>

      {/* =====================================================
          RECOMMENDATION CARDS
      ===================================================== */}

      <div className="recommendation-grid">

        {recommendations.map((item) => (

          <div
            className={`recommendation-card ${item.className}`}
            key={item.name}
          >

            {/* CARD HEADER */}

            <div className="recommendation-card-top">

              <div className="crop-icon-box">
                <Sprout size={23} />
              </div>

              <span className="match-badge">
                {item.match}
              </span>

            </div>

            {/* CROP NAME */}

            <h3>
              {item.name}{" "}
              <span>
                ({item.variety})
              </span>
            </h3>

            {/* EXPECTED YIELD */}

            <p className="expected-yield">
              Expected:{" "}
              <strong>{item.yield}</strong>
            </p>

            {/* =================================================
                CROP DETAILS
            ================================================= */}

            <div className="recommendation-details">

              <div className="recommendation-detail">
                <Gauge size={16} />
                <span>
                  Soil: {item.soil}
                </span>
              </div>

              <div className="recommendation-detail">
                <CloudRain size={16} />
                <span>
                  Rainfall: {item.rainfall}
                </span>
              </div>

              <div className="recommendation-detail">
                <Thermometer size={16} />
                <span>
                  Temperature: {item.temperature}
                </span>
              </div>

              <div className="recommendation-detail">
                <CalendarDays size={16} />
                <span>
                  Season: {item.season}
                </span>
              </div>

            </div>

            {/* =================================================
                WHY THIS CROP
            ================================================= */}

            <div className="recommendation-reason">

              <strong>Why:</strong>{" "}
              {item.reason}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default AIRecommendations;