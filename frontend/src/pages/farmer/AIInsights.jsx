import {
  Droplets,
  Sprout,
  TriangleAlert,
  Target,
  ArrowRight,
} from "lucide-react";

import "../../styles/farmer/AIInsights.css";

const AIInsights = () => {
  const insights = [
    {
      id: 1,
      type: "irrigation",
      title: "Irrigation Advisory",
      badge: "Action Required",
      icon: <Droplets size={24} />,
      points: [
        "Apply 60mm irrigation within next 3 days before temperature peaks",
        "Use drip irrigation to save 30% water vs flood irrigation",
        "Next critical irrigation: grain filling stage (Day 75–90)",
      ],
    },
    {
      id: 2,
      type: "fertilizer",
      title: "Fertilizer Suggestions",
      badge: "Optimized",
      icon: <Sprout size={24} />,
      points: [
        "Top-dress 40 kg/Ha Urea at tillering stage (next week)",
        "Potassic fertilizer not needed — K levels adequate",
        "Micronutrient spray (Zinc Sulphate 0.5%) recommended at flowering",
      ],
    },
    {
      id: 3,
      type: "warning",
      title: "Weather Warnings",
      badge: "Alert",
      icon: <TriangleAlert size={24} />,
      points: [
        "Heavy rain 60–80% probability Thursday — avoid pesticide spray",
        "Temperature spike expected 36°C Friday — provide protective irrigation",
        "Strong winds forecast Monday — delay aerial pesticide application",
      ],
    },
    {
      id: 4,
      type: "improvement",
      title: "Yield Improvement",
      badge: "+18% potential",
      icon: <Target size={24} />,
      points: [
        "Switching to HD-3086 variety could increase yield by 12%",
        "Integrated Pest Management can reduce losses by 8–15%",
        "Laser land leveling can improve water use efficiency by 20%",
      ],
    },
  ];

  return (
    <div className="insights-page">
      <div className="insights-list">
        {insights.map((insight) => (
          <div
            className={`insight-card ${insight.type}`}
            key={insight.id}
          >
            <div className="insight-header">
              <div className="insight-title-section">
                <div className="insight-icon">
                  {insight.icon}
                </div>

                <h2>{insight.title}</h2>
              </div>

              <span className="insight-badge">
                {insight.badge}
              </span>
            </div>

            <div className="insight-points">
              {insight.points.map((point, index) => (
                <div
                  className="insight-point"
                  key={index}
                >
                  <ArrowRight size={17} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;