from fastapi import APIRouter, HTTPException, Query
import httpx

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


@router.get("/forecast")
async def get_weather_forecast(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    """
    Returns real-time weather + 7 day forecast
    for the farmer's current location.
    """

    params = {
        "latitude": latitude,
        "longitude": longitude,

        # Current weather
        "current": ",".join([
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m",
        ]),

        # Hourly information used for rainfall graph/alerts
        "hourly": ",".join([
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation_probability",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m",
        ]),

        # 7-day forecast
        "daily": ",".join([
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "rain_sum",
            "precipitation_probability_max",
            "wind_speed_10m_max",
        ]),

        "forecast_days": 7,
        "timezone": "auto",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                OPEN_METEO_URL,
                params=params
            )

        response.raise_for_status()

        data = response.json()

        current = data.get("current", {})
        daily = data.get("daily", {})
        hourly = data.get("hourly", {})

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "timezone": data.get("timezone"),
            },

            "current": {
                "temperature": current.get("temperature_2m"),
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
                "rain": current.get("rain"),
                "weather_code": current.get(
                    "weather_code"
                ),
                "time": current.get("time"),
            },

            "forecast": [
                {
                    "date": daily["time"][i],
                    "weather_code": daily[
                        "weather_code"
                    ][i],
                    "temperature_max": daily[
                        "temperature_2m_max"
                    ][i],
                    "temperature_min": daily[
                        "temperature_2m_min"
                    ][i],
                    "rainfall": daily[
                        "precipitation_sum"
                    ][i],
                    "rain": daily[
                        "rain_sum"
                    ][i],
                    "rain_probability": daily[
                        "precipitation_probability_max"
                    ][i],
                    "wind_speed": daily[
                        "wind_speed_10m_max"
                    ][i],
                }
                for i in range(len(daily["time"]))
            ],

            "hourly": {
                "time": hourly.get("time", []),
                "rainfall": hourly.get(
                    "precipitation", []
                ),
                "rain_probability": hourly.get(
                    "precipitation_probability",
                    []
                ),
                "temperature": hourly.get(
                    "temperature_2m", []
                ),
                "wind_speed": hourly.get(
                    "wind_speed_10m", []
                ),
            },

            "alerts": generate_weather_alerts(
                daily
            ),
        }

    except httpx.HTTPError as error:

        raise HTTPException(
            status_code=502,
            detail=f"Weather API error: {str(error)}"
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to load weather: {str(error)}"
        )


def generate_weather_alerts(daily):

    alerts = []

    dates = daily.get("time", [])
    rainfall = daily.get(
        "precipitation_sum",
        []
    )
    probability = daily.get(
        "precipitation_probability_max",
        []
    )
    temperatures = daily.get(
        "temperature_2m_max",
        []
    )

    # Rain alert
    for i in range(len(dates)):

        rain = rainfall[i] or 0
        rain_prob = probability[i] or 0

        if rain_prob >= 70 or rain >= 20:

            alerts.append({
                "type": "rain",
                "title": "Rain Alert",
                "severity": "warning",
                "message": (
                    f"Rain probability is {rain_prob}% "
                    f"with expected rainfall of "
                    f"{round(rain, 1)} mm on {dates[i]}."
                )
            })

            break

    # High temperature
    for i in range(len(dates)):

        temperature = temperatures[i]

        if temperature is not None and temperature >= 36:

            alerts.append({
                "type": "temperature",
                "title": "Temperature Watch",
                "severity": "warning",
                "message": (
                    f"Temperature may reach "
                    f"{round(temperature)}°C on "
                    f"{dates[i]}. Consider additional irrigation."
                )
            })

            break

    # Favorable conditions
    if not alerts:

        alerts.append({
            "type": "favorable",
            "title": "Favorable Conditions",
            "severity": "good",
            "message": (
                "Weather conditions look generally "
                "favorable for crop management."
            )
        })

    return alerts