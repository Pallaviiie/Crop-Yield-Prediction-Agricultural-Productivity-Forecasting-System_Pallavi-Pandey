from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.dependencies import get_db
from app.models.prediction_history import PredictionHistory


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# ============================================================
# PRODUCTIVITY REPORT
# ============================================================

@router.get("/productivity")
def productivity_report(
    db: Session = Depends(get_db)
):

    try:

        records = (
            db.query(PredictionHistory)
            .order_by(
                PredictionHistory.year.asc()
            )
            .all()
        )

        if not records:

            return {
                "success": True,
                "message": "No prediction data available yet.",
                "summary": {
                    "total_predictions": 0,
                    "average_yield": 0,
                    "highest_yield": 0,
                    "lowest_yield": 0
                },
                "crop_productivity": [],
                "area_productivity": [],
                "yearly_productivity": []
            }

        # ====================================================
        # SUMMARY
        # ====================================================

        yields = [
            float(record.predicted_yield)
            for record in records
            if record.predicted_yield is not None
        ]

        average_yield = (
            sum(yields) / len(yields)
            if yields
            else 0
        )

        highest_yield = max(yields) if yields else 0
        lowest_yield = min(yields) if yields else 0

        # ====================================================
        # CROP PRODUCTIVITY
        # ====================================================

        crop_data = {}

        for record in records:

            crop = record.crop or "Unknown"
            value = float(record.predicted_yield or 0)

            if crop not in crop_data:

                crop_data[crop] = {
                    "crop": crop,
                    "total_yield": 0,
                    "count": 0
                }

            crop_data[crop]["total_yield"] += value
            crop_data[crop]["count"] += 1

        crop_productivity = []

        for crop, data in crop_data.items():

            average = (
                data["total_yield"] /
                data["count"]
            )

            crop_productivity.append({
                "crop": crop,
                "average_yield": round(
                    average,
                    2
                ),
                "predictions": data["count"]
            })

        crop_productivity.sort(
            key=lambda x: x["average_yield"],
            reverse=True
        )

        # ====================================================
        # AREA PRODUCTIVITY
        # ====================================================

        area_data = {}

        for record in records:

            area = record.area or "Unknown"
            value = float(record.predicted_yield or 0)

            if area not in area_data:

                area_data[area] = {
                    "area": area,
                    "total_yield": 0,
                    "count": 0
                }

            area_data[area]["total_yield"] += value
            area_data[area]["count"] += 1

        area_productivity = []

        for area, data in area_data.items():

            average = (
                data["total_yield"] /
                data["count"]
            )

            area_productivity.append({
                "area": area,
                "average_yield": round(
                    average,
                    2
                ),
                "predictions": data["count"]
            })

        area_productivity.sort(
            key=lambda x: x["average_yield"],
            reverse=True
        )

        # ====================================================
        # YEARLY PRODUCTIVITY
        # ====================================================

        yearly_data = {}

        for record in records:

            year = record.year
            value = float(record.predicted_yield or 0)

            if year not in yearly_data:

                yearly_data[year] = {
                    "year": year,
                    "total_yield": 0,
                    "count": 0
                }

            yearly_data[year]["total_yield"] += value
            yearly_data[year]["count"] += 1

        yearly_productivity = []

        for year, data in yearly_data.items():

            average = (
                data["total_yield"] /
                data["count"]
            )

            yearly_productivity.append({
                "year": year,
                "average_yield": round(
                    average,
                    2
                ),
                "predictions": data["count"]
            })

        yearly_productivity.sort(
            key=lambda x: x["year"]
        )

        # ====================================================
        # BEST CROP
        # ====================================================

        best_crop = (
            crop_productivity[0]["crop"]
            if crop_productivity
            else None
        )

        # ====================================================
        # BEST AREA
        # ====================================================

        best_area = (
            area_productivity[0]["area"]
            if area_productivity
            else None
        )

        # ====================================================
        # RETURN REPORT
        # ====================================================

        return {

            "success": True,

            "summary": {

                "total_predictions": len(records),

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

                "best_crop": best_crop,

                "best_area": best_area
            },

            "crop_productivity":
                crop_productivity,

            "area_productivity":
                area_productivity,

            "yearly_productivity":
                yearly_productivity
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate productivity report: {str(error)}"
        )
@router.get("/seasonal")
def seasonal_report(
    db: Session = Depends(get_db)
):

    try:

        records = (
            db.query(PredictionHistory)
            .filter(
                PredictionHistory.season.isnot(None)
            )
            .all()
        )

        if not records:

            return {
                "success": True,
                "message": "No seasonal prediction data available.",
                "seasons": []
            }

        seasonal_data = {}

        for record in records:

            season = record.season or "Unknown"

            if season not in seasonal_data:

                seasonal_data[season] = {
                    "season": season,
                    "total_yield": 0,
                    "count": 0
                }

            seasonal_data[season]["total_yield"] += float(
                record.predicted_yield or 0
            )

            seasonal_data[season]["count"] += 1

        result = []

        for season, data in seasonal_data.items():

            average_yield = (
                data["total_yield"] /
                data["count"]
            )

            result.append({

                "season": season,

                "average_yield": round(
                    average_yield,
                    2
                ),

                "predictions": data["count"]
            })

        result.sort(
            key=lambda x: x["average_yield"],
            reverse=True
        )

        return {

            "success": True,

            "seasons": result,

            "best_season": (
                result[0]["season"]
                if result
                else None
            )
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate seasonal report: {str(error)}"
        )