from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.ml.predictor import predict_crop, get_model_info
from app.models.prediction_history import PredictionHistory


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

    confidence: Optional[int] = 0


# ============================================================
# HISTORY RESPONSE
# ============================================================

class PredictionHistoryResponse(BaseModel):

    id: int

    area: Optional[str] = None
    crop: Optional[str] = None
    year: Optional[int] = None

    rainfall: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None

    pesticides: Optional[float] = None

    predicted_yield: Optional[float] = None

    recommendation: Optional[str] = None

    category: Optional[str] = "Average"

    confidence: Optional[int] = 0

    created_at: Optional[str] = None


# ============================================================
# PREDICT CROP YIELD
# ============================================================

@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_yield(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):

    try:

        # ----------------------------------------------------
        # RUN ML MODEL
        # ----------------------------------------------------

        predicted_yield = predict_crop(

            area=request.area,

            item=request.item,

            year=request.year,

            average_rain_fall_mm_per_year=(
                request.average_rain_fall_mm_per_year
            ),

            pesticides_tonnes=request.pesticides_tonnes,

            avg_temp=request.avg_temp
        )

        # ----------------------------------------------------
        # MODEL INFORMATION
        # ----------------------------------------------------

        model_info = get_model_info()

        r2_score = model_info.get("r2_score")

        # ----------------------------------------------------
        # CALCULATE MODEL CONFIDENCE
        # ----------------------------------------------------

        if r2_score is not None:
          confidence = round(max(0, min(100, float(r2_score) * 100)))
        else:
           confidence = 0

        predicted_yield = round(
            float(predicted_yield),
            2
        )

        # ----------------------------------------------------
        # SAVE PREDICTION HISTORY
        # ----------------------------------------------------

        history = PredictionHistory(

            area=request.area,

            crop=request.item,

            year=request.year,

            season=request.season,

            rainfall=request.average_rain_fall_mm_per_year,

            temperature=request.avg_temp,

            humidity=None,

            wind_speed=None,

            pesticides=request.pesticides_tonnes,

            predicted_yield=predicted_yield,

            recommendation=None,

            category="Average",

            confidence=confidence
        )

        db.add(history)

        db.commit()

        db.refresh(history)

        # ----------------------------------------------------
        # RETURN RESPONSE
        # ----------------------------------------------------

        return PredictionResponse(

         id=history.id,

         area=request.area,

         item=request.item,

         year=request.year,

        

         predicted_yield=predicted_yield,

         unit="hg/ha",

         model="Random Forest",

         r2_score=r2_score,

         confidence=confidence
       )

    except ValueError as error:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )


# ============================================================
# GET ALL PREDICTION HISTORY
# ============================================================

@router.get(
    "/history",
    response_model=list[PredictionHistoryResponse]
)
def get_prediction_history(
    db: Session = Depends(get_db)
):

    try:

        history = (
            db.query(PredictionHistory)
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