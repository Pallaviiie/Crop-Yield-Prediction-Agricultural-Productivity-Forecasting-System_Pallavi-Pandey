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

import "../../styles/farmer/Analytics.css";


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
          "http://127.0.0.1:8000/analytics/dashboard"
        );

        if (!response.ok) {

          throw new Error(
            "Unable to load analytics data"
          );

        }

        const data = await response.json();

        setAnalyticsData(data);

      }

      catch (error) {

        console.error(
          "Analytics error:",
          error
        );

        setError(
          "Unable to load analytics data."
        );

      }

      finally {

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

      <div className="analytics-loading">

        Loading analytics...

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <div className="analytics-error">

        {error}

      </div>

    );

  }


  // ==========================================================
  // NO DATA
  // ==========================================================

  if (
    !analyticsData ||
    !analyticsData.summary ||
    analyticsData.summary.total_predictions === 0
  ) {

    return (

      <div className="analytics-empty">

        <h2>No Analytics Data Available</h2>

        <p>
          Make a crop yield prediction first.
          Your analytics will appear here automatically.
        </p>

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
  // GET AVAILABLE CROPS
  // ==========================================================

  const cropKeys = new Set();


  historicalYield.forEach((item) => {

    Object.keys(item).forEach((key) => {

      if (key !== "year") {

        cropKeys.add(key);

      }

    });

  });


  const crops =
    Array.from(cropKeys);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="analytics-page">


      {/* ====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="analytics-summary-grid">


        {/* TOTAL PREDICTIONS */}

        <div className="summary-card">

          <span>Total Predictions</span>

          <h2>
            {summary.total_predictions}
          </h2>

        </div>


        {/* AVERAGE YIELD */}

        <div className="summary-card">

          <span>Average Yield</span>

          <h2>
            {summary.average_yield}
          </h2>

          <small>
            hg/ha
          </small>

        </div>


        {/* HIGHEST YIELD */}

        <div className="summary-card">

          <span>Highest Yield</span>

          <h2>
            {summary.highest_yield}
          </h2>

          <small>
            hg/ha
          </small>

        </div>


        {/* LATEST CROP */}

        <div className="summary-card">

          <span>Latest Crop</span>

          <h2 className="latest-crop">

            {summary.latest_prediction?.crop || "-"}

          </h2>

          <small>

            {summary.latest_prediction?.year || ""}

          </small>

        </div>


      </div>


      {/* ====================================================
          ANALYTICS GRID
      ===================================================== */}

      <div className="analytics-grid">


        {/* ==================================================
            1. HISTORICAL CROP YIELD
        =================================================== */}

        <div className="analytics-card">

          <h2>
            Historical Crop Yield
          </h2>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={historicalYield}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                />


                <Tooltip />


                <Legend />


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
                        "#dc2626"
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


        {/* ==================================================
            2. RAINFALL VS YIELD
        =================================================== */}

        <div className="analytics-card">

          <h2>
            Rainfall vs Yield
          </h2>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={rainfallYield}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  yAxisId="rainfall"
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  yAxisId="yield"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                />


                <Tooltip />


                <Legend />


                <Line

                  yAxisId="rainfall"

                  type="monotone"

                  dataKey="rainfall"

                  stroke="#0ea5e9"

                  strokeWidth={2.5}

                  name="Rainfall (mm)"

                />


                <Line

                  yAxisId="yield"

                  type="monotone"

                  dataKey="yield"

                  stroke="#15803d"

                  strokeWidth={2.5}

                  name="Yield (hg/ha)"

                />


              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ==================================================
            3. TEMPERATURE VS YIELD
        =================================================== */}

        <div className="analytics-card">

          <h2>
            Temperature vs Yield
          </h2>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={temperatureYield}
              >

                <CartesianGrid
                  stroke="#d9f1df"
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="temperature"
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                />


                <Tooltip />


                <Line

                  type="monotone"

                  dataKey="yield"

                  stroke="#d97706"

                  strokeWidth={2.5}

                  dot={{
                    r: 4
                  }}

                  name="Yield (hg/ha)"

                />


              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ==================================================
            4. CROP YIELD COMPARISON
        =================================================== */}

        <div className="analytics-card">

          <h2>
            Crop Yield Comparison
          </h2>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={cropComparison}
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
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                />


                <Tooltip />


                <Bar

                  dataKey="yield"

                  fill="#42a96d"

                  radius={[6, 6, 0, 0]}

                  name="Average Yield"

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