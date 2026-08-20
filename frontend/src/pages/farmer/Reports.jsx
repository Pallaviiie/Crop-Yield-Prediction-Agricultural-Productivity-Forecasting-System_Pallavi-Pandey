import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../../styles/farmer/Reports.css";


const API_URL = "http://127.0.0.1:8000";


const Reports = () => {

  const [activeTab, setActiveTab] = useState(
    "productivity"
  );

  const [productivity, setProductivity] = useState(null);

  const [seasonal, setSeasonal] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ========================================================
  // LOAD REPORTS
  // ========================================================

  useEffect(() => {

    const loadReports = async () => {

      try {

        setLoading(true);

        const [
          productivityResponse,
          seasonalResponse
        ] = await Promise.all([

          fetch(
            `${API_URL}/reports/productivity`
          ),

          fetch(
            `${API_URL}/reports/seasonal`
          )

        ]);


        if (!productivityResponse.ok) {
          throw new Error(
            "Unable to load productivity report"
          );
        }


        const productivityData =
          await productivityResponse.json();


        const seasonalData =
          seasonalResponse.ok
            ? await seasonalResponse.json()
            : null;


        setProductivity(
          productivityData
        );

        setSeasonal(
          seasonalData
        );

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load reports. Please make sure the backend is running."
        );

      } finally {

        setLoading(false);

      }

    };


    loadReports();

  }, []);


  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {

    return (
      <div className="reports-page">

        <div className="reports-loading">
          Loading agricultural reports...
        </div>

      </div>
    );

  }


  // ========================================================
  // ERROR
  // ========================================================

  if (error) {

    return (
      <div className="reports-page">

        <div className="reports-error">
          {error}
        </div>

      </div>
    );

  }


  return (

    <div className="reports-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="reports-header">

        <div>

          <h1>
            Agricultural Reports
          </h1>

          <p>
            Analyze crop productivity and seasonal
            performance using YieldSense AI predictions.
          </p>

        </div>

      </div>


      {/* ====================================================
          TABS
      ==================================================== */}

      <div className="report-tabs">

        <button
          className={
            activeTab === "productivity"
              ? "report-tab active"
              : "report-tab"
          }
          onClick={() =>
            setActiveTab("productivity")
          }
        >
          Productivity Report
        </button>


        <button
          className={
            activeTab === "seasonal"
              ? "report-tab active"
              : "report-tab"
          }
          onClick={() =>
            setActiveTab("seasonal")
          }
        >
          Seasonal Report
        </button>

      </div>


      {/* ====================================================
          PRODUCTIVITY REPORT
      ==================================================== */}

      {activeTab === "productivity" && productivity && (

        <>

          <div className="report-summary-grid">

            <div className="report-stat-card">

              <span>
                Total Predictions
              </span>

              <strong>
                {
                  productivity.summary
                    .total_predictions
                }
              </strong>

            </div>


            <div className="report-stat-card">

              <span>
                Average Yield
              </span>

              <strong>
                {
                  productivity.summary
                    .average_yield
                }
                <small> hg/ha</small>
              </strong>

            </div>


            <div className="report-stat-card">

              <span>
                Highest Yield
              </span>

              <strong>
                {
                  productivity.summary
                    .highest_yield
                }
                <small> hg/ha</small>
              </strong>

            </div>


            <div className="report-stat-card">

              <span>
                Best Crop
              </span>

              <strong className="text-value">

                {
                  productivity.summary
                    .best_crop || "—"
                }

              </strong>

            </div>

          </div>


          {/* =================================================
              YEARLY PRODUCTIVITY
          ================================================= */}

          <div className="report-card">

            <h2>
              Yearly Productivity
            </h2>

            <p>
              Average predicted yield by year.
            </p>

            <div className="report-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={
                    productivity.yearly_productivity
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#d9f1df"
                  />

                  <XAxis
                    dataKey="year"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="average_yield"
                    fill="#0a9b55"
                    radius={[
                      6,
                      6,
                      0,
                      0
                    ]}
                    name="Average Yield"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* =================================================
              CROP PRODUCTIVITY
          ================================================= */}

          <div className="report-card">

            <h2>
              Crop Productivity
            </h2>

            <p>
              Average predicted yield for each crop.
            </p>


            <div className="report-table">

              <div className="table-header">

                <span>Crop</span>

                <span>
                  Average Yield
                </span>

                <span>
                  Predictions
                </span>

              </div>


              {productivity.crop_productivity.map(
                (crop) => (

                  <div
                    className="table-row"
                    key={crop.crop}
                  >

                    <span>
                      {crop.crop}
                    </span>

                    <span>
                      {crop.average_yield}
                      {" "}hg/ha
                    </span>

                    <span>
                      {crop.predictions}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </>

      )}


      {/* ====================================================
          SEASONAL REPORT
      ==================================================== */}

      {activeTab === "seasonal" && (

        <div className="seasonal-section">

          {!seasonal ||
          !seasonal.seasons ||
          seasonal.seasons.length === 0 ? (

            <div className="empty-report">

              <h2>
                No Seasonal Data Yet
              </h2>

              <p>
                Add a crop season such as Kharif,
                Rabi or Zaid when creating predictions
                to generate seasonal reports.
              </p>

            </div>

          ) : (

            <>

              <div className="report-card">

                <h2>
                  Seasonal Productivity
                </h2>

                <p>
                  Compare predicted crop yield
                  across agricultural seasons.
                </p>


                <div className="report-chart">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={seasonal.seasons}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#d9f1df"
                      />

                      <XAxis
                        dataKey="season"
                      />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="average_yield"
                        fill="#65b51c"
                        radius={[
                          6,
                          6,
                          0,
                          0
                        ]}
                        name="Average Yield"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>


              <div className="best-season-card">

                <span>
                  Best Performing Season
                </span>

                <strong>
                  {seasonal.best_season}
                </strong>

              </div>

            </>

          )}

        </div>

      )}

    </div>

  );

};


export default Reports;