import React from "react";
import ConsultantLayout from "../../components/consultant/ConsultantLayout";

export default function Analytics() {
  return (
    <ConsultantLayout title="Analytics">
      <div className="ys-analytics-grid">
        <div className="ys-card ys-analytics-card">
          <h3 className="ys-card-title">Crop Distribution Among Farmers</h3>

          <div className="ys-pie-wrap">
            <div className="ys-pie" />
            <div className="ys-pie-legend">
              <span className="ys-pie-label wheat">Wheat 32%</span>
              <span className="ys-pie-label rice">Rice 28%</span>
              <span className="ys-pie-label maize">Maize 18%</span>
              <span className="ys-pie-label cotton">Cotton 12%</span>
              <span className="ys-pie-label other">Others 10%</span>
            </div>
          </div>
        </div>

        <div className="ys-card ys-analytics-card">
          <h3 className="ys-card-title">Yield Trends — Managed Farms</h3>

          <div className="ys-line-chart">
            <svg viewBox="0 0 700 230" preserveAspectRatio="none">
              {[30, 75, 120, 165, 210].map((y) => (
                <line key={y} x1="35" y1={y} x2="680" y2={y} className="ys-grid-line" />
              ))}
              <polyline
                className="ys-line"
                points="35,135 140,128 245,145 350,119 455,105 560,110 680,94"
              />
            </svg>
          </div>

          <div className="ys-line-legend">— Avg Wheat &nbsp;&nbsp; — Avg Rice</div>
        </div>
      </div>
    </ConsultantLayout>
  );
}
