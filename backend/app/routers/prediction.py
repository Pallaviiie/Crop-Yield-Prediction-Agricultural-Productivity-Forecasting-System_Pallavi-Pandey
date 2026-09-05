from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.models.prediction_history import PredictionHistory
from app.routers.users import get_authenticated_user

from app.ml.predictor import (
    predict_crop,
    get_model_info,
)


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


# ============================================================
# REQUEST SCHEMA
# ============================================================

class PredictionRequest(BaseModel):

    area: str = Field(
        ...,
        description="Country or geographical area"
    )

    item: str = Field(
        ...,
        description="Crop name"
    )

    year: int = Field(
        ...,
        ge=1900,
        le=2100
    )

    season: Optional[str] = None

    average_rain_fall_mm_per_year: float = Field(
        ...,
        ge=0
    )

    pesticides_tonnes: float = Field(
        ...,
        ge=0
    )

    avg_temp: float = Field(
        ...,
        ge=-50,
        le=70
    )


# ============================================================
# PREDICTION RESPONSE
# ============================================================

class PredictionResponse(BaseModel):

    id: Optional[int] = None

    area: str
    item: str
    year: int

    predicted_yield: float

    unit: str = "hg/ha"

    model: str = "Random Forest"

    r2_score: Optional[float] = None

    confidence: Optional[float] = 0


# ============================================================
# HISTORY RESPONSE
# ============================================================

class PredictionHistoryResponse(BaseModel):

    id: int

    area: Optional[str] = None
    crop: Optional[str] = None
    year: Optional[int] = None

    season: Optional[str] = None

    rainfall: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None

    pesticides: Optional[float] = None

    predicted_yield: Optional[float] = None

    recommendation: Optional[str] = None

    category: Optional[str] = "Average"

    confidence: Optional[float] = 0

    created_at: Optional[str] = None


# ============================================================
# PREDICT CROP YIELD
# ============================================================

@router.post("/predict")
def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):

    try:

        # =====================================================
        # RUN ML PREDICTION
        # =====================================================

        predicted_yield, confidence = predict_crop(

            area=request.area,

            item=request.item,

            year=request.year,

            average_rain_fall_mm_per_year=(
                request.average_rain_fall_mm_per_year
            ),

            pesticides_tonnes=request.pesticides_tonnes,

            avg_temp=request.avg_temp,
        )


        # =====================================================
        # MODEL INFORMATION
        # =====================================================

        model_info = get_model_info()


        # =====================================================
        # CATEGORY
        # =====================================================

        if predicted_yield >= 15000:
            category = "High"

        elif predicted_yield >= 8000:
            category = "Average"

        else:
            category = "Low"


        # =====================================================
        # RECOMMENDATION
        # =====================================================

        recommendation = None


        # =====================================================
        # SAVE PREDICTION HISTORY
        # =====================================================

        history = PredictionHistory(

            user_id=current_user.id,

            area=request.area,

            crop=request.item,

            year=request.year,

            season=request.season,

            rainfall=request.average_rain_fall_mm_per_year,

            temperature=request.avg_temp,

            pesticides=request.pesticides_tonnes,

            predicted_yield=predicted_yield,

            confidence=confidence,

            category=category,

            recommendation=recommendation,
        )


        db.add(history)

        db.commit()

        db.refresh(history)


        # =====================================================
        # RESPONSE
        # =====================================================

        return {

            "success": True,

            "prediction": {

                "id": history.id,

                "user_id": history.user_id,

                "area": history.area,

                "crop": history.crop,

                "year": history.year,

                "season": history.season,

                "rainfall": history.rainfall,

                "temperature": history.temperature,

                "pesticides": history.pesticides,

                "predicted_yield": history.predicted_yield,

                "category": history.category,

                "confidence": history.confidence,

                "created_at": (
                    history.created_at.isoformat()
                    if history.created_at
                    else None
                ),
            },

            "model": {

                "model_type": model_info.get(
                    "model_type",
                    "Random Forest"
                ),

                "r2_score": model_info.get(
                    "r2_score"
                ),

                "feature_columns": model_info.get(
                    "feature_columns",
                    []
                ),

                "confidence": confidence,
            },
        }


    except Exception as e:

        db.rollback()

        print(
            "Prediction error:",
            repr(e)
        )

        raise HTTPException(

            status_code=500,

            detail=(
                f"Prediction failed: {str(e)}"
            )
        )


# ============================================================
# GET ALL PREDICTION HISTORY
# ============================================================

@router.get(
    "/history",
    response_model=list[PredictionHistoryResponse]
)
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):

    try:

        history = (

            db.query(PredictionHistory)

            .filter(
                PredictionHistory.user_id
                == current_user.id
            )

            .order_by(
                PredictionHistory.created_at.desc()
            )

            .all()
        )


        result = []


        for item in history:

            result.append(

                PredictionHistoryResponse(

                    id=item.id,

                    area=item.area,

                    crop=item.crop,

                    year=item.year,

                    season=item.season,

                    rainfall=item.rainfall,

                    temperature=item.temperature,

                    humidity=item.humidity,

                    wind_speed=item.wind_speed,

                    pesticides=item.pesticides,

                    predicted_yield=item.predicted_yield,

                    recommendation=item.recommendation,

                    category=item.category,

                    confidence=item.confidence,

                    created_at=(
                        item.created_at.isoformat()
                        if item.created_at
                        else None
                    )
                )
            )


        return result


    except Exception as error:

        print(
            "PREDICTION HISTORY ERROR:",
            repr(error)
        )

        raise HTTPException(

            status_code=500,

            detail=(
                "Unable to fetch prediction history: "
                f"{str(error)}"
            )
        )