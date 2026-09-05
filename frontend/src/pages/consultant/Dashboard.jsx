import React, { useEffect, useState } from "react";
import {
  Users,
  Activity,
  CircleCheck,
  TriangleAlert,
  ArrowUp,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { api } from "../../services/api";

import "../../styles/consultant/Dashboard.css";

/* =========================================================
   STAT CARD
   ========================================================= */

const StatCard = ({
  icon,
  iconType,
  value,
  title,
  subtitle,
  change,
}) => {
  return (
    <div className="dashboard-stat-card">

      <div className={`dashboard-stat-icon ${iconType}`}>
        {icon}
      </div>

      {change !== null &&
        change !== undefined &&
        change !== "" && (
          <div className="dashboard-stat-change">
            <ArrowUp size={12} />
            {change}
          </div>
        )}

      <div className="dashboard-stat-value">
        {value}
      </div>

      <div className="dashboard-stat-title">
        {title}
      </div>

      <div className="dashboard-stat-subtitle">
        {subtitle}
      </div>

    </div>
  );
};


/* =========================================================
   HELPER
   ========================================================= */

const getValue = (obj, ...keys) => {
  for (const key of keys) {
    if (
      obj &&
      obj[key] !== undefined &&
      obj[key] !== null
    ) {
      return obj[key];
    }
  }

  return 0;
};


/* =========================================================
   FORMAT CHANGE
   ========================================================= */

const formatChange = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const stringValue = String(value);

  if (
    stringValue.startsWith("+") ||
    stringValue.startsWith("-")
  ) {
    return stringValue;
  }

  return `+${stringValue}`;
};


/* =========================================================
   GET DATA ARRAY
   ========================================================= */

const getArray = (data, ...keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};


/* =========================================================
   DASHBOARD
   ========================================================= */

const Dashboard = () => {

  const [dashboard, setDashboard] = useState(null);

  const [alertCount, setAlertCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  /* =======================================================
     FETCH DASHBOARD
     ======================================================= */

  const fetchDashboard = async (isRefresh = false) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");


      /* -----------------------------------------------
         DASHBOARD DATA
         ----------------------------------------------- */

      const dashboardResponse =
        await api.getConsultantDashboard();

      console.log(
        "CONSULTANT DASHBOARD:",
        dashboardResponse
      );

      setDashboard(dashboardResponse);


      /* -----------------------------------------------
         UNREAD ALERT COUNT
         ----------------------------------------------- */

      try {

        const alertResponse =
          await api.getConsultantUnreadAlertCount();

        console.log(
          "CONSULTANT ALERT COUNT:",
          alertResponse
        );


        const count =
          alertResponse?.unread_count ??
          alertResponse?.unreadCount ??
          alertResponse?.count ??
          alertResponse?.data?.unread_count ??
          alertResponse?.data?.unreadCount ??
          alertResponse?.data?.count ??
          0;

        setAlertCount(Number(count) || 0);

      } catch (alertError) {

        /*
         * Dashboard should still work if the
         * alert endpoint has a temporary problem.
         */

        console.error(
          "Failed to load alert count:",
          alertError
        );

        setAlertCount(0);
      }

    } catch (err) {

      console.error(
        "Failed to load consultant dashboard:",
        err
      );

      setError(
        err?.message ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {

    fetchDashboard();

  }, []);


  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {

    return (
      <div className="dashboard-loading">

        <Loader2
          size={28}
          className="dashboard-loader"
        />

        <p>
          Loading dashboard...
        </p>

      </div>
    );

  }


  /* =======================================================
     ERROR
     ======================================================= */

  if (error) {

    return (
      <div className="dashboard-error">

        <TriangleAlert size={28} />

        <h3>
          Unable to load dashboard
        </h3>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={() => fetchDashboard()}
          className="dashboard-retry-btn"
        >
          Try Again
        </button>

      </div>
    );

  }


  /* =======================================================
     NORMALIZE BACKEND RESPONSE
     ======================================================= */

  const data =
    dashboard?.data ||
    dashboard?.dashboard ||
    dashboard ||
    {};


  /* =======================================================
     CONSULTANT NAME
     ======================================================= */

  const consultantName =
    data?.consultant_name ||
    data?.consultantName ||
    data?.consultant?.name ||
    data?.consultant?.full_name ||
    data?.consultant?.fullName ||
    data?.user?.name ||
    data?.user?.full_name ||
    data?.user?.fullName ||
    "Consultant";


  /* =======================================================
     STATISTICS
     ======================================================= */

  const totalFarmers = getValue(
    data,
    "total_farmers",
    "totalFarmers",
    "farmers_count",
    "farmer_count"
  );


  const activeConsultations = getValue(
    data,
    "active_consultations",
    "activeConsultations",
    "pending_consultations_count",
    "pendingConsultationsCount"
  );


  const predictionsReviewed = getValue(
    data,
    "predictions_reviewed",
    "predictionsReviewed",
    "reviewed_predictions",
    "reviewedPredictions"
  );


  /*
   * Prefer the actual Alerts API count.
   *
   * If the backend dashboard already returns
   * active_alerts, it can still be used as fallback.
   */

  const dashboardAlertCount = getValue(
    data,
    "active_alerts",
    "activeAlerts",
    "alerts_count",
    "alert_count"
  );


  const activeAlerts =
    alertCount > 0 ||
    dashboardAlertCount === 0
      ? alertCount
      : dashboardAlertCount;


  /* =======================================================
     CHANGES
     ======================================================= */

  const farmerChange = formatChange(
    getValue(
      data,
      "farmer_change",
      "farmerChange"
    )
  );


  const predictionChange = formatChange(
    getValue(
      data,
      "prediction_change",
      "predictionChange"
    )
  );


  /* =======================================================
     WEEKLY PREDICTIONS
     ======================================================= */

  const weeklyPredictions = getArray(
    data,
    "weekly_predictions",
    "weeklyPredictions",
    "predictions_this_week",
    "predictionsThisWeek"
  );


  /* =======================================================
     PENDING CONSULTATIONS
     ======================================================= */

  const pendingConsultations = getArray(
    data,
    "pending_consultations",
    "pendingConsultations"
  );


  /* =======================================================
     FORMAT WEEKLY DATA
     ======================================================= */

  const formattedWeeklyPredictions =
    weeklyPredictions.map((item) => {

      if (
        item &&
        typeof item === "object"
      ) {

        return {
          day:
            item.day ||
            item.date ||
            item.label ||
            "—",

          value:
            Number(
              item.value ??
              item.count ??
              item.predictions ??
              0
            ) || 0,
        };

      }

      return {
        day: "—",
        value: Number(item) || 0,
      };

    });


  /* =======================================================
     MAX CHART VALUE
     ======================================================= */

  const actualMax =
    formattedWeeklyPredictions.length > 0
      ? Math.max(
          ...formattedWeeklyPredictions.map(
            (item) => Number(item.value) || 0
          )
        )
      : 0;


  /*
   * Minimum scale of 16 keeps the original
   * dashboard appearance when numbers are small.
   */

  const maxPredictionValue =
    Math.max(actualMax, 16);


  /* =======================================================
     CHART GRID VALUES
     ======================================================= */

  const chartSteps = [
    maxPredictionValue,
    Math.round(maxPredictionValue * 0.75),
    Math.round(maxPredictionValue * 0.5),
    Math.round(maxPredictionValue * 0.25),
    0,
  ];


  /* =======================================================
     DATE
     ======================================================= */

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );


  /* =======================================================
     RESPOND TO CONSULTATION
     ======================================================= */

  const handleRespond = (consultation) => {

    console.log(
      "Respond to consultation:",
      consultation
    );

    /*
     * The actual navigation/action can be connected
     * later to the Consultation page.
     *
     * We deliberately don't invent a route here.
     */
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <div className="dashboard-container">


      {/* ===================================================
          HEADER
          =================================================== */}

      <section className="dashboard-welcome">

        <div>

          <h1>
            Welcome, {consultantName}!
          </h1>

          <p>
            Agricultural Consultant · {formattedDate}
          </p>

        </div>


        {/* REFRESH */}

        <button
          type="button"
          className="dashboard-refresh-btn"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          title="Refresh dashboard"
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "dashboard-refresh-spinning"
                : ""
            }
          />

          <span>
            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </span>

        </button>

      </section>


      {/* ===================================================
          STAT CARDS
          =================================================== */}

      <section className="dashboard-stats-grid">


        {/* TOTAL FARMERS */}

        <StatCard
          icon={<Users size={21} />}
          iconType="dashboard-green"
          value={totalFarmers}
          title="Total Farmers"
          subtitle="under your care"
          change={farmerChange}
        />


        {/* ACTIVE CONSULTATIONS */}

        <StatCard
          icon={<Activity size={22} />}
          iconType="dashboard-blue"
          value={activeConsultations}
          title="Active Consultations"
          subtitle="pending responses"
        />


        {/* PREDICTIONS REVIEWED */}

        <StatCard
          icon={<CircleCheck size={22} />}
          iconType="dashboard-lime"
          value={predictionsReviewed}
          title="Predictions Reviewed"
          subtitle="this month"
          change={predictionChange}
        />


        {/* ACTIVE ALERTS */}

        <StatCard
          icon={<TriangleAlert size={21} />}
          iconType="dashboard-orange"
          value={activeAlerts}
          title="Active Alerts"
          subtitle="requiring attention"
        />

      </section>


      {/* ===================================================
          LOWER CONTENT
          =================================================== */}

      <section className="dashboard-lower-grid">


        {/* =================================================
            WEEKLY PREDICTIONS
            ================================================= */}

        <div className="dashboard-chart-card">

          <h2>
            Predictions Reviewed This Week
          </h2>


          <div className="dashboard-chart-area">


            {/* Y AXIS */}

            <div className="dashboard-y-axis">

              {chartSteps.map(
                (step, index) => (

                  <span key={index}>
                    {step}
                  </span>

                )
              )}

            </div>


            {/* CHART */}

            <div className="dashboard-chart">


              {/* GRID LINES */}

              <div className="chart-line chart-line-16"></div>

              <div className="chart-line chart-line-12"></div>

              <div className="chart-line chart-line-8"></div>

              <div className="chart-line chart-line-4"></div>

              <div className="chart-line chart-line-0"></div>


              {/* BARS */}

              <div className="dashboard-bars">

                {formattedWeeklyPredictions.length === 0 ? (

                  <div className="dashboard-no-chart-data">

                    <p>
                      No prediction data available
                    </p>

                  </div>

                ) : (

                  formattedWeeklyPredictions.map(
                    (item, index) => {

                      const value =
                        Number(item.value) || 0;

                      const height =
                        maxPredictionValue > 0
                          ? Math.min(
                              (value /
                                maxPredictionValue) *
                                100,
                              100
                            )
                          : 0;


                      return (

                        <div
                          className="dashboard-bar-column"
                          key={`${item.day}-${index}`}
                        >

                          <div
                            className="dashboard-bar"
                            style={{
                              height: `${height}%`,
                            }}
                            title={`${item.day}: ${value}`}
                          >
                          </div>


                          <span className="dashboard-bar-label">
                            {item.day}
                          </span>

                        </div>

                      );

                    }
                  )

                )}

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            PENDING CONSULTATIONS
            ================================================= */}

        <div className="dashboard-pending">

          <div className="dashboard-section-heading">

            <h2>
              Pending Consultations
            </h2>

          </div>


          <div className="dashboard-consultation-list">


            {pendingConsultations.length === 0 ? (

              <div className="dashboard-no-data">

                <CircleCheck size={24} />

                <p>
                  No pending consultations
                </p>

              </div>

            ) : (

              pendingConsultations.map(
                (consultation, index) => {

                  const name =
                    consultation?.name ||
                    consultation?.farmer_name ||
                    consultation?.farmerName ||
                    consultation?.farmer?.name ||
                    "Unknown Farmer";


                  const issue =
                    consultation?.issue ||
                    consultation?.message ||
                    consultation?.subject ||
                    "Consultation request";


                  const priority =
                    String(
                      consultation?.priority ||
                      "medium"
                    ).toLowerCase();


                  const time =
                    consultation?.time ||
                    consultation?.created_at ||
                    consultation?.createdAt ||
                    "";


                  const consultationId =
                    consultation?.id ||
                    consultation?._id ||
                    index;


                  return (

                    <div
                      className="dashboard-consultation-card"
                      key={consultationId}
                    >


                      <div className="dashboard-consultation-header">

                        <div className="dashboard-farmer-name">
                          {name}
                        </div>


                        <span
                          className={`dashboard-priority ${priority}`}
                        >
                          {priority}
                        </span>

                      </div>


                      <div className="dashboard-consultation-issue">
                        {issue}
                      </div>


                      <div className="dashboard-consultation-footer">

                        <span>
                          {time}
                        </span>


                        <button
                          type="button"
                          className="dashboard-respond-btn"
                          onClick={() =>
                            handleRespond(
                              consultation
                            )
                          }
                        >
                          Respond
                        </button>

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>

        </div>

      </section>

    </div>

  );

};


export default Dashboard;