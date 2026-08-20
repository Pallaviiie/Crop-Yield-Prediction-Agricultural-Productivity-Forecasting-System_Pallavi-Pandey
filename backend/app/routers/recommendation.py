from fastapi import APIRouter
from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendations"]
)


class RecommendationRequest(BaseModel):

    crop: str

    predicted_yield: float = Field(
        ...,
        ge=0
    )

    rainfall: float = Field(
        ...,
        ge=0
    )

    temperature: float

    soil_moisture: float = Field(
        ...,
        ge=0,
        le=100
    )

    nitrogen: float = Field(
        ...,
        ge=0
    )

    phosphorous: float = Field(
        ...,
        ge=0
    )

    potassium: float = Field(
        ...,
        ge=0
    )


@router.post("/generate")
def generate_recommendation(
    request: RecommendationRequest
):

    recommendations = []
    risks = []

    # ========================================================
    # MOISTURE
    # ========================================================

    if request.soil_moisture < 25:

        recommendations.append(
            "Increase irrigation because soil moisture is low."
        )

        risks.append(
            "Low soil moisture may reduce crop growth."
        )

    elif request.soil_moisture > 65:

        recommendations.append(
            "Reduce irrigation and check field drainage."
        )

        risks.append(
            "Excess moisture may cause waterlogging."
        )

    else:

        recommendations.append(
            "Maintain the current irrigation level."
        )

    # ========================================================
    # NITROGEN
    # ========================================================

    if request.nitrogen < 40:

        recommendations.append(
            "Nitrogen level is low. Consider nitrogen supplementation."
        )

        risks.append(
            "Nitrogen deficiency may limit crop development."
        )

    elif request.nitrogen > 100:

        recommendations.append(
            "Avoid excessive nitrogen fertilizer application."
        )

        risks.append(
            "High nitrogen can cause nutrient imbalance."
        )

    # ========================================================
    # PHOSPHOROUS
    # ========================================================

    if request.phosphorous < 20:

        recommendations.append(
            "Consider phosphorus supplementation based on soil requirements."
        )

    elif request.phosphorous > 80:

        recommendations.append(
            "Avoid unnecessary phosphorus application."
        )

    # ========================================================
    # POTASSIUM
    # ========================================================

    if request.potassium < 40:

        recommendations.append(
            "Potassium level is low. Consider potassium supplementation."
        )

    elif request.potassium > 160:

        recommendations.append(
            "Avoid excessive potassium fertilizer."
        )

    # ========================================================
    # TEMPERATURE
    # ========================================================

    if request.temperature < 10:

        risks.append(
            "Low temperature may slow crop growth."
        )

    elif request.temperature > 35:

        risks.append(
            "High temperature may create heat stress."
        )

        recommendations.append(
            "Increase irrigation monitoring during high temperatures."
        )

    # ========================================================
    # RAINFALL
    # ========================================================

    if request.rainfall < 500:

        recommendations.append(
            "Monitor irrigation carefully because annual rainfall is relatively low."
        )

    elif request.rainfall > 2000:

        risks.append(
            "High rainfall may increase waterlogging and disease risk."
        )

        recommendations.append(
            "Ensure proper drainage during high rainfall periods."
        )

    # ========================================================
    # YIELD ASSESSMENT
    # ========================================================

    if request.predicted_yield < 2000:

        yield_category = "Low"

        recommendations.append(
            "Predicted yield is low. Review soil nutrients, irrigation and crop conditions."
        )

    elif request.predicted_yield < 5000:

        yield_category = "Average"

    else:

        yield_category = "High"

        recommendations.append(
            "Predicted yield is favorable. Maintain current crop management practices."
        )

    # ========================================================
    # RISK LEVEL
    # ========================================================

    if len(risks) >= 3:

        risk_level = "High"

    elif len(risks) >= 1:

        risk_level = "Moderate"

    else:

        risk_level = "Low"

    return {

        "success": True,

        "crop": request.crop,

        "yield_assessment": {
            "predicted_yield": request.predicted_yield,
            "category": yield_category
        },

        "risk_assessment": {
            "level": risk_level,
            "risk_count": len(risks),
            "risks": risks
        },

        "recommendations": recommendations
    }