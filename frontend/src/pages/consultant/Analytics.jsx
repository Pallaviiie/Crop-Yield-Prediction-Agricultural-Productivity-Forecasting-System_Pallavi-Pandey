import React, {
  useEffect,
  useState,
} from "react";

import {
  BarChart3,
  TrendingUp,
  Loader2,
} from "lucide-react";

import ConsultantLayout from
  "../../components/consultant/ConsultantLayout";

import {
  getConsultantAnalytics,
} from "../../services/api";


export default function Analytics() {

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        setLoading(true);

        const data =
          await getConsultantAnalytics();

        setAnalytics(data);

      } catch (error) {

        console.error(
          "CONSULTANT ANALYTICS ERROR:",
          error
        );

        setError(
          error.message ||
          "Unable to load analytics."
        );

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, []);


  const cropDistribution =
    analytics?.crop_distribution || [];

  const yieldTrends =
    analytics?.yield_trends || [];


  const totalCropCount =
    cropDistribution.reduce(
      (total, item) =>
        total + item.count,
      0
    );


  const maxYield =
    Math.max(
      ...yieldTrends.map(
        (item) =>
          item.average_yield
      ),
      1
    );


  return (

    <ConsultantLayout
      title="Analytics"
    >

      {loading ? (

        <div className="ys-empty-card">

          <Loader2
            size={32}
            className="ys-loading-icon"
          />

          <p>
            Loading analytics...
          </p>

        </div>

      ) : error ? (

        <div className="ys-empty-card">

          <p>
            {error}
          </p>

        </div>

      ) : (

        <div
          className="ys-analytics-grid"
        >


          {/* CROP DISTRIBUTION */}

          <div
            className="ys-card ys-analytics-card"
          >

            <h3
              className="ys-card-title"
            >

              Crop Distribution Among Farmers

            </h3>


            {cropDistribution.length === 0 ? (

              <div
                className="ys-no-data"
              >

                <BarChart3 size={32} />

                <p>

                  No farmer crop data
                  available yet.

                </p>

              </div>

            ) : (

              <div
                className="ys-analytics-bars"
              >

                {cropDistribution.map(
                  (item) => {

                    const percentage =
                      totalCropCount > 0
                        ? (
                            item.count /
                            totalCropCount
                          ) * 100
                        : 0;

                    return (

                      <div
                        className="ys-analytics-bar-row"
                        key={item.crop}
                      >

                        <div
                          className="ys-analytics-bar-head"
                        >

                          <span>

                            {item.crop}

                          </span>

                          <strong>

                            {
                              Math.round(
                                percentage
                              )
                            }
                            %

                          </strong>

                        </div>


                        <div
                          className="ys-progress-track"
                        >

                          <div
                            className="ys-progress-fill"
                            style={{
                              width:
                                `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* YIELD TREND */}

          <div
            className="ys-card ys-analytics-card"
          >

            <h3
              className="ys-card-title"
            >

              Yield Trends — Managed Farms

            </h3>


            {yieldTrends.length === 0 ? (

              <div
                className="ys-no-data"
              >

                <TrendingUp size={32} />

                <p>

                  No prediction data
                  available for managed
                  farmers.

                </p>

              </div>

            ) : (

              <div
                className="ys-yield-trends"
              >

                {yieldTrends.map(
                  (item) => (

                    <div
                      className="ys-yield-column"
                      key={item.year}
                    >

                      <div
                        className="ys-yield-value"
                      >

                        {
                          item.average_yield
                        }

                      </div>


                      <div
                        className="ys-yield-bar-track"
                      >

                        <div
                          className="ys-yield-bar"
                          style={{
                            height:
                              `${(
                                item.average_yield /
                                maxYield
                              ) * 100}%`,
                          }}
                        />

                      </div>


                      <span>

                        {item.year}

                      </span>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </ConsultantLayout>

  );

}