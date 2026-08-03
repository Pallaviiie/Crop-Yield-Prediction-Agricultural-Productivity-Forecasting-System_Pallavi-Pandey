from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)

from app.ml.predictor import predict_crop

from app.services.history_service import save_prediction

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"],
)


@router.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict(
    data: PredictionRequest,
    db: Session = Depends(get_db),
):

    result = predict_crop(data)

    prediction_data = {
        "user_id": 1,          # Replace later with logged-in user
        "area": data.area,
        "crop": data.item,
        "year": data.year,
        "rainfall": data.average_rain_fall_mm_per_year,
        "temperature": data.avg_temp,
        "humidity": 0,
        "wind_speed": 0,
        "pesticides": data.pesticides_tonnes,
        "predicted_yield": result["predicted_yield"],
        "recommendation": result["recommendation"],
    }

    save_prediction(db, prediction_data)

    return result