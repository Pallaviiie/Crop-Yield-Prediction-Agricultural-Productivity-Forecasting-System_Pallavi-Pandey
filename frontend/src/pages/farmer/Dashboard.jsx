import { useEffect, useState } from "react";

import {
  TrendingUp,
  Wheat,
  MapPin,
  Gauge,
  Cloud,
  Droplets,
  Wind,
  CloudRain,
  Zap,
  Loader2,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import {
  getDatasetSummary,
  getCropAnalytics,
  getSoilAnalytics,
  getRainfallAnalytics,
  getTemperatureAnalytics,
  getPesticideAnalytics,
  getPredictionHistory,
} from "../../services/api";

import "../../styles/farmer/Dashboard.css";


const Dashboard = ({ setActivePage }) => {

  // ============================================================
  // STATE
  // ============================================================

  const [summary, setSummary] = useState(null);

  const [cropAnalytics, setCropAnalytics] = useState(null);

  const [soilAnalytics, setSoilAnalytics] = useState(null);

  const [rainfallAnalytics, setRainfallAnalytics] =
    useState(null);

  const [temperatureAnalytics, setTemperatureAnalytics] =
    useState(null);

  const [pesticideAnalytics, setPesticideAnalytics] =
    useState(null);

  const [predictionHistory, setPredictionHistory] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          summaryData,
          cropData,
          soilData,
          rainfallData,
          temperatureData,
          pesticideData,
          historyData,
        ] = await Promise.all([

          getDatasetSummary(),

          getCropAnalytics(),

          getSoilAnalytics(),

          getRainfallAnalytics(),

          getTemperatureAnalytics(),

          getPesticideAnalytics(),

          getPredictionHistory(),

        ]);


        setSummary(summaryData || null);

        setCropAnalytics(cropData || null);

        setSoilAnalytics(soilData || null);

        setRainfallAnalytics(rainfallData || null);

        setTemperatureAnalytics(
          temperatureData || null
        );

        setPesticideAnalytics(
          pesticideData || null
        );


        // --------------------------------------------------------
        // SORT COMPLETE PREDICTION HISTORY
        // --------------------------------------------------------

        const sortedHistory = Array.isArray(historyData)

          ? [...historyData].sort(
              (a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
            )

          : [];


        setPredictionHistory(sortedHistory);

      }

      catch (err) {

        console.error(
          "Dashboard data error:",
          err
        );

        setError(
          err?.message ||
          "Unable to load dashboard data."
        );

      }

      finally {

        setLoading(false);

      }

    };


    loadDashboardData();

  }, []);


  // ============================================================
  // LATEST PREDICTION
  // ============================================================

  const latestPrediction =
    predictionHistory.length > 0
      ? predictionHistory[0]
      : null;


  // ============================================================
  // RECENT PREDICTIONS
  // ============================================================

  const recentPredictions =
    predictionHistory.slice(0, 5);


  // ============================================================
  // SOIL ANALYTICS
  // ============================================================

  const averageSoilMoisture =
    Number(
      soilAnalytics?.average_moisture ?? 0
    );

  const averageHumidity =
    Number(
      soilAnalytics?.average_humidity ?? 0
    );


  const soilTypes =
    Array.isArray(
      soilAnalytics?.soil_types
    )
      ? soilAnalytics.soil_types
      : [];


  const topSoilType =
    soilTypes.length > 0
      ? soilTypes[0]?.soil_type || "Unknown"
      : "Unknown";


  // ============================================================
  // CLIMATE ANALYTICS
  // ============================================================

  const averageRainfall =
    Number(
      rainfallAnalytics
        ?.average_annual_rainfall ?? 0
    );


  const averageTemperature =
    Number(
      temperatureAnalytics
        ?.average_temperature ?? 0
    );


  // ============================================================
  // CROP ANALYTICS
  // ============================================================

  const totalCrops =
    Number(
      cropAnalytics?.total_crops ?? 0
    );


  const totalAreas =
    Number(
      cropAnalytics?.total_areas ?? 0
    );


  const topCrop =
    cropAnalytics?.crop_yield?.length > 0

      ? cropAnalytics.crop_yield[0]?.Item

      : "—";


  // ============================================================
  // PREDICTION GRAPH DATA
  // ============================================================

  const predictionYieldData =
    [...predictionHistory]
      .reverse()
      .map((prediction, index) => ({

        index: index + 1,

        year:
          prediction.year ??
          "—",

        crop:
          prediction.crop ??
          "Unknown",

        area:
          prediction.area ??
          "Unknown",

        yield:
          Number(
            prediction.predicted_yield
          ) || 0,

        createdAt:
          prediction.created_at
            ? new Date(
                prediction.created_at
              ).toLocaleDateString()
            : "—",

      }));


  // ============================================================
  // HIGH / LOW
  // ============================================================

  const yieldValues =
    predictionYieldData.map(
      item => item.yield
    );


  const highestYield =
    yieldValues.length > 0
      ? Math.max(...yieldValues)
      : 0;

  const averageYield =
    yieldValues.length > 0
      ? yieldValues.reduce(
        (sum, value) => sum + value,
        0
      ) / yieldValues.length
      : 0;

  const lowestYield =
    yieldValues.length > 0
      ? Math.min(...yieldValues)
      : 0;


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="dashboard-loading">

        <Loader2
          className="spin"
          size={35}
        />

        <p>
          Loading your farm dashboard...
        </p>

      </div>

    );

  }


  // ============================================================
  // DASHBOARD
  // ============================================================

  return (

    <div className="farmer-dashboard-page">


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="dashboard-error">

          {error}

        </div>

      )}


      {/* ======================================================
          WELCOME
      ====================================================== */}

      <div className="dashboard-welcome">

        <div>

          <h1>
            Welcome back, Farmer!
          </h1>

          <p>

            {latestPrediction

              ? `${latestPrediction.area || "Your Farm"} · Latest prediction available`

              : "Start your first crop yield prediction"}

          </p>

        </div>


        <button
          className="new-prediction-btn"
          onClick={() =>
            setActivePage?.(
              "Yield Prediction"
            )
          }
        >

          + New Prediction

        </button>

      </div>


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="dashboard-stats-grid">


        {/* ----------------------------------------------------
            PREDICTED YIELD
        ---------------------------------------------------- */}

        <div className="dashboard-stat-card">

          <div className="stat-top-row">

            <div className="stat-icon green">

              <TrendingUp size={22} />

            </div>

          </div>


          <h2>

            {latestPrediction

              ? Number(
                  latestPrediction.predicted_yield
                ).toLocaleString()

              : "—"}

          </h2>


          <p>
            Latest Predicted Yield
          </p>


          <small>

            {latestPrediction
              ? "hg/ha"
              : "No prediction yet"}

          </small>

        </div>


        {/* ----------------------------------------------------
            CURRENT CROP
        ---------------------------------------------------- */}

        <div className="dashboard-stat-card">

          <div className="stat-top-row">

            <div className="stat-icon orange">

              <Wheat size={22} />

            </div>

          </div>


          <h2>

            {latestPrediction?.crop ||
              topCrop ||
              "—"}

          </h2>


          <p>
            Current Crop
          </p>


          <small>

            {latestPrediction
              ? "From latest prediction"
              : `${totalCrops} crops in dataset`}

          </small>

        </div>


        {/* ----------------------------------------------------
            AREA
        ---------------------------------------------------- */}

        <div className="dashboard-stat-card">

          <div className="stat-top-row">

            <div className="stat-icon blue">

              <MapPin size={22} />

            </div>

          </div>


          <h2>

            {latestPrediction?.area ||
              totalAreas ||
              "—"}

          </h2>


          <p>

            {latestPrediction
              ? "Farm Location"
              : "Agricultural Areas"}

          </p>


          <small>

            {latestPrediction
              ? "From latest prediction"
              : `${totalAreas} areas in dataset`}

          </small>

        </div>


        {/* ----------------------------------------------------
            SOIL
        ---------------------------------------------------- */}

        <div className="dashboard-stat-card">

          <div className="stat-top-row">

            <div className="stat-icon lime">

              <Gauge size={22} />

            </div>

          </div>


          <h2>
            {topSoilType}
          </h2>


          <p>
            Primary Soil Type
          </p>


          <small>

            Moisture:
            {" "}
            {averageSoilMoisture.toFixed(1)}
            %
            {" · "}
            Humidity:
            {" "}
            {averageHumidity.toFixed(1)}
            %

          </small>

        </div>


        {/* ----------------------------------------------------
            TEMPERATURE
        ---------------------------------------------------- */}

        <div className="dashboard-stat-card">

          <div className="stat-top-row">

            <div className="stat-icon weather">

              <Cloud size={22} />

            </div>

          </div>


          <h2>

            {averageTemperature.toFixed(1)}
            °C

          </h2>


          <p>
            Average Temperature
          </p>


          <small>

            Based on{" "}

            {Number(
              temperatureAnalytics
                ?.total_records ?? 0
            ).toLocaleString()}

            {" "}
            temperature records

          </small>

        </div>


      </div>


      {/* ======================================================
          PREDICTION HISTORY
      ====================================================== */}

      <div className="dashboard-panel yield-history-panel">


        <div className="prediction-history-heading">


          <div>

            <h3>
              Prediction History — Yield
            </h3>

            <p>
              Your crop yield predictions over time
            </p>

          </div>


          {predictionYieldData.length > 0 && (

            <div className="prediction-range">

              <span>

                High:
                {" "}

                <strong>

                  {highestYield.toLocaleString()}

                </strong>

              </span>

 <span>
    Average:
    {" "}
    <strong>
      {averageYield.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}
    </strong>
  </span>


              <span>

                Low:
                {" "}

                <strong>

                  {lowestYield.toLocaleString()}

                </strong>

              </span>

            </div>

          )}

        </div>


        {predictionYieldData.length === 0 ? (

          <div className="no-chart-data">

            No prediction history available yet.

            <br />

            <small>

              Create predictions to see your
              yield trend here.

            </small>

          </div>

        ) : (

          <div
            className="yield-chart"
            style={{
              width: "100%",
              height: 260,
            }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={predictionYieldData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#d9f1df"
                />


                <XAxis
                  dataKey="index"
                  tick={{
                    fontSize: 11,
                    fill: "#438367",
                  }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value:
                      "Prediction",
                    position:
                      "insideBottom",
                    offset: -5,
                    fontSize: 11,
                    fill: "#438367",
                  }}
                />


                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#438367",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
<ReferenceLine
  y={averageYield}
  stroke="#e49b16"
  strokeDasharray="6 4"
  strokeWidth={2}
  label={{
    value: `Average: ${averageYield.toFixed(2)} hg/ha`,
    position: "insideTopRight",
    fill: "#b87800",
    fontSize: 11,
    fontWeight: 600,
  }}
/>

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} hg/ha`,
                    "Predicted Yield",
                  ]}
                  labelFormatter={(label) => {

                    const item =
                      predictionYieldData[
                        Number(label) - 1
                      ];

                    return item
                      ? `${item.crop} · ${item.year}`
                      : `Prediction ${label}`;

                  }}
                />


                <Line
                  type="monotone"
                  dataKey="yield"
                  stroke="#17813d"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#17813d",
                    stroke: "#ffffff",
                    strokeWidth: 2,
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


      {/* ======================================================
          RIGHT SIDE INFORMATION
      ====================================================== */}

      <div className="dashboard-right-column">


        {/* ----------------------------------------------------
            CLIMATE
        ---------------------------------------------------- */}

        <div className="dashboard-panel today-weather-card">


          <div className="weather-card-header">

            <h3>
              Climate Analytics
            </h3>

            <Cloud size={16} />

          </div>


          <div className="today-weather-main">

            <div>

              <h1>

                {averageTemperature.toFixed(1)}
                °C

              </h1>

              <p>
                Dataset average temperature
              </p>

            </div>

          </div>


          <div className="weather-details">


            <div>

              <Droplets size={17} />

              <strong>

                {averageHumidity.toFixed(1)}
                %

              </strong>

              <span>
                Humidity
              </span>

            </div>


            <div>

              <CloudRain size={17} />

              <strong>

                {averageRainfall.toFixed(0)}
                {" "}
                mm

              </strong>

              <span>
                Annual Rainfall
              </span>

            </div>


            <div>

              <Wind size={17} />

              <strong>

                {averageSoilMoisture.toFixed(1)}
                %

              </strong>

              <span>
                Soil Moisture
              </span>

            </div>


          </div>

        </div>


        {/* ----------------------------------------------------
            AI INSIGHT
        ---------------------------------------------------- */}

        <div className="dashboard-panel ai-tip-card">


          <h3>
            AI Insight
          </h3>


          <div className="ai-tip-content">


            <div className="ai-tip-icon">

              <Zap size={19} />

            </div>


            <p>

              {latestPrediction?.recommendation ||

                "Generate a crop yield prediction to receive personalized AI farming recommendations."}

            </p>


          </div>

        </div>


        {/* ----------------------------------------------------
            PESTICIDE
        ---------------------------------------------------- */}

        <div className="dashboard-panel pesticide-card">


          <h3>
            Pesticide Analytics
          </h3>


          <p>

            Dataset records:
            {" "}

            <strong>

              {Number(
                summary?.pesticide_records ?? 0
              ).toLocaleString()}

            </strong>

          </p>


          <small>

            Data analytics loaded from
            pesticides.csv

          </small>

        </div>


      </div>


      {/* ======================================================
          RECENT PREDICTIONS
      ====================================================== */}

      <div className="recent-predictions-section">


        <div className="recent-heading">

          <h2>
            Recent Predictions
          </h2>


          <button
            onClick={() =>
              setActivePage?.(
                "Prediction History"
              )
            }
          >

            View all →

          </button>

        </div>


        <div className="recent-table-card">


          <div className="recent-table">


            <div className="table-row table-header">

              <div>CROP</div>

              <div>AREA</div>

              <div>YEAR</div>

              <div>PREDICTED YIELD</div>

              <div>RAINFALL</div>

              <div>TEMPERATURE</div>

              <div>STATUS</div>

            </div>


            {recentPredictions.length === 0 ? (

              <div className="no-predictions">

                No predictions available yet.

                <br />

                <button
                  onClick={() =>
                    setActivePage?.(
                      "Yield Prediction"
                    )
                  }
                >

                  Create your first prediction

                </button>

              </div>

            ) : (

              recentPredictions.map(
                (prediction) => (

                  <div
                    className="table-row"
                    key={prediction.id}
                  >


                    <div>
                      {prediction.crop || "—"}
                    </div>


                    <div>
                      {prediction.area || "—"}
                    </div>


                    <div>
                      {prediction.year || "—"}
                    </div>


                    <div className="yield-value">

                      {Number(
                        prediction.predicted_yield || 0
                      ).toLocaleString()}

                      {" "}
                      hg/ha

                    </div>


                    <div>

                      {prediction.rainfall != null
                        ? `${prediction.rainfall} mm`
                        : "—"}

                    </div>


                    <div>

                      {prediction.temperature != null
                        ? `${prediction.temperature}°C`
                        : "—"}

                    </div>


                    <div>

                      <span className="status-badge completed">

                        Completed

                      </span>

                    </div>


                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>


    </div>

  );

};


export default Dashboard;