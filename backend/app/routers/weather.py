from fastapi import APIRouter, HTTPException, Query
import httpx
import time


router = APIRouter(
    prefix="/weather",
    tags=["Weather"],
)


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# Cache weather responses for 10 minutes
CACHE_TTL = 10 * 60

# In-memory cache:
# {
#     (latitude, longitude): {
#         "timestamp": ...,
#         "data": ...
#     }
# }
weather_cache = {}


def generate_weather_alerts(daily):
    alerts = []

    dates = daily.get("time", [])
    rainfall = daily.get("precipitation_sum", [])
    probability = daily.get(
        "precipitation_probability_max",
        [],
    )
    temperatures = daily.get(
        "temperature_2m_max",
        [],
    )

    # -----------------------------
    # Rain alert
    # -----------------------------
    for i in range(len(dates)):
        rain = rainfall[i] or 0
        rain_prob = probability[i] or 0

        if rain_prob >= 70 or rain >= 20:
            alerts.append(
                {
                    "type": "rain",
                    "title": "Rain Alert",
                    "severity": "warning",
                    "message": (
                        f"Rain probability is {rain_prob}% "
                        f"with expected rainfall of "
                        f"{round(rain, 1)} mm on {dates[i]}."
                    ),
                }
            )
            break

    # -----------------------------
    # High temperature alert
    # -----------------------------
    for i in range(len(dates)):
        temperature = temperatures[i]

        if temperature is not None and temperature >= 36:
            alerts.append(
                {
                    "type": "temperature",
                    "title": "Temperature Watch",
                    "severity": "warning",
                    "message": (
                        f"Temperature may reach "
                        f"{round(temperature)}°C on "
                        f"{dates[i]}. Consider additional irrigation."
                    ),
                }
            )
            break

    # -----------------------------
    # Favorable conditions
    # -----------------------------
    if not alerts:
        alerts.append(
            {
                "type": "favorable",
                "title": "Favorable Conditions",
                "severity": "good",
                "message": (
                    "Weather conditions look generally "
                    "favorable for crop management."
                ),
            }
        )

    return alerts


@router.get("/forecast")
async def get_weather_forecast(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    """
    Returns current weather + 7-day forecast.

    Weather responses are cached for 10 minutes to prevent
    unnecessary requests to Open-Meteo and reduce 429 errors.
    """

    # --------------------------------------------------
    # Round coordinates
    # --------------------------------------------------
    # GPS can return tiny differences such as:
    #
    # 28.613939
    # 28.613940
    #
    # These are effectively the same location.
    #
    # Rounding prevents every tiny GPS difference from
    # creating a new cache entry.
    # --------------------------------------------------

    latitude = round(latitude, 2)
    longitude = round(longitude, 2)

    cache_key = (latitude, longitude)

    # --------------------------------------------------
    # Check cache
    # --------------------------------------------------

    cached = weather_cache.get(cache_key)

    if cached:
        cache_age = time.time() - cached["timestamp"]

        if cache_age < CACHE_TTL:
            return cached["data"]

        # Remove expired cache
        weather_cache.pop(cache_key, None)

    # --------------------------------------------------
    # Open-Meteo request parameters
    # --------------------------------------------------

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "current": ",".join(
            [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "precipitation",
                "rain",
                "weather_code",
                "wind_speed_10m",
            ]
        ),

        "hourly": ",".join(
            [
                "temperature_2m",
                "relative_humidity_2m",
                "precipitation_probability",
                "precipitation",
                "rain",
                "weather_code",
                "wind_speed_10m",
            ]
        ),

        "daily": ",".join(
            [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "rain_sum",
                "precipitation_probability_max",
                "wind_speed_10m_max",
            ]
        ),

        "forecast_days": 7,
        "timezone": "auto",
    }

    # --------------------------------------------------
    # Call Open-Meteo
    # --------------------------------------------------

    try:
        async with httpx.AsyncClient(
            timeout=15
        ) as client:

            response = await client.get(
                OPEN_METEO_URL,
                params=params,
            )

        # --------------------------------------------------
        # Explicit Open-Meteo rate-limit handling
        # --------------------------------------------------

        if response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail=(
                    "Weather service is temporarily busy. "
                    "Please try again in a few minutes."
                ),
            )

        response.raise_for_status()

        data = response.json()

        # --------------------------------------------------
        # Extract data
        # --------------------------------------------------

        current = data.get("current", {})
        daily = data.get("daily", {})
        hourly = data.get("hourly", {})

        daily_times = daily.get("time", [])

        # --------------------------------------------------
        # Build forecast safely
        # --------------------------------------------------

        forecast = []

        for i in range(len(daily_times)):
            forecast.append(
                {
                    "date": daily_times[i],

                    "weather_code": (
                        daily.get("weather_code", [None])[i]
                    ),

                    "temperature_max": (
                        daily.get(
                            "temperature_2m_max",
                            [None],
                        )[i]
                    ),

                    "temperature_min": (
                        daily.get(
                            "temperature_2m_min",
                            [None],
                        )[i]
                    ),

                    "rainfall": (
                        daily.get(
                            "precipitation_sum",
                            [None],
                        )[i]
                    ),

                    "rain": (
                        daily.get(
                            "rain_sum",
                            [None],
                        )[i]
                    ),

                    "rain_probability": (
                        daily.get(
                            "precipitation_probability_max",
                            [None],
                        )[i]
                    ),

                    "wind_speed": (
                        daily.get(
                            "wind_speed_10m_max",
                            [None],
                        )[i]
                    ),
                }
            )

        # --------------------------------------------------
        # Final response
        # --------------------------------------------------

        result = {
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "timezone": data.get("timezone"),
            },

            "current": {
                "temperature": current.get(
                    "temperature_2m"
                ),

                "humidity": current.get(
                    "relative_humidity_2m"
                ),

                "feels_like": current.get(
                    "apparent_temperature"
                ),

                "wind_speed": current.get(
                    "wind_speed_10m"
                ),

                "rainfall": current.get(
                    "precipitation"
                ),

                "rain": current.get(
                    "rain"
                ),

                "weather_code": current.get(
                    "weather_code"
                ),

                "time": current.get(
                    "time"
                ),
            },

            "forecast": forecast,

            "hourly": {
                "time": hourly.get(
                    "time",
                    [],
                ),

                "rainfall": hourly.get(
                    "precipitation",
                    [],
                ),

                "rain_probability": hourly.get(
                    "precipitation_probability",
                    [],
                ),

                "temperature": hourly.get(
                    "temperature_2m",
                    [],
                ),

                "wind_speed": hourly.get(
                    "wind_speed_10m",
                    [],
                ),
            },

            "alerts": generate_weather_alerts(
                daily
            ),
        }

        # --------------------------------------------------
        # Save response in cache
        # --------------------------------------------------

        weather_cache[cache_key] = {
            "timestamp": time.time(),
            "data": result,
        }

        return result

    # ------------------------------------------------------
    # HTTP errors
    # ------------------------------------------------------

    except HTTPException:
        raise

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail=(
                "Weather service took too long to respond. "
                "Please try again shortly."
            ),
        )

    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Weather API returned an error: "
                f"{error.response.status_code}"
            ),
        )

    except httpx.HTTPError as error:
        raise HTTPException(
            status_code=502,
            detail=(
                f"Unable to connect to weather service: "
                f"{str(error)}"
            ),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to load weather: "
                f"{str(error)}"
            ),
        )