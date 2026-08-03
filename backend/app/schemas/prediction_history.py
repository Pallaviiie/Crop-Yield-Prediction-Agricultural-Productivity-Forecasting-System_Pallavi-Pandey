from pydantic import BaseModel
from datetime import datetime


class PredictionHistoryBase(BaseModel):
    area: str
    crop: str
    year: int
    rainfall: float
    temperature: float
    humidity: float
    wind_speed: float
    pesticides: float
    predicted_yield: float
    recommendation: str
    category: str
    confidence: int


class PredictionHistoryCreate(PredictionHistoryBase):
    user_id: int


class PredictionHistoryResponse(PredictionHistoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True