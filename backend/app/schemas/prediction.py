from pydantic import BaseModel


class PredictionRequest(BaseModel):

    area: str
    item: str
    year: int
    average_rain_fall_mm_per_year: float
    pesticides_tonnes: float
    avg_temp: float



class PredictionResponse(BaseModel):

    predicted_yield: float
    confidence: int
    recommendation: str