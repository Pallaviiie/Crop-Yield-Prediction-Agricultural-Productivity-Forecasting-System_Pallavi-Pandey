import { useEffect, useMemo, useState } from "react";

import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Umbrella,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LocateFixed,
} from "lucide-react";

import { api } from "../../services/api";
import "../../styles/farmer/WeatherForecast.css";

// ============================================================
// WEATHER CODE → ICON
// ============================================================

const getWeatherIcon = (code, size = 32) => {
  if (code === 0) {
    return <Sun size={size} />;
  }

  if ([1, 2].includes(code)) {
    return <CloudSun size={size} />;
  }

  if (code === 3) {
    return <Cloud size={size} />;
  }

  if ([45, 48].includes(code)) {
    return <Cloud size={size} />;
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return <CloudRain size={size} />;
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return <CloudRain size={size} />;
  }

  if ([71, 73, 75, 77].includes(code)) {
    return <Snowflake size={size} />;
  }

  if ([80, 81, 82].includes(code)) {
    return <CloudRain size={size} />;
  }

  if ([95, 96, 99].includes(code)) {
    return <CloudLightning size={size} />;
  }

  return <Cloud size={size} />;
};

// ============================================================
// WEATHER CODE → DESCRIPTION
// ============================================================

const getWeatherDescription = (code) => {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";

  if ([45, 48].includes(code)) {
    return "Foggy";
  }

  if ([51, 53, 55].includes(code)) {
    return "Drizzle";
  }

  if ([56, 57].includes(code)) {
    return "Freezing drizzle";
  }

  if ([61, 63, 65].includes(code)) {
    return "Rain";
  }

  if ([66, 67].includes(code)) {
    return "Freezing rain";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Weather conditions";
};

// ============================================================
// FORMAT DAY
// ============================================================

const formatDay = (dateString, index) => {
  if (index === 0) {
    return "Today";
  }

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
  });
};

// ============================================================
// REVERSE GEOCODING
// ============================================================

const getLocationName = async (latitude, longitude) => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json` +
      `&lat=${encodeURIComponent(latitude)}` +
      `&lon=${encodeURIComponent(longitude)}` +
      `&zoom=18` +
      `&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to identify location");
    }

    const data = await response.json();

    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.city_district ||
      address.municipality ||
      address.village ||
      address.suburb;

    const state = address.state;

    if (city && state) {
      return `${city}, ${state}`;
    }

    if (city) {
      return city;
    }

    if (state) {
      return state;
    }

    return "Current Location";
  } catch (error) {
    console.warn("Reverse geocoding failed:", error);

    return "Current Location";
  }
};

// ============================================================
// GET BROWSER GPS LOCATION
// ============================================================

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser."
        )
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },

      (error) => {
        let message =
          "Unable to access your current location.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser.";
        }

        if (error.code === 2) {
          message =
            "Your location could not be determined.";
        }

        if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        reject(new Error(message));
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,

        // Do not use an old cached GPS location.
        maximumAge: 0,
      }
    );
  });
};

// ============================================================
// COMPONENT
// ============================================================

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    name: "Detecting location...",
  });

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // ==========================================================
  // LOAD WEATHER
  // ==========================================================

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");

      // Get actual browser GPS
      const position = await getCurrentPosition();

      const { latitude, longitude } = position;

      console.log("GPS latitude:", latitude);
      console.log("GPS longitude:", longitude);

      // Update coordinates immediately
      setLocation((previous) => ({
        ...previous,
        latitude,
        longitude,
        name: "Finding location...",
      }));

      // Get city/state name
      const locationName = await getLocationName(
        latitude,
        longitude
      );

      setLocation({
        latitude,
        longitude,
        name: locationName,
      });

      // ======================================================
      // CALL FASTAPI WEATHER API
      // ======================================================

      const data = await api.getWeatherForecast(
        latitude,
        longitude
      );

      console.log("REAL WEATHER RESPONSE:", data);

      setWeather(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Weather loading error:", err);

      setError(
        err?.message ||
          "Unable to load weather information."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadWeather();
  }, []);

  // ==========================================================
  // REFRESH LOCATION
  // ==========================================================

  const handleLocationRefresh = async () => {
    try {
      setLocationLoading(true);

      await loadWeather();
    } finally {
      setLocationLoading(false);
    }
  };

  // ==========================================================
  // CURRENT WEATHER
  // ==========================================================

  const current = weather?.current;

  // ==========================================================
  // 7 DAY FORECAST
  // ==========================================================

  const forecast = weather?.forecast || [];

  // ==========================================================
  // RAINFALL GRAPH DATA
  // ==========================================================

  const rainfallData = useMemo(() => {
    return forecast.map((item, index) => ({
      day: formatDay(item.date, index),
      rainfall: Number(item.rainfall || 0),
      probability: Number(
        item.rain_probability || 0
      ),
    }));
  }, [forecast]);

  const maxRainfall = useMemo(() => {
    const values = rainfallData.map(
      (item) => item.rainfall
    );

    return Math.max(...values, 1);
  }, [rainfallData]);

  // ==========================================================
  // WEATHER ALERTS
  // ==========================================================

  const alerts = weather?.alerts || [];

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="weather-loading">
        <Loader2
          size={38}
          className="weather-spinner"
        />

        <h3>
          Getting your real-time weather...
        </h3>

        <p>
          Please allow location access so YieldSense
          can show weather for your actual location.
        </p>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !weather) {
    return (
      <div className="weather-error">
        <AlertTriangle size={40} />

        <h3>
          Unable to load weather
        </h3>

        <p>{error}</p>

        <button
          className="location-button"
          onClick={handleLocationRefresh}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <Loader2
              size={16}
              className="weather-spinner"
            />
          ) : (
            <LocateFixed size={16} />
          )}

          Try My Location Again
        </button>
      </div>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="weather-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="weather-section-header">
        <div>
          <h2>
            Weather Forecast
          </h2>

          <p>
            Real-time weather for your current location
          </p>
        </div>

        <button
          className="refresh-weather-button"
          onClick={handleLocationRefresh}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <Loader2
              size={15}
              className="weather-spin"
            />
          ) : (
            <RefreshCw size={15} />
          )}

          Refresh Location
        </button>
      </div>

      {/* ====================================================
          CURRENT WEATHER
      ==================================================== */}

      {current && (
        <section className="current-weather-card">

          <div className="current-weather-top">

            <div>

              <div className="weather-location">
                <MapPin size={14} />

                <span>
                  {location.name}
                </span>
              </div>

              <div className="current-temperature">
                {current.temperature !== null &&
                current.temperature !== undefined
                  ? `${Math.round(
                      current.temperature
                    )}°C`
                  : "--"}
              </div>

              <div className="current-description">
                {getWeatherDescription(
                  current.weather_code
                )}
              </div>

            </div>

            <div className="current-weather-icon">
              {getWeatherIcon(
                current.weather_code,
                78
              )}
            </div>

          </div>

          {/* CURRENT STATS */}

          <div className="current-weather-stats">

            <div className="weather-stat">
              <Droplets size={17} />

              <span>
                Humidity
              </span>

              <strong>
                {current.humidity ?? "--"}%
              </strong>
            </div>

            <div className="weather-stat">
              <Wind size={17} />

              <span>
                Wind Speed
              </span>

              <strong>
                {current.wind_speed !== null &&
                current.wind_speed !== undefined
                  ? `${current.wind_speed} km/h`
                  : "--"}
              </strong>
            </div>

            <div className="weather-stat">
              <Umbrella size={17} />

              <span>
                Rainfall
              </span>

              <strong>
                {current.rainfall !== null &&
                current.rainfall !== undefined
                  ? `${current.rainfall} mm`
                  : "0 mm"}
              </strong>
            </div>

            <div className="weather-stat">
              <Thermometer size={17} />

              <span>
                Feels Like
              </span>

              <strong>
                {current.feels_like !== null &&
                current.feels_like !== undefined
                  ? `${Math.round(
                      current.feels_like
                    )}°C`
                  : "--"}
              </strong>
            </div>

          </div>
        </section>
      )}

      {/* ====================================================
          7 DAY FORECAST
      ==================================================== */}

      <section className="forecast-card">

        <div className="card-heading">

          <div>
            <h3>
              7-Day Forecast
            </h3>

            <p>
              Forecast based on your current GPS location
            </p>
          </div>

        </div>

        <div className="forecast-grid">

          {forecast.map((item, index) => (

            <div
              className="forecast-day"
              key={item.date}
            >

              <strong>
                {formatDay(
                  item.date,
                  index
                )}
              </strong>

              <div
                className={`forecast-icon ${
                  item.weather_code >= 95
                    ? "storm"
                    : item.weather_code >= 51
                    ? "rain"
                    : item.weather_code === 0
                    ? "sunny"
                    : "cloudy"
                }`}
              >
                {getWeatherIcon(
                  item.weather_code,
                  31
                )}
              </div>

              <div className="forecast-temperature">

                <span>
                  {item.temperature_max !== null &&
                  item.temperature_max !== undefined
                    ? `${Math.round(
                        item.temperature_max
                      )}°`
                    : "--"}
                </span>

                <small>
                  {item.temperature_min !== null &&
                  item.temperature_min !== undefined
                    ? `${Math.round(
                        item.temperature_min
                      )}°`
                    : "--"}
                </small>

              </div>

              <div className="forecast-rain">

                <Droplets size={11} />

                {item.rain_probability ?? 0}%

              </div>

            </div>
          ))}

        </div>
      </section>

      {/* ====================================================
          BOTTOM GRID
      ==================================================== */}

      <div className="weather-bottom-grid">

        {/* ==================================================
            RAINFALL GRAPH
        ================================================== */}

        <section className="rainfall-card">

          <div className="card-heading">

            <div>
              <h3>
                Rainfall Forecast
              </h3>

              <p>
                Expected rainfall for the next 7 days
              </p>
            </div>

            <Umbrella size={19} />

          </div>

          <div className="rainfall-chart">

            <div className="chart-y-axis">

              <span>
                {maxRainfall.toFixed(0)} mm
              </span>

              <span>
                {(maxRainfall * 0.75).toFixed(0)}
              </span>

              <span>
                {(maxRainfall * 0.5).toFixed(0)}
              </span>

              <span>
                {(maxRainfall * 0.25).toFixed(0)}
              </span>

              <span>
                0
              </span>

            </div>

            <div className="chart-bars">

              {rainfallData.map((item) => {

                const height =
                  maxRainfall > 0
                    ? Math.max(
                        3,
                        (item.rainfall /
                          maxRainfall) *
                          100
                      )
                    : 3;

                return (
                  <div
                    className="chart-column"
                    key={item.day}
                  >

                    <span className="bar-value">
                      {item.rainfall.toFixed(1)}
                    </span>

                    <div
                      className="rain-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span>
                      {item.day}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* ==================================================
            WEATHER ALERTS
        ================================================== */}

        <section className="alerts-card">

          <div className="card-heading">

            <div>
              <h3>
                Weather Alerts
              </h3>

              <p>
                Important conditions for crop management
              </p>
            </div>

            <AlertTriangle size={19} />

          </div>

          <div className="weather-alert-list">

            {alerts.length === 0 && (
              <div className="weather-alert good">

                <div className="alert-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>
                    No Weather Alerts
                  </strong>

                  <p>
                    No significant weather risks
                    detected for the forecast period.
                  </p>
                </div>

              </div>
            )}

            {alerts.map((alert, index) => {

              const alertClass =
                alert.severity === "good"
                  ? "good"
                  : alert.type === "rain"
                  ? "rain"
                  : "warning";

              return (
                <div
                  className={`weather-alert ${alertClass}`}
                  key={`${alert.type}-${index}`}
                >

                  <div className="alert-icon">

                    {alert.type === "rain" ? (
                      <CloudRain size={17} />
                    ) : alert.type ===
                      "temperature" ? (
                      <Thermometer size={17} />
                    ) : (
                      <CheckCircle2 size={17} />
                    )}

                  </div>

                  <div>

                    <strong>
                      {alert.title}
                    </strong>

                    <p>
                      {alert.message}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </div>

      {/* ====================================================
          LOCATION INFORMATION
      ==================================================== */}

      <div className="weather-source">

        <MapPin size={10} />

        <span>
          {location.name}

          {location.latitude !== null &&
            location.longitude !== null &&
            ` • ${location.latitude.toFixed(
              4
            )}, ${location.longitude.toFixed(4)}`
          }
        </span>

        {lastUpdated && (
          <span>
            {" • Updated "}
            {lastUpdated.toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </span>
        )}

      </div>

    </div>
  );
};

export default WeatherForecast;