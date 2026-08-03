from pydantic import BaseModel


class WeatherResponse(BaseModel):
    city: str
    temperature: float
    humidity: int
    rainfall: float
    wind_speed: float
    condition: str