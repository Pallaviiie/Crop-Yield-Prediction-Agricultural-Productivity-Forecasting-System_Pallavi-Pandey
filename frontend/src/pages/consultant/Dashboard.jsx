import React, {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Activity,
  CircleCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import ConsultantLayout from
  "../../components/consultant/ConsultantLayout";

import {
  getConsultantDashboard,
  getPendingConsultations,
} from "../../services/api";


export default function ConsultantDashboard() {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedDay, setSelectedDay] =
    useState(null);


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getConsultantDashboard();

        setDashboard(data);

      } catch (error) {

        console.error(
          "CONSULTANT DASHBOARD ERROR:",
          error
        );

        setError(
          error.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <ConsultantLayout
        title="Consultant Dashboard"
      >

        <div className="ys-empty-card">

          <Loader2
            size={32}
            className="ys-loading-icon"
          />

          <h2>
            Loading Dashboard
          </h2>

          <p>
            Fetching your consultant data...
          </p>

        </div>

      </ConsultantLayout>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <ConsultantLayout
        title="Consultant Dashboard"
      >

        <div className="ys-empty-card">

          <AlertTriangle
            size={32}
          />

          <h2>
            Unable to Load Dashboard
          </h2>

          <p>
            {error}
          </p>

        </div>

      </ConsultantLayout>

    );

  }


  const metrics =
    dashboard?.metrics || {};

  const weeklyData =
    dashboard?.weekly_predictions || [];

  const consultations =
    dashboard?.pending_consultations || [];

  const consultant =
    dashboard?.consultant || {};


  return (

    <ConsultantLayout
      title="Consultant Dashboard"
    >

      {/* ==================================================== */}
      {/* WELCOME */}
      {/* ==================================================== */}

      <section className="consultant-welcome">

        <h1>
          Welcome, {
            consultant.full_name ||
            localStorage.getItem(
              "user_name"
            ) ||
            "Consultant"
          }!
        </h1>

        <p>

          Agricultural Consultant

          {consultant.specialization
            ? ` · ${consultant.specialization}`
            : ""
          }

        </p>

      </section>


      {/* ==================================================== */}
      {/* METRICS */}
      {/* ==================================================== */}

      <section className="metrics-grid">


        {/* FARMERS */}

        <div className="consultant-metric-card">

          <div className="metric-icon metric-green">

            <Users size={21} />

          </div>

          <div className="metric-value">

            {metrics.total_farmers || 0}

          </div>

          <div className="metric-title">

            Total Farmers

          </div>

          <div className="metric-subtitle">

            under your care

          </div>

        </div>


        {/* CONSULTATIONS */}

        <div className="consultant-metric-card">

          <div className="metric-icon metric-blue">

            <Activity size={21} />

          </div>

          <div className="metric-value">

            {metrics.active_consultations || 0}

          </div>

          <div className="metric-title">

            Active Consultations

          </div>

          <div className="metric-subtitle">

            connected with farmers

          </div>

        </div>


        {/* PREDICTIONS */}

        <div className="consultant-metric-card">

          <div className="metric-icon metric-lime">

            <CircleCheck size={21} />

          </div>

          <div className="metric-value">

            {metrics.total_predictions || 0}

          </div>

          <div className="metric-title">

            Predictions Available

          </div>

          <div className="metric-subtitle">

            agricultural prediction records

          </div>

        </div>


        {/* ALERTS */}

        <div className="consultant-metric-card">

          <div className="metric-icon metric-orange">

            <AlertTriangle size={21} />

          </div>

          <div className="metric-value">

            {metrics.active_alerts || 0}

          </div>

          <div className="metric-title">

            Pending Alerts

          </div>

          <div className="metric-subtitle">

            unread farmer requests

          </div>

        </div>

      </section>


      {/* ==================================================== */}
      {/* CHART + CONSULTATIONS */}
      {/* ==================================================== */}

      <section className="dashboard-main-grid">


        {/* WEEKLY CHART */}

        <div className="chart-card">

          <h2>

            Predictions Created This Week

          </h2>

          <div className="chart-wrapper">


            <div className="y-axis">

              <span>16</span>
              <span>12</span>
              <span>8</span>
              <span>4</span>
              <span>0</span>

            </div>


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
                        selectedDay?.day ===
                        item.day
                          ? "selected"
                          : ""
                      }`}
                      style={{
                        height:
                          `${Math.max(
                            (item.value / 16) * 100,
                            item.value > 0
                              ? 5
                              : 0
                          )}%`,
                      }}
                    >

                      {selectedDay?.day ===
                        item.day && (

                        <div
                          className="chart-tooltip"
                        >

                          <strong>
                            {item.day}
                          </strong>

                          <span>

                            Predictions:
                            {" "}
                            {item.value}

                          </span>

                        </div>

                      )}

                    </div>


                    <span
                      className="bar-label"
                    >

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


            {consultations.length === 0 ? (

              <div className="ys-card">

                <p>

                  No pending consultations.
                  You're all caught up!

                </p>

              </div>

            ) : (

              consultations.map((item) => (

                <div
                  className="consultation-card"
                  key={
                    item.conversation_id
                  }
                >

                  <div className="consultation-top">

                    <strong>

                      {item.name}

                    </strong>


                    <span
                      className={`priority ${
                        item.priority
                      }`}
                    >

                      {item.priority}

                    </span>

                  </div>


                  <p>

                    {item.issue}

                  </p>


                  <div
                    className="consultation-bottom"
                  >

                    <span>

                      {item.time}

                      {" · "}

                      {item.unread_count}

                      {" unread"}

                    </span>


                    <a
                      href={
                        `/consultant/consultations?conversation=${item.conversation_id}`
                      }
                      className="respond-button"
                    >

                      Respond

                    </a>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </section>

    </ConsultantLayout>

  );

}