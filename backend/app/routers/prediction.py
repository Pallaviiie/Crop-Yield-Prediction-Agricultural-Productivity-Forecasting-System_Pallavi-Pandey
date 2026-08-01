from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)

from app.ml.predictor import predict_crop

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"],
)


@router.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict(data: PredictionRequest):

    try:
        result = predict_crop(data)
        return result

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )