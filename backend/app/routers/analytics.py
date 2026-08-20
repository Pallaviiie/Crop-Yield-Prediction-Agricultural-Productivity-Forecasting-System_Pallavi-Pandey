from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.dependencies import get_db
from app.models.prediction_history import PredictionHistory


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# ============================================================
# ANALYTICS DASHBOARD
# ============================================================

@router.get("/dashboard")
def get_analytics_dashboard(
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # GET ALL PREDICTIONS
    # --------------------------------------------------------

    predictions = (
        db.query(PredictionHistory)
        .order_by(
            PredictionHistory.year.asc(),
            PredictionHistory.created_at.asc()
        )
        .all()
    )


    # --------------------------------------------------------
    # EMPTY RESPONSE
    # --------------------------------------------------------

    if not predictions:

        return {
            "success": True,

            "summary": {
                "total_predictions": 0,
                "average_yield": 0,
                "highest_yield": 0,
                "lowest_yield": 0,
                "latest_prediction": None
            },

            "historical_yield": [],

            "rainfall_yield": [],

            "temperature_yield": [],

            "crop_comparison": [],

            "prediction_history": []
        }


    # ========================================================
    # SUMMARY CALCULATIONS
    # ========================================================

    yields = [
        float(item.predicted_yield)
        for item in predictions
        if item.predicted_yield is not None
    ]


    average_yield = (
        sum(yields) / len(yields)
        if yields
        else 0
    )


    highest_yield = (
        max(yields)
        if yields
        else 0
    )


    lowest_yield = (
        min(yields)
        if yields
        else 0
    )


    latest = predictions[-1]


    # ========================================================
    # HISTORICAL YIELD BY YEAR AND CROP
    # ========================================================

    year_data = defaultdict(
        lambda: defaultdict(list)
    )


    for prediction in predictions:

        if (
            prediction.year is not None
            and prediction.crop
            and prediction.predicted_yield is not None
        ):

            year_data[
                prediction.year
            ][
                prediction.crop
            ].append(
                float(prediction.predicted_yield)
            )


    historical_yield = []


    for year in sorted(year_data.keys()):

        row = {
            "year": str(year)
        }


        for crop, values in year_data[year].items():

            row[crop] = round(
                sum(values) / len(values),
                2
            )


        historical_yield.append(row)


    # ========================================================
    # RAINFALL VS YIELD
    # ========================================================

    rainfall_yield = []


    for prediction in predictions:

        if (
            prediction.rainfall is not None
            and prediction.predicted_yield is not None
        ):

            rainfall_yield.append({

                "year": str(prediction.year),

                "rainfall": round(
                    float(prediction.rainfall),
                    2
                ),

                "yield": round(
                    float(prediction.predicted_yield),
                    2
                )
            })


    # ========================================================
    # TEMPERATURE VS YIELD
    # ========================================================

    temperature_yield = []


    for prediction in predictions:

        if (
            prediction.temperature is not None
            and prediction.predicted_yield is not None
        ):

            temperature_yield.append({

                "year": str(prediction.year),

                "temperature": round(
                    float(prediction.temperature),
                    2
                ),

                "yield": round(
                    float(prediction.predicted_yield),
                    2
                )
            })


    # ========================================================
    # CROP COMPARISON
    # ========================================================

    crop_data = defaultdict(list)


    for prediction in predictions:

        if (
            prediction.crop
            and prediction.predicted_yield is not None
        ):

            crop_data[
                prediction.crop
            ].append(
                float(prediction.predicted_yield)
            )


    crop_comparison = []


    for crop, values in crop_data.items():

        crop_comparison.append({

            "crop": crop,

            "yield": round(
                sum(values) / len(values),
                2
            )
        })


    crop_comparison.sort(
        key=lambda item: item["yield"],
        reverse=True
    )


    # ========================================================
    # PREDICTION HISTORY GRAPH
    # ========================================================

    prediction_history = []


    for prediction in predictions:

        prediction_history.append({

            "id": prediction.id,

            "year": str(prediction.year),

            "crop": prediction.crop,

            "area": prediction.area,

            "yield": round(
                float(prediction.predicted_yield),
                2
            ),

            "rainfall": (
                round(float(prediction.rainfall), 2)
                if prediction.rainfall is not None
                else None
            ),

            "temperature": (
                round(float(prediction.temperature), 2)
                if prediction.temperature is not None
                else None
            ),

            "confidence": prediction.confidence
        })


    # ========================================================
    # RETURN RESPONSE
    # ========================================================

    return {

        "success": True,

        "summary": {

            "total_predictions": len(predictions),

            "average_yield": round(
                average_yield,
                2
            ),

            "highest_yield": round(
                highest_yield,
                2
            ),

            "lowest_yield": round(
                lowest_yield,
                2
            ),

            "latest_prediction": {

                "crop": latest.crop,

                "area": latest.area,

                "year": latest.year,

                "yield": round(
                    float(latest.predicted_yield),
                    2
                ),

                "confidence": latest.confidence
            }
        },

        "historical_yield": historical_yield,

        "rainfall_yield": rainfall_yield,

        "temperature_yield": temperature_yield,

        "crop_comparison": crop_comparison,

        "prediction_history": prediction_history
    }


# ============================================================
# ANALYTICS SUMMARY ONLY
# ============================================================

@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db)
):

    total_predictions = (
        db.query(PredictionHistory)
        .count()
    )


    average_yield = (
        db.query(
            func.avg(
                PredictionHistory.predicted_yield
            )
        )
        .scalar()
    )


    highest_yield = (
        db.query(
            func.max(
                PredictionHistory.predicted_yield
            )
        )
        .scalar()
    )


    return {

        "success": True,

        "total_predictions": total_predictions,

        "average_yield": round(
            float(average_yield),
            2
        )
        if average_yield
        else 0,

        "highest_yield": round(
            float(highest_yield),
            2
        )
        if highest_yield
        else 0
    }