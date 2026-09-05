import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Users,
  Sprout,
  Award,
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Database,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAdminDashboard } from "../../services/adminApi";

import "../../styles/admin/Dashboard.css";


// =====================================================
// DASHBOARD
// =====================================================

const Dashboard = () => {

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async (
    isRefresh = false
  ) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getAdminDashboard();

      setDashboard(data);

    } catch (err) {

      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load admin dashboard."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);


  // =====================================================
  // SAFE DATA
  // =====================================================

  const stats =
    dashboard?.stats || {};

  const registrationGrowth =
    dashboard
      ?.user_registration_growth || [];

  const mostPredictedCrops =
    dashboard
      ?.most_predicted_crops || [];

  const predictionsOverTime =
    dashboard
      ?.predictions_over_time || [];


  // =====================================================
  // REGISTRATION CHART
  // =====================================================

  const registrationChart =
    useMemo(() => {

      if (
        !Array.isArray(
          registrationGrowth
        )
      ) {
        return [];
      }

      return registrationGrowth.map(
        (item) => ({
          date:
            item?.date,

          registrations:
            Number(
              item?.count
            ) || 0,
        })
      );

    }, [registrationGrowth]);


  // =====================================================
  // CROP CHART
  // =====================================================

  const cropChart =
    useMemo(() => {

      if (
        !Array.isArray(
          mostPredictedCrops
        )
      ) {
        return [];
      }

      return mostPredictedCrops
        .filter(
          (item) =>
            item &&
            item.crop
        )
        .slice(0, 6)
        .map(
          (item) => ({
            crop:
              item.crop ||
              "Unknown",

            count:
              Number(
                item.count
              ) || 0,
          })
        );

    }, [mostPredictedCrops]);


  // =====================================================
  // PREDICTIONS OVER TIME
  // =====================================================

  const predictionTimeChart =
    useMemo(() => {

      if (
        !Array.isArray(
          predictionsOverTime
        )
      ) {
        return [];
      }

      return predictionsOverTime.map(
        (item) => ({
          date:
            item?.date,

          predictions:
            Number(
              item?.count
            ) || 0,
        })
      );

    }, [predictionsOverTime]);


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return String(date);
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        month: "short",
        day: "numeric",
      }
    );
  };


  // =====================================================
  // CROP COLORS
  // =====================================================

  const cropColors = [
    "#12a150",
    "#e87d00",
    "#7540e8",
    "#1f67ed",
    "#62a33b",
    "#d34b70",
  ];


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="admin-dashboard-loading">

        <RefreshCw
          size={34}
          className="admin-dashboard-spin"
        />

        <h2>
          Loading Dashboard
        </h2>

        <p>
          Fetching real-time
          platform information...
        </p>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="admin-dashboard-error">

        <div className="dashboard-error-icon">
          <Activity size={27} />
        </div>

        <h2>
          Unable to Load Dashboard
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={() =>
            loadDashboard()
          }
        >

          <RefreshCw size={16} />

          Try Again

        </button>

      </div>
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-dashboard">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="dashboard-page-header">

        <div>

          <h1>
            Platform Overview
          </h1>

          <p>
            Real-time platform metrics
            and management
          </p>

        </div>


        <button
          className="dashboard-refresh-button"
          onClick={() =>
            loadDashboard(true)
          }
          disabled={refreshing}
        >

          <RefreshCw
            size={16}
            className={
              refreshing
                ? "admin-dashboard-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </section>


      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="dashboard-stat-grid">


        {/* TOTAL USERS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon users-icon">

              <Users size={21} />

            </div>

            <span className="stat-growth positive">

              <TrendingUp size={12} />

              Live

            </span>

          </div>


          <strong className="dashboard-stat-number">

            {Number(
              stats.total_users || 0
            ).toLocaleString()}

          </strong>


          <span className="dashboard-stat-title">
            Total Users
          </span>


          <span className="dashboard-stat-subtitle">
            Platform users
          </span>

        </div>


        {/* FARMERS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon farmer-icon">

              <Sprout size={21} />

            </div>

            <span className="stat-growth positive">

              <TrendingUp size={12} />

              Active

            </span>

          </div>


          <strong className="dashboard-stat-number">

            {Number(
              stats.total_farmers || 0
            ).toLocaleString()}

          </strong>


          <span className="dashboard-stat-title">
            Farmers
          </span>


          <span className="dashboard-stat-subtitle">
            Registered farmers
          </span>

        </div>


        {/* CONSULTANTS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon consultant-icon">

              <Award size={21} />

            </div>

            <span className="stat-growth positive">

              <TrendingUp size={12} />

              Active

            </span>

          </div>


          <strong className="dashboard-stat-number">

            {Number(
              stats.total_consultants || 0
            ).toLocaleString()}

          </strong>


          <span className="dashboard-stat-title">
            Consultants
          </span>


          <span className="dashboard-stat-subtitle">
            Agricultural experts
          </span>

        </div>


        {/* TOTAL PREDICTIONS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon prediction-icon">

              <Activity size={21} />

            </div>

            <span className="stat-growth positive">

              <TrendingUp size={12} />

              Live

            </span>

          </div>


          <strong className="dashboard-stat-number">

            {Number(
              stats.total_predictions || 0
            ).toLocaleString()}

          </strong>


          <span className="dashboard-stat-title">
            Total Predictions
          </span>


          <span className="dashboard-stat-subtitle">
            AI yield predictions
          </span>

        </div>


        {/* ACTIVE USERS */}

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-top">

            <div className="dashboard-stat-icon active-icon">

              <Users size={21} />

            </div>

            <span className="stat-growth positive">

              <TrendingUp size={12} />

              Live

            </span>

          </div>


          <strong className="dashboard-stat-number">

            {Number(
              stats.active_users || 0
            ).toLocaleString()}

          </strong>


          <span className="dashboard-stat-title">
            Active Users
          </span>


          <span className="dashboard-stat-subtitle">
            Currently active
          </span>

        </div>

      </section>


      {/* =================================================
          USER REGISTRATION
      ================================================= */}

      <section className="dashboard-single-chart">

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <div>

              <h2>
                User Registration Growth
              </h2>

              <p>
                User registrations over
                time
              </p>

            </div>


            <div className="chart-header-icon">

              <TrendingUp size={18} />

            </div>

          </div>


          <div className="chart-container">

            {registrationChart.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={
                    registrationChart
                  }
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="registrationFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#079447"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#079447"
                        stopOpacity={0.02}
                      />

                    </linearGradient>

                  </defs>


                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                  />


                  <XAxis
                    dataKey="date"
                    tickFormatter={
                      formatDate
                    }
                    tick={{
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  <YAxis
                    tick={{
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      value,
                      "Registrations",
                    ]}
                    labelFormatter={(
                      label
                    ) =>
                      formatDate(
                        label
                      )
                    }
                  />


                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="#079447"
                    fill="url(#registrationFill)"
                    strokeWidth={2}
                  />

                </AreaChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">

                No registration data
                available.

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =================================================
          CROPS + PREDICTIONS
      ================================================= */}

      <section className="dashboard-chart-grid">


        {/* =================================================
            MOST PREDICTED CROPS
        ================================================= */}

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <div>

              <h2>
                Most Predicted Crops
              </h2>

              <p>
                Crop prediction distribution
              </p>

            </div>


            <div className="chart-header-icon">

              <Sprout size={18} />

            </div>

          </div>


          <div className="crop-chart-container">

            {cropChart.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={cropChart}
                    dataKey="count"
                    nameKey="crop"
                    cx="50%"
                    cy="50%"
                    innerRadius="48%"
                    outerRadius="73%"
                    paddingAngle={2}
                  >

                    {cropChart.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`crop-${index}`}
                          fill={
                            cropColors[
                              index %
                              cropColors.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>


                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">

                No crop prediction
                data available.

              </div>

            )}

          </div>


          {/* CROP LEGEND */}

          {cropChart.length > 0 && (

            <div className="crop-legend">

              {cropChart
                .slice(0, 6)
                .map(
                  (
                    crop,
                    index
                  ) => (

                    <div
                      className="crop-legend-item"
                      key={crop.crop}
                    >

                      <span
                        className="crop-dot"
                        style={{
                          background:
                            cropColors[
                              index %
                              cropColors.length
                            ],
                        }}
                      />

                      <span>
                        {crop.crop}
                      </span>

                      <strong>
                        {Number(
                          crop.count
                        ).toLocaleString()}
                      </strong>

                    </div>

                  )
                )}

            </div>

          )}

        </div>


        {/* =================================================
            PREDICTIONS OVER TIME
        ================================================= */}

        <div className="dashboard-chart-card">

          <div className="chart-card-header">

            <div>

              <h2>
                Predictions Over Time
              </h2>

              <p>
                AI prediction activity
              </p>

            </div>


            <div className="chart-header-icon">

              <Activity size={18} />

            </div>

          </div>


          <div className="chart-container">

            {predictionTimeChart.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={
                    predictionTimeChart
                  }
                  margin={{
                    top: 10,
                    right: 10,
                    left: -10,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />


                  <XAxis
                    dataKey="date"
                    tickFormatter={
                      formatDate
                    }
                    tick={{
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  <YAxis
                    tick={{
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />


                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      value,
                      "Predictions",
                    ]}
                    labelFormatter={(
                      label
                    ) =>
                      formatDate(
                        label
                      )
                    }
                  />


                  <Line
                    type="monotone"
                    dataKey="predictions"
                    stroke="#64b800"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div className="chart-empty">

                No prediction activity
                available.

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER SUMMARY
      ================================================= */}

      <section className="dashboard-summary-strip">


        {/* DATASETS */}

        <div>

          <Database size={20} />

          <div>

            <span>
              Managed Datasets
            </span>

            <strong>
              {Number(
                stats.total_datasets || 0
              ).toLocaleString()}
            </strong>

          </div>

        </div>


        {/* ADMINISTRATORS */}

        <div>

          <Users size={20} />

          <div>

            <span>
              Administrators
            </span>

            <strong>
              {Number(
                stats.total_admins || 0
              ).toLocaleString()}
            </strong>

          </div>

        </div>


        {/* PLATFORM */}

        <div>

          <Activity size={20} />

          <div>

            <span>
              Platform Status
            </span>

            <strong className="platform-online">
              Online
            </strong>

          </div>

        </div>

      </section>

    </div>
  );
};


export default Dashboard;