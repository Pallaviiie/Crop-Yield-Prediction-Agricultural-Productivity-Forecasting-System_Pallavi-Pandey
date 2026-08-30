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

import {
  Download,
  FileSpreadsheet,
  BarChart3,
  CalendarDays,
} from "lucide-react";

import * as XLSX from "xlsx";

import "../../styles/farmer/Reports.css";

const API_URL = "http://127.0.0.1:8000";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("productivity");

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
        setError("");

        const [
          productivityResponse,
          seasonalResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/reports/productivity`),
          fetch(`${API_URL}/reports/seasonal`),
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

        setProductivity(productivityData);
        setSeasonal(seasonalData);

      } catch (err) {
        console.error(
          "Reports loading error:",
          err
        );

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
  // EXCEL HELPERS
  // ========================================================

  const autoFitColumns = (worksheet) => {
    const range = XLSX.utils.decode_range(
      worksheet["!ref"] || "A1"
    );

    const columnWidths = [];

    for (
      let column = range.s.c;
      column <= range.e.c;
      column++
    ) {
      let maxLength = 10;

      for (
        let row = range.s.r;
        row <= range.e.r;
        row++
      ) {
        const cellAddress =
          XLSX.utils.encode_cell({
            r: row,
            c: column,
          });

        const cell =
          worksheet[cellAddress];

        if (!cell || cell.v === undefined) {
          continue;
        }

        const valueLength =
          String(cell.v).length;

        if (valueLength > maxLength) {
          maxLength = valueLength;
        }
      }

      columnWidths.push({
        wch: Math.min(
          maxLength + 3,
          40
        ),
      });
    }

    worksheet["!cols"] =
      columnWidths;
  };


  const styleHeaderRow = (
    worksheet,
    columnCount
  ) => {
    for (
      let column = 0;
      column < columnCount;
      column++
    ) {
      const cellAddress =
        XLSX.utils.encode_cell({
          r: 0,
          c: column,
        });

      if (!worksheet[cellAddress]) {
        continue;
      }

      worksheet[cellAddress].s = {
        font: {
          bold: true,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  };


  // ========================================================
  // EXPORT COMPLETE EXCEL WORKBOOK
  // ========================================================

  const exportExcelReport = () => {
    if (!productivity && !seasonal) {
      alert(
        "There is no report data available to export."
      );

      return;
    }

    try {
      // ======================================================
      // CREATE WORKBOOK
      // ======================================================

      const workbook =
        XLSX.utils.book_new();


      // ======================================================
      // SHEET 1 - SUMMARY
      // ======================================================

      const summaryRows = [
        [
          "Agricultural Productivity Report",
          "",
          "",
        ],

        [
          "Metric",
          "Value",
          "Unit",
        ],
      ];


      if (productivity?.summary) {

        summaryRows.push(
          [
            "Total Predictions",
            productivity.summary
              .total_predictions ?? "",
            "Predictions",
          ]
        );

        summaryRows.push(
          [
            "Average Yield",
            productivity.summary
              .average_yield ?? "",
            "hg/ha",
          ]
        );

        summaryRows.push(
          [
            "Highest Yield",
            productivity.summary
              .highest_yield ?? "",
            "hg/ha",
          ]
        );

        summaryRows.push(
          [
            "Best Crop",
            productivity.summary
              .best_crop ?? "",
            "",
          ]
        );
      }


      if (seasonal?.best_season) {

        summaryRows.push(
          [
            "Best Performing Season",
            seasonal.best_season,
            "",
          ]
        );
      }


      const summarySheet =
        XLSX.utils.aoa_to_sheet(
          summaryRows
        );


      summarySheet["!merges"] = [
        {
          s: {
            r: 0,
            c: 0,
          },
          e: {
            r: 0,
            c: 2,
          },
        },
      ];


      autoFitColumns(
        summarySheet
      );

      styleHeaderRow(
        summarySheet,
        3
      );


      XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "Summary"
      );


      // ======================================================
      // SHEET 2 - YEARLY PRODUCTIVITY
      // ======================================================

      const yearlyRows = [
        [
          "Year",
          "Average Yield",
          "Unit",
        ],
      ];


      if (
        Array.isArray(
          productivity?.yearly_productivity
        )
      ) {

        productivity.yearly_productivity.forEach(
          (item) => {

            yearlyRows.push(
              [
                item.year ?? "",
                item.average_yield ?? "",
                "hg/ha",
              ]
            );

          }
        );
      }


      const yearlySheet =
        XLSX.utils.aoa_to_sheet(
          yearlyRows
        );


      autoFitColumns(
        yearlySheet
      );

      styleHeaderRow(
        yearlySheet,
        3
      );


      XLSX.utils.book_append_sheet(
        workbook,
        yearlySheet,
        "Yearly Productivity"
      );


      // ======================================================
      // SHEET 3 - CROP PRODUCTIVITY
      // ======================================================

      const cropRows = [
        [
          "Crop",
          "Average Yield",
          "Predictions",
          "Unit",
        ],
      ];


      if (
        Array.isArray(
          productivity?.crop_productivity
        )
      ) {

        productivity.crop_productivity.forEach(
          (item) => {

            cropRows.push(
              [
                item.crop ?? "",
                item.average_yield ?? "",
                item.predictions ?? "",
                "hg/ha",
              ]
            );

          }
        );
      }


      const cropSheet =
        XLSX.utils.aoa_to_sheet(
          cropRows
        );


      autoFitColumns(
        cropSheet
      );

      styleHeaderRow(
        cropSheet,
        4
      );


      XLSX.utils.book_append_sheet(
        workbook,
        cropSheet,
        "Crop Productivity"
      );


      // ======================================================
      // SHEET 4 - SEASONAL PRODUCTIVITY
      // ======================================================

      const seasonalRows = [
        [
          "Season",
          "Average Yield",
          "Unit",
          "Performance",
        ],
      ];


      if (
        Array.isArray(
          seasonal?.seasons
        )
      ) {

        seasonal.seasons.forEach(
          (item) => {

            const isBestSeason =
              item.season ===
              seasonal.best_season;

            seasonalRows.push(
              [
                item.season ?? "",
                item.average_yield ?? "",
                "hg/ha",
                isBestSeason
                  ? "Best Performing"
                  : "Other",
              ]
            );

          }
        );
      }


      const seasonalSheet =
        XLSX.utils.aoa_to_sheet(
          seasonalRows
        );


      autoFitColumns(
        seasonalSheet
      );

      styleHeaderRow(
        seasonalSheet,
        4
      );


      XLSX.utils.book_append_sheet(
        workbook,
        seasonalSheet,
        "Seasonal Productivity"
      );


      // ======================================================
      // SHEET 5 - REPORT INFORMATION
      // ======================================================

      const reportInfoRows = [
        [
          "Report Information",
          "",
        ],

        [
          "Report Name",
          "YieldSense AI Agricultural Intelligence Report",
        ],

        [
          "Generated On",
          new Date().toLocaleString(),
        ],

        [
          "Productivity Data",
          productivity
            ? "Available"
            : "Not Available",
        ],

        [
          "Seasonal Data",
          seasonal
            ? "Available"
            : "Not Available",
        ],

        [
          "Description",
          "Structured agricultural productivity and seasonal analysis generated from YieldSense AI prediction data.",
        ],
      ];


      const reportInfoSheet =
        XLSX.utils.aoa_to_sheet(
          reportInfoRows
        );


      reportInfoSheet["!merges"] = [
        {
          s: {
            r: 0,
            c: 0,
          },
          e: {
            r: 0,
            c: 1,
          },
        },
      ];


      autoFitColumns(
        reportInfoSheet
      );


      XLSX.utils.book_append_sheet(
        workbook,
        reportInfoSheet,
        "Report Info"
      );


      // ======================================================
      // FREEZE HEADER ROWS
      // ======================================================

      yearlySheet["!freeze"] = {
        xSplit: 0,
        ySplit: 1,
      };

      cropSheet["!freeze"] = {
        xSplit: 0,
        ySplit: 1,
      };

      seasonalSheet["!freeze"] = {
        xSplit: 0,
        ySplit: 1,
      };


      // ======================================================
      // DOWNLOAD EXCEL FILE
      // ======================================================

      const currentYear =
        new Date().getFullYear();

      XLSX.writeFile(
        workbook,
        `YieldSense-AI-Agricultural-Report-${currentYear}.xlsx`
      );

    } catch (err) {

      console.error(
        "Excel export error:",
        err
      );

      alert(
        "Unable to generate the Excel report."
      );
    }
  };


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


  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="reports-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="reports-header">

        <div className="reports-header-content">

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

          <BarChart3 size={16} />

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

          <CalendarDays size={16} />

          Seasonal Report

        </button>

      </div>


      {/* ====================================================
          PRODUCTIVITY REPORT
      ==================================================== */}

      {activeTab === "productivity" &&
        productivity && (

          <>

            {/* SUMMARY */}

            <div className="report-summary-grid">

              <div className="report-stat-card">

                <span>
                  Total Predictions
                </span>

                <strong>
                  {
                    productivity.summary
                      ?.total_predictions ?? 0
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
                      ?.average_yield ?? 0
                  }

                  <small>
                    {" "}hg/ha
                  </small>

                </strong>

              </div>


              <div className="report-stat-card">

                <span>
                  Highest Yield
                </span>

                <strong>

                  {
                    productivity.summary
                      ?.highest_yield ?? 0
                  }

                  <small>
                    {" "}hg/ha
                  </small>

                </strong>

              </div>


              <div className="report-stat-card">

                <span>
                  Best Crop
                </span>

                <strong className="text-value">

                  {
                    productivity.summary
                      ?.best_crop || "—"
                  }

                </strong>

              </div>

            </div>


            {/* =================================================
                YEARLY PRODUCTIVITY
            ================================================= */}

            <div className="report-card">

              <div className="report-card-header">

                <div>

                  <h2>
                    Yearly Productivity
                  </h2>

                  <p>
                    Average predicted yield by year.
                  </p>

                </div>
              </div>


              <div className="report-chart">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      productivity.yearly_productivity || []
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
                        0,
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

              <div className="report-card-header">

                <div>

                  <h2>
                    Crop Productivity
                  </h2>

                  <p>
                    Average predicted yield for each crop.
                  </p>

                </div>


                <button
                  className="export-report-button secondary"
                  onClick={
                    exportExcelReport
                  }
                  title="Download structured Excel workbook"
                >

                  <FileSpreadsheet size={16} />

                  Export Excel

                </button>

              </div>


              <div className="report-table">

                <div className="table-header">

                  <span>
                    Crop
                  </span>

                  <span>
                    Average Yield
                  </span>

                  <span>
                    Predictions
                  </span>

                </div>


                {Array.isArray(
                  productivity.crop_productivity
                ) &&
                  productivity.crop_productivity.map(
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
          !Array.isArray(
            seasonal.seasons
          ) ||
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

              {/* SEASONAL CHART */}

              <div className="report-card">

                <div className="report-card-header">

                  <div>

                    <h2>
                      Seasonal Productivity
                    </h2>

                    <p>
                      Compare predicted crop yield
                      across agricultural seasons.
                    </p>

                  </div>


                  

                </div>


                <div className="report-chart">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={
                        seasonal.seasons
                      }
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
                          0,
                        ]}
                        name="Average Yield"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>


              {/* BEST SEASON */}

              <div className="best-season-card">

                <span>
                  Best Performing Season
                </span>


                <strong>
                  {seasonal.best_season}
                </strong>


                <button
                  className="export-report-button seasonal-export"
                  onClick={
                    exportExcelReport
                  }
                  title="Download structured Excel workbook"
                >

                  <FileSpreadsheet size={16} />

                  Export Excel

                </button>

              </div>

            </>

          )}

        </div>

      )}

    </div>
  );
};

export default Reports;