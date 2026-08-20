import React, { useState } from "react";

import {
  Users,
  Activity,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";

import "../../styles/consultant/ConsultantDashboard.css";

const weeklyData = [
  {
    day: "Mon",
    value: 8,
  },
  {
    day: "Tue",
    value: 12,
  },
  {
    day: "Wed",
    value: 6,
  },
  {
    day: "Thu",
    value: 15,
  },
  {
    day: "Fri",
    value: 9,
  },
  {
    day: "Sat",
    value: 4,
  },
  {
    day: "Sun",
    value: 2,
  },
];

const consultations = [
  {
    name: "Rajesh Kumar",
    issue: "Soil pH dropping below 6.0",
    time: "2h ago",
    priority: "high",
  },
  {
    name: "Priya Sharma",
    issue: "Wheat yield lower than expected",
    time: "5h ago",
    priority: "medium",
  },
  {
    name: "Mohan Patel",
    issue: "Best rabi crop selection",
    time: "1d ago",
    priority: "low",
  },
];

const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="consultant-dashboard">

      {/* ================= WELCOME ================= */}

      <section className="consultant-welcome">

        <h1>
          Welcome, Dr.!
        </h1>

        <p>
          Agricultural Consultant · Sunday, 16 August
        </p>

      </section>


      {/* ================= METRICS ================= */}

      <section className="metrics-grid">

        {/* Total Farmers */}
        <div className="consultant-metric-card">

          <div className="metric-icon metric-green">
            <Users size={21} />
          </div>

          <span className="metric-badge">
            ↑ +3
          </span>

          <div className="metric-value">
            24
          </div>

          <div className="metric-title">
            Total Farmers
          </div>

          <div className="metric-subtitle">
            under your care
          </div>

        </div>


        {/* Consultations */}
        <div className="consultant-metric-card">

          <div className="metric-icon metric-blue">
            <Activity size={21} />
          </div>

          <div className="metric-value">
            8
          </div>

          <div className="metric-title">
            Active Consultations
          </div>

          <div className="metric-subtitle">
            pending responses
          </div>

        </div>


        {/* Predictions */}
        <div className="consultant-metric-card">

          <div className="metric-icon metric-lime">
            <CircleCheck size={21} />
          </div>

          <span className="metric-badge">
            ↑ +12
          </span>

          <div className="metric-value">
            142
          </div>

          <div className="metric-title">
            Predictions Reviewed
          </div>

          <div className="metric-subtitle">
            this month
          </div>

        </div>


        {/* Alerts */}
        <div className="consultant-metric-card">

          <div className="metric-icon metric-orange">
            <AlertTriangle size={21} />
          </div>

          <div className="metric-value">
            5
          </div>

          <div className="metric-title">
            Active Alerts
          </div>

          <div className="metric-subtitle">
            requiring attention
          </div>

        </div>

      </section>


      {/* ================= CHART + CONSULTATIONS ================= */}

      <section className="dashboard-main-grid">

        {/* CHART */}

        <div className="chart-card">

          <h2>
            Predictions Reviewed This Week
          </h2>

          <div className="chart-wrapper">

            {/* Y Axis */}

            <div className="y-axis">

              <span>16</span>
              <span>12</span>
              <span>8</span>
              <span>4</span>
              <span>0</span>

            </div>


            {/* Chart */}

            <div className="chart-area">

              <div className="chart-grid-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>


              <div className="bars">

                {weeklyData.map((item) => (

                  <div
                    className="bar-column"
                    key={item.day}
                    onClick={() =>
                      setSelectedDay(item)
                    }
                  >

                    <div
                      className={`bar ${
                        selectedDay?.day === item.day
                          ? "selected"
                          : ""
                      }`}
                      style={{
                        height: `${(item.value / 16) * 100}%`,
                      }}
                    >

                      {selectedDay?.day === item.day && (
                        <div className="chart-tooltip">

                          <strong>
                            {item.day}
                          </strong>

                          <span>
                            Reviewed: {item.value}
                          </span>

                        </div>
                      )}

                    </div>

                    <span className="bar-label">
                      {item.day}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* PENDING CONSULTATIONS */}

        <div className="pending-section">

          <h2>
            Pending Consultations
          </h2>

          <div className="consultation-list">

            {consultations.map((item) => (

              <div
                className="consultation-card"
                key={item.name}
              >

                <div className="consultation-top">

                  <strong>
                    {item.name}
                  </strong>

                  <span
                    className={`priority ${item.priority}`}
                  >
                    {item.priority}
                  </span>

                </div>


                <p>
                  {item.issue}
                </p>


                <div className="consultation-bottom">

                  <span>
                    {item.time}
                  </span>

                  <button
                    type="button"
                    className="respond-button"
                  >
                    Respond
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;