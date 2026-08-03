from fastapi import APIRouter, HTTPException
from app.services.weather_service import get_current_weather

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)

@router.get("/current")
def current_weather(city: str):
    try:
        return get_current_weather(city)
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )