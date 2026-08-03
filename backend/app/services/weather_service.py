import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
print("API KEY:", API_KEY)

def get_current_weather(city: str):

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}"
        f"&appid={API_KEY}"
        f"&units=metric"
    )

    response = requests.get(url)

    print("Request URL:", url)
    print("Status Code:", response.status_code)
    print("Response:", response.text)

    if response.status_code != 200:
       print(response.text)
       raise Exception(response.text)

    data = response.json()

    rainfall = 0

    if "rain" in data:
        rainfall = data["rain"].get("1h", 0)

    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rainfall": rainfall,
        "wind_speed": data["wind"]["speed"],
        "condition": data["weather"][0]["main"],
    }