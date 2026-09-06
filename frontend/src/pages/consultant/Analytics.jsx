import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useEffect, useState } from "react";

import "../../styles/consultant/Analytics.css";


const Analytics = () => {

  // ==========================================================
  // STATE
  // ==========================================================

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================================
  // FETCH ANALYTICS DATA
  // ==========================================================

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/analytics/dashboard`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load analytics data"
          );
        }

        const data = await response.json();

        console.log(
          "Analytics API response:",
          data
        );

        setAnalyticsData(data);

      } catch (error) {

        console.error(
          "Analytics error:",
          error
        );

        setError(
          "Unable to load analytics data."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchAnalytics();

  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="analytics-page">

        <div className="analytics-loading">
          Loading analytics...
        </div>

      </div>
    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (
      <div className="analytics-page">

        <div className="analytics-error">
          {error}
        </div>

      </div>
    );

  }


  // ==========================================================
  // NO DATA
  // ==========================================================

  if (
    !analyticsData ||
    !analyticsData.summary ||
    Number(
      analyticsData.summary.total_predictions
    ) === 0
  ) {

    return (
      <div className="analytics-page">

        <div className="analytics-empty">

          <h2>
            No Analytics Data Available
          </h2>

          <p>
            Make a crop yield prediction first.
            Your analytics will appear here
            automatically.
          </p>

        </div>

      </div>
    );

  }


  // ==========================================================
  // DATA
  // ==========================================================

  const summary =
    analyticsData.summary;

  const historicalYield =
    analyticsData.historical_yield || [];

  const rainfallYield =
    analyticsData.rainfall_yield || [];

  const temperatureYield =
    analyticsData.temperature_yield || [];

  const cropComparison =
    analyticsData.crop_comparison || [];


  // ==========================================================
  // CONVERT hg/ha → T/ha
  // ==========================================================

  const convertYield = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return 0;
    }

    return number / 10000;
  };


  // ==========================================================
  // FORMAT NUMBER
  // ==========================================================

  const formatNumber = (
    value,
    decimals = 2
  ) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0.00";
    }

    return number.toFixed(decimals);
  };


  // ==========================================================
  // FORMAT SUMMARY YIELD
  // ==========================================================

  const averageYield =
    convertYield(
      summary.average_yield
    );

  const highestYield =
    convertYield(
      summary.highest_yield
    );


  // ==========================================================
  // HISTORICAL DATA
  // ==========================================================

  const historicalChartData =
    historicalYield.map((item) => {

      const converted = {
        year: item.year,
      };

      Object.keys(item).forEach(
        (key) => {

          if (key !== "year") {

            converted[key] =
              convertYield(item[key]);

          }

        }
      );

      return converted;

    });


  // ==========================================================
  // RAINFALL DATA
  // ==========================================================

  const rainfallChartData =
    rainfallYield.map((item) => ({

      year: item.year,

      rainfall:
        Number(item.rainfall) || 0,

      yield:
        convertYield(item.yield),

    }));


  // ==========================================================
  // TEMPERATURE DATA
  // ==========================================================

  const temperatureChartData =
    temperatureYield.map((item) => ({

      temperature:
        Number(item.temperature) || 0,

      yield:
        convertYield(item.yield),

    }));


  // ==========================================================
  // CROP COMPARISON
  // ==========================================================

  const cropChartData =
    cropComparison.map((item) => ({

      crop:
        item.crop || "Unknown",

      yield:
        convertYield(item.yield),

    }));


  // ==========================================================
  // GET AVAILABLE CROPS
  // ==========================================================

  const cropKeys = new Set();

  historicalChartData.forEach(
    (item) => {

      Object.keys(item).forEach(
        (key) => {

          if (key !== "year") {
            cropKeys.add(key);
          }

        }
      );

    }
  );

  const crops =
    Array.from(cropKeys);


  // ==========================================================
  // CHART TOOLTIP FORMATTERS
  // ==========================================================

  const yieldTooltipFormatter = (
    value
  ) => {

    return [
      `${formatNumber(value)} T/ha`,
      "Yield",
    ];

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="analytics-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="analytics-header">

        <div className="analytics-header-text">

          <h1 className="analytics-title">
            Analytics Overview
          </h1>

          <p className="analytics-subtitle">
            Understand your crop yield performance
            and environmental trends.
          </p>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="analytics-summary-grid">


        {/* TOTAL */}

        <div className="summary-card">

          <span>
            Total Predictions
          </span>

          <h2>
            {summary.total_predictions}
          </h2>

          <small>
            Predictions made
          </small>

        </div>


        {/* AVERAGE */}

        <div className="summary-card">

          <span>
            Average Yield
          </span>

          <h2>
            {formatNumber(
              averageYield
            )}
          </h2>

          <small>
            T/ha
          </small>

        </div>


        {/* HIGHEST */}

        <div className="summary-card">

          <span>
            Highest Yield
          </span>

          <h2>
            {formatNumber(
              highestYield
            )}
          </h2>

          <small>
            T/ha
          </small>

        </div>


        {/* LATEST CROP */}

        <div className="summary-card">

          <span>
            Latest Crop
          </span>

          <h2 className="latest-crop">

            {summary.latest_prediction?.crop ||
              "-"}

          </h2>

          <small>

            {summary.latest_prediction?.year ||
              ""}

          </small>

        </div>

      </div>


      {/* =====================================================
          ANALYTICS GRID
      ===================================================== */}

      <div className="analytics-grid">


        {/* ===================================================
            HISTORICAL CROP YIELD
        =================================================== */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Historical Crop Yield
              </h2>

              <p>
                Yield trend over the years
              </p>

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  historicalChartData
                }
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    `${value}`
                  }
                />

                <Tooltip
                  formatter={
                    yieldTooltipFormatter
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingTop: "8px",
                  }}
                />

                {crops.map(
                  (crop, index) => (

                    <Line
                      key={crop}
                      type="monotone"
                      dataKey={crop}
                      stroke={[
                        "#0b7a46",
                        "#d97706",
                        "#2563eb",
                        "#9333ea",
                        "#dc2626",
                      ][
                        index % 5
                      ]}
                      strokeWidth={2.5}
                      dot={false}
                      name={crop}
                    />

                  )
                )}

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ===================================================
            RAINFALL VS YIELD
        =================================================== */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Rainfall vs Yield
              </h2>

              <p>
                Relationship between rainfall
                and crop yield
              </p>

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  rainfallChartData
                }
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  yAxisId="rainfall"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  yAxisId="yield"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  formatter={(value, name) => {

                    if (
                      name ===
                      "Rainfall (mm)"
                    ) {

                      return [
                        `${formatNumber(
                          value,
                          0
                        )} mm`,
                        name,
                      ];

                    }

                    return [
                      `${formatNumber(
                        value
                      )} T/ha`,
                      name,
                    ];

                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingTop: "8px",
                  }}
                />

                <Line
                  yAxisId="rainfall"
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={false}
                  name="Rainfall (mm)"
                />

                <Line
                  yAxisId="yield"
                  type="monotone"
                  dataKey="yield"
                  stroke="#15803d"
                  strokeWidth={2.5}
                  dot={false}
                  name="Yield (T/ha)"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ===================================================
            TEMPERATURE VS YIELD
        =================================================== */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Temperature vs Yield
              </h2>

              <p>
                Temperature impact on yield
              </p>

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  temperatureChartData
                }
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="temperature"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    `${value}°`
                  }
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${formatNumber(
                      value
                    )} T/ha`,
                    "Yield",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="yield"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                  }}
                  name="Yield (T/ha)"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ===================================================
            CROP YIELD COMPARISON
        =================================================== */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <h2>
                Crop Yield Comparison
              </h2>

              <p>
                Average yield by crop
              </p>

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  cropChartData
                }
                margin={{
                  top: 10,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="crop"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                  }}
                  interval={0}
                  angle={
                    cropChartData.length > 5
                      ? -25
                      : 0
                  }
                  textAnchor={
                    cropChartData.length > 5
                      ? "end"
                      : "middle"
                  }
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${formatNumber(
                      value
                    )} T/ha`,
                    "Average Yield",
                  ]}
                />

                <Bar
                  dataKey="yield"
                  fill="#42a96d"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  name="Average Yield"
                  maxBarSize={45}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


      </div>

    </div>

  );

};


export default Analytics;