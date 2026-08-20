import os
import requests
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

OPENWEATHER_API_KEY = os.getenv(
    "OPENWEATHER_API_KEY"
)


# ============================================================
# WEATHER API URL
# ============================================================

OPENWEATHER_URL = (
    "https://api.openweathermap.org/data/2.5/weather"
)


# ============================================================
# GET CURRENT WEATHER
# ============================================================

def get_current_weather(city: str) -> dict:
    """
    Fetch current weather information for a city
    using the OpenWeather API.
    """

    # --------------------------------------------------------
    # VALIDATE CITY
    # --------------------------------------------------------

    if not city or not city.strip():

        raise ValueError(
            "City name cannot be empty."
        )

    city = city.strip()


    # --------------------------------------------------------
    # CHECK API KEY
    # --------------------------------------------------------

    if not OPENWEATHER_API_KEY:

        raise ValueError(
            "OPENWEATHER_API_KEY is not configured "
            "in backend/.env"
        )


    # --------------------------------------------------------
    # API PARAMETERS
    # --------------------------------------------------------

    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }


    # --------------------------------------------------------
    # SEND REQUEST
    # --------------------------------------------------------

    try:

        response = requests.get(
            OPENWEATHER_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

    except requests.exceptions.HTTPError as error:

        try:
            error_data = response.json()

            message = error_data.get(
                "message",
                "Weather API returned an error."
            )

        except Exception:

            message = (
                "Weather API returned an HTTP error."
            )

        raise ValueError(
            f"Weather API error: {message}"
        ) from error


    except requests.exceptions.RequestException as error:

        raise ValueError(
            f"Unable to connect to Weather API: {error}"
        ) from error


    # --------------------------------------------------------
    # PARSE RESPONSE
    # --------------------------------------------------------

    try:

        data = response.json()

    except ValueError as error:

        raise ValueError(
            "Weather API returned invalid data."
        ) from error


    # --------------------------------------------------------
    # EXTRACT WEATHER INFORMATION
    # --------------------------------------------------------

    main_data = data.get(
        "main",
        {}
    )

    wind_data = data.get(
        "wind",
        {}
    )

    weather_data = data.get(
        "weather",
        []
    )


    # --------------------------------------------------------
    # TEMPERATURE
    # --------------------------------------------------------

    temperature = main_data.get(
        "temp",
        0.0
    )


    # --------------------------------------------------------
    # HUMIDITY
    # --------------------------------------------------------

    humidity = main_data.get(
        "humidity",
        0.0
    )


    # --------------------------------------------------------
    # WIND SPEED
    # --------------------------------------------------------

    wind_speed = wind_data.get(
        "speed",
        0.0
    )


    # --------------------------------------------------------
    # WEATHER CONDITION
    # --------------------------------------------------------

    condition = "Unknown"

    if weather_data:

        condition = weather_data[0].get(
            "main",
            "Unknown"
        )


    # --------------------------------------------------------
    # RAINFALL
    # --------------------------------------------------------

    rainfall = 0.0

    rain_data = data.get(
        "rain",
        {}
    )

    if rain_data:

        # OpenWeather can provide rainfall
        # for the previous 1 hour.
        rainfall = rain_data.get(
            "1h",
            0.0
        )


    # --------------------------------------------------------
    # CITY NAME
    # --------------------------------------------------------

    city_name = data.get(
        "name",
        city
    )


    # --------------------------------------------------------
    # RETURN WEATHER DATA
    # --------------------------------------------------------

    return {

        "city": city_name,

        "temperature": float(
            temperature
        ),

        "humidity": float(
            humidity
        ),

        "rainfall": float(
            rainfall
        ),

        "wind_speed": float(
            wind_speed
        ),

        "condition": condition
    }