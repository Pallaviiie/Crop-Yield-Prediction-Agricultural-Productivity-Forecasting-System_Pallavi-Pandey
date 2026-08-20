import React from "react";
import {
  Users,
  Activity,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";
import ConsultantLayout from "../../components/consultant/ConsultantLayout";

const bars = [
  ["Mon", 8], ["Tue", 12], ["Wed", 6], ["Thu", 15],
  ["Fri", 9], ["Sat", 4], ["Sun", 2],
];

const pending = [
  ["Rajesh Kumar", "Soil pH dropping below 6.0", "high", "2h ago"],
  ["Priya Sharma", "Wheat yield lower than expected", "medium", "5h ago"],
  ["Mohan Patel", "Best rabi crop selection", "low", "1d ago"],
];

export default function ConsultantDashboard() {
  return (
    <ConsultantLayout title="Consultant Dashboard">
      <div className="ys-dashboard-head">
        <h2 className="ys-welcome-title">Welcome, Dr.!</h2>
        <p className="ys-subtitle">Agricultural Consultant · Sunday, 16 August</p>
      </div>

      <section className="ys-stat-grid">
        <Stat icon={<Users size={22} />} color="green" value="24" label="Total Farmers" help="under your care" change="↑ +3" />
        <Stat icon={<Activity size={22} />} color="blue" value="8" label="Active Consultations" help="pending responses" />
        <Stat icon={<CircleCheck size={22} />} color="lime" value="142" label="Predictions Reviewed" help="this month" change="↑ +12" />
        <Stat icon={<TriangleAlert size={22} />} color="orange" value="5" label="Active Alerts" help="requiring attention" />
      </section>

      <section className="ys-dashboard-lower">
        <div className="ys-card ys-chart-card">
          <h3 className="ys-card-title">Predictions Reviewed This Week</h3>
          <div className="ys-bar-chart">
            {bars.map(([day, value]) => (
              <div className="ys-bar-col" key={day}>
                <div className="ys-bar" style={{ height: `${value * 9}px` }} />
                <span className="ys-bar-label">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="ys-pending-title">Pending Consultations</h3>
          <div className="ys-pending-list">
            {pending.map(([name, topic, priority, time]) => (
              <div className="ys-card ys-pending" key={name}>
                <div className="ys-pending-top">
                  <span className="ys-pending-name">{name}</span>
                  <span className={`ys-priority ${priority}`}>{priority}</span>
                </div>
                <div className="ys-pending-topic">{topic}</div>
                <div className="ys-pending-bottom">
                  <span className="ys-pending-time">{time}</span>
                  <button className="ys-respond">Respond</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ConsultantLayout>
  );
}

function Stat({ icon, color, value, label, help, change }) {
  return (
    <div className="ys-card ys-stat-card">
      <div className={`ys-stat-icon ${color}`}>{icon}</div>
      {change && <span className="ys-stat-change">{change}</span>}
      <strong className="ys-stat-value">{value}</strong>
      <div className="ys-stat-label">{label}</div>
      <div className="ys-stat-help">{help}</div>
    </div>
  );
}
