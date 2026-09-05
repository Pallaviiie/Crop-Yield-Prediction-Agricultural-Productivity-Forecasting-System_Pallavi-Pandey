import React, { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Sprout,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  MapPin,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getAdminAnalytics } from "../../services/adminApi";

import "../../styles/admin/Analytics.css";


const Analytics = () => {

  // =========================================================
  // STATE
  // =========================================================

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // FETCH ANALYTICS
  // =========================================================

  const loadAnalytics = async (isRefresh = false) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminAnalytics();

      console.log("ADMIN ANALYTICS RESPONSE:", data);

      setAnalytics(data || {});

    } catch (err) {

      console.error("Admin analytics error:", err);

      setError(
        err?.message ||
        "Unable to load analytics data."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  useEffect(() => {

    loadAnalytics();

  }, []);


  // =========================================================
  // USER GROWTH
  // =========================================================

  const userGrowthData = useMemo(() => {

    const source =
      analytics?.user_registration_growth ||
      analytics?.user_growth ||
      analytics?.registration_growth ||
      [];


    if (Array.isArray(source)) {

      return source
        .map((item, index) => ({

          date:
            item.date ||
            item.month ||
            item.period ||
            item.label ||
            `Period ${index + 1}`,

          users: Number(
            item.count ??
            item.users ??
            item.value ??
            item.total ??
            0
          ),

        }))
        .filter(
          (item) => item.users >= 0
        );

    }


    if (
      typeof source === "object" &&
      source !== null
    ) {

      return Object.entries(source).map(
        ([date, value]) => ({

          date,

          users:
            typeof value === "object"
              ? Number(
                  value.count ??
                  value.users ??
                  value.value ??
                  value.total ??
                  0
                )
              : Number(value) || 0,

        })
      );

    }


    return [];

  }, [analytics]);


  // =========================================================
  // PREDICTIONS BY CROP
  // =========================================================

  const cropPredictionData = useMemo(() => {

    const source =
      analytics?.most_predicted_crops ||
      analytics?.predictions_by_crop ||
      analytics?.crop_predictions ||
      analytics?.crop_counts ||
      [];


    if (Array.isArray(source)) {

      return source
        .map((item) => ({

          crop:
            item.crop ||
            item.name ||
            item.label ||
            "Unknown",

          predictions: Number(
            item.count ??
            item.predictions ??
            item.total ??
            item.value ??
            0
          ),

        }))
        .filter(
          (item) => item.predictions > 0
        );

    }


    if (
      typeof source === "object" &&
      source !== null
    ) {

      return Object.entries(source)
        .map(([crop, value]) => ({

          crop,

          predictions:
            typeof value === "object"
              ? Number(
                  value.count ??
                  value.predictions ??
                  value.total ??
                  value.value ??
                  0
                )
              : Number(value) || 0,

        }))
        .filter(
          (item) => item.predictions > 0
        );

    }


    return [];

  }, [analytics]);


  // =========================================================
  // AVERAGE YIELD
  // =========================================================

  const yieldData = useMemo(() => {

    const source =
      analytics?.average_yield_by_crop ||
      analytics?.avg_yield_by_crop ||
      analytics?.yield_by_crop ||
      [];


    if (Array.isArray(source)) {

      return source
        .map((item) => ({

          crop:
            item.crop ||
            item.name ||
            item.label ||
            "Unknown",

          yield: Number(
            item.avg_yield ??
            item.average_yield ??
            item.yield ??
            item.value ??
            0
          ),

        }))
        .filter(
          (item) => item.yield > 0
        );

    }


    if (
      typeof source === "object" &&
      source !== null
    ) {

      return Object.entries(source)
        .map(([crop, value]) => ({

          crop,

          yield:
            typeof value === "object"
              ? Number(
                  value.avg_yield ??
                  value.average_yield ??
                  value.yield ??
                  value.value ??
                  0
                )
              : Number(value) || 0,

        }))
        .filter(
          (item) => item.yield > 0
        );

    }


    return [];

  }, [analytics]);


  // =========================================================
  // PREDICTIONS BY LOCATION
  // =========================================================

  const locationData = useMemo(() => {

    const source =
      analytics?.predictions_by_state ||
      analytics?.predictions_by_location ||
      analytics?.location_predictions ||
      [];


    if (Array.isArray(source)) {

      return source
        .map((item) => ({

          location:
            item.state ||
            item.location ||
            item.district ||
            item.name ||
            "Unknown",

          predictions: Number(
            item.count ??
            item.predictions ??
            item.total ??
            item.value ??
            0
          ),

        }))
        .filter(
          (item) => item.predictions > 0
        );

    }


    if (
      typeof source === "object" &&
      source !== null
    ) {

      return Object.entries(source)
        .map(([location, value]) => ({

          location,

          predictions:
            typeof value === "object"
              ? Number(
                  value.count ??
                  value.predictions ??
                  value.total ??
                  value.value ??
                  0
                )
              : Number(value) || 0,

        }))
        .filter(
          (item) => item.predictions > 0
        );

    }


    return [];

  }, [analytics]);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="admin-analytics-page">

        <div className="analytics-loading">

          <div className="analytics-spinner"></div>

          <span>
            Loading analytics...
          </span>

        </div>

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="admin-analytics-page">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="admin-page-header">

        <div className="analytics-title-row">

          <div className="analytics-title-icon">

            <BarChart3 size={24} />

          </div>


          <div>

            <h1>
              Analytics
            </h1>

            <p>
              Monitor platform trends and prediction insights.
            </p>

          </div>

        </div>


        <button
          className="analytics-refresh-btn"
          onClick={() => loadAnalytics(true)}
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "analytics-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div className="analytics-error">

          <AlertCircle size={20} />

          <div>

            <strong>
              Unable to load analytics
            </strong>

            <span>
              {error}
            </span>

          </div>


          <button
            onClick={() => loadAnalytics()}
          >
            Retry
          </button>

        </div>

      )}


      {/* ===================================================
          USER GROWTH
      =================================================== */}

      <div className="analytics-chart-card analytics-full-width">

        <div className="analytics-chart-header">

          <div>

            <h2>
              User Growth
            </h2>

            <p>
              User registrations over time
            </p>

          </div>


          <div className="analytics-chart-icon">

            <TrendingUp size={19} />

          </div>

        </div>


        {userGrowthData.length === 0 ? (

          <div className="analytics-no-data">

            No user growth data available.

          </div>

        ) : (

          <div className="analytics-chart">

            <ResponsiveContainer
              width="100%"
              height={340}
            >

              <LineChart
                data={userGrowthData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5ebe7"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="users"
                  name="Registered Users"
                  stroke="#198754"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#198754",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* ===================================================
          CROP + YIELD
      =================================================== */}

      <div className="analytics-chart-grid">


        {/* =================================================
            PREDICTIONS BY CROP
        ================================================= */}

        <div className="analytics-chart-card">

          <div className="analytics-chart-header">

            <div>

              <h2>
                Predictions by Crop
              </h2>

              <p>
                Number of predictions generated for each crop
              </p>

            </div>


            <div className="analytics-chart-icon">

              <Sprout size={19} />

            </div>

          </div>


          {cropPredictionData.length === 0 ? (

            <div className="analytics-no-data">

              No crop prediction data available.

            </div>

          ) : (

            <div className="analytics-chart">

              <ResponsiveContainer
                width="100%"
                height={340}
              >

                <BarChart
                  data={cropPredictionData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 55,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5ebe7"
                  />

                  <XAxis
                    dataKey="crop"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={75}
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                    }}
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="predictions"
                    name="Predictions"
                    fill="#198754"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* =================================================
            AVERAGE YIELD
        ================================================= */}

        <div className="analytics-chart-card">

          <div className="analytics-chart-header">

            <div>

              <h2>
                Average Yield by Crop
              </h2>

              <p>
                Average predicted yield across crops
              </p>

            </div>


            <div className="analytics-chart-icon">

              <BarChart3 size={19} />

            </div>

          </div>


          {yieldData.length === 0 ? (

            <div className="analytics-no-data">

              No yield data available.

            </div>

          ) : (

            <div className="analytics-chart">

              <ResponsiveContainer
                width="100%"
                height={340}
              >

                <BarChart
                  data={yieldData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 55,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5ebe7"
                  />

                  <XAxis
                    dataKey="crop"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={75}
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "#6b7280",
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      Number(value).toFixed(2),
                      "Average Yield",
                    ]}
                  />

                  <Legend />

                  <Bar
                    dataKey="yield"
                    name="Average Yield"
                    fill="#5ca879"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>

      </div>


      {/* ===================================================
          PREDICTIONS BY LOCATION
      =================================================== */}

      {locationData.length > 0 && (

        <div className="analytics-chart-card analytics-full-width">

          <div className="analytics-chart-header">

            <div>

              <h2>
                Predictions by Location
              </h2>

              <p>
                Prediction activity by state or location
              </p>

            </div>


            <div className="analytics-chart-icon">

              <MapPin size={19} />

            </div>

          </div>


          <div className="analytics-chart">

            <ResponsiveContainer
              width="100%"
              height={340}
            >

              <BarChart
                data={locationData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 0,
                  bottom: 55,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5ebe7"
                />

                <XAxis
                  dataKey="location"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={75}
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="predictions"
                  name="Predictions"
                  fill="#2563eb"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      )}


    </div>

  );

};


export default Analytics;