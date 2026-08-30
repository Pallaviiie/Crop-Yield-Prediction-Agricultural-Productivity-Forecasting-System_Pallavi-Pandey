from fastapi import APIRouter
from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendations"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class RecommendationRequest(BaseModel):

    area: str

    item: str

    year: int

    rainfall: float = Field(ge=0)

    temperature: float

    season: str | None = None

    soil_type: str | None = None

    predicted_yield: float = Field(ge=0)

    pesticides_tonnes: float = Field(ge=0)


# ============================================================
# CROP KNOWLEDGE BASE
# ============================================================

CROP_PROFILES = {

    "Cassava": {
        "season": ["Summer", "Monsoon"],
        "soil": [
            "Alluvial Soil",
            "Red Soil",
            "Loamy Soil",
            "Sandy Soil"
        ],
        "rainfall": (1000, 1500),
        "temperature": (20, 30),
        "yield_good": 100000,
    },

    "Maize": {
        "season": ["Summer", "Monsoon"],
        "soil": [
            "Alluvial Soil",
            "Loamy Soil",
            "Black Soil"
        ],
        "rainfall": (500, 1000),
        "temperature": (18, 30),
        "yield_good": 50000,
    },

    "Plantains and others": {
        "season": ["Monsoon", "Summer"],
        "soil": [
            "Alluvial Soil",
            "Loamy Soil"
        ],
        "rainfall": (1200, 2500),
        "temperature": (20, 30),
        "yield_good": 80000,
    },

    "Potatoes": {
        "season": ["Winter", "Pre-Winter"],
        "soil": [
            "Loamy Soil",
            "Sandy Soil",
            "Alluvial Soil"
        ],
        "rainfall": (300, 700),
        "temperature": (10, 25),
        "yield_good": 250000,
    },

    "Rice, paddy": {
        "season": ["Monsoon", "Summer"],
        "soil": [
            "Alluvial Soil",
            "Clay Soil",
            "Loamy Soil"
        ],
        "rainfall": (1000, 2500),
        "temperature": (20, 35),
        "yield_good": 50000,
    },

    "Sorghum": {
        "season": ["Summer", "Monsoon"],
        "soil": [
            "Black Soil",
            "Red Soil",
            "Loamy Soil"
        ],
        "rainfall": (400, 800),
        "temperature": (20, 32),
        "yield_good": 30000,
    },

    "Soybeans": {
        "season": ["Monsoon", "Summer"],
        "soil": [
            "Black Soil",
            "Loamy Soil",
            "Red Soil"
        ],
        "rainfall": (500, 1000),
        "temperature": (20, 30),
        "yield_good": 25000,
    },

    "Sweet potatoes": {
        "season": ["Summer", "Monsoon"],
        "soil": [
            "Sandy Soil",
            "Loamy Soil",
            "Red Soil"
        ],
        "rainfall": (750, 1500),
        "temperature": (20, 30),
        "yield_good": 100000,
    },

    "Wheat": {
        "season": ["Winter", "Pre-Winter"],
        "soil": [
            "Alluvial Soil",
            "Loamy Soil",
            "Black Soil"
        ],
        "rainfall": (300, 700),
        "temperature": (10, 25),
        "yield_good": 40000,
    },

    "Yams": {
        "season": ["Monsoon", "Summer"],
        "soil": [
            "Loamy Soil",
            "Sandy Soil",
            "Red Soil"
        ],
        "rainfall": (1000, 2000),
        "temperature": (20, 30),
        "yield_good": 80000,
    },
}


# ============================================================
# HELPERS
# ============================================================

def range_score(value, minimum, maximum):

    if minimum <= value <= maximum:
        return 100.0

    range_size = maximum - minimum

    if range_size <= 0:
        return 0.0

    if value < minimum:
        distance = minimum - value
    else:
        distance = value - maximum

    penalty = (distance / range_size) * 100

    return max(0.0, 100.0 - penalty)


def get_yield_level(predicted_yield):

    if predicted_yield >= 100000:
        return "High"

    if predicted_yield >= 30000:
        return "Moderate"

    return "Low"


# ============================================================
# GENERATE RECOMMENDATIONS
# ============================================================

@router.post("/generate")
def generate_recommendation(
    request: RecommendationRequest
):

    results = []

    for crop, profile in CROP_PROFILES.items():

        scores = []

        reasons = []

        advice = []

        risks = []

        # ----------------------------------------------------
        # RAINFALL
        # ----------------------------------------------------

        rainfall_score = range_score(
            request.rainfall,
            profile["rainfall"][0],
            profile["rainfall"][1]
        )

        scores.append(rainfall_score)

        if rainfall_score >= 80:

            reasons.append(
                "Rainfall conditions are suitable for this crop."
            )

        elif rainfall_score < 50:

            risks.append(
                "Current rainfall is outside the preferred range."
            )

        # ----------------------------------------------------
        # TEMPERATURE
        # ----------------------------------------------------

        temperature_score = range_score(
            request.temperature,
            profile["temperature"][0],
            profile["temperature"][1]
        )

        scores.append(temperature_score)

        if temperature_score >= 80:

            reasons.append(
                "Temperature is suitable for crop growth."
            )

        elif temperature_score < 50:

            risks.append(
                "Current temperature may affect crop development."
            )

        # ----------------------------------------------------
        # SEASON
        # ----------------------------------------------------

        if request.season:

            if request.season in profile["season"]:

                season_score = 100

                reasons.append(
                    f"{request.season} is suitable for this crop."
                )

            else:

                season_score = 40

                risks.append(
                    f"{request.season} is not the preferred season for this crop."
                )

            scores.append(season_score)

        # ----------------------------------------------------
        # SOIL
        # ----------------------------------------------------

        if request.soil_type:

            if request.soil_type in profile["soil"]:

                soil_score = 100

                reasons.append(
                    f"{request.soil_type} is suitable for this crop."
                )

            else:

                soil_score = 45

                risks.append(
                    "The selected soil type is not the preferred soil for this crop."
                )

            scores.append(soil_score)

        # ----------------------------------------------------
        # PREDICTED YIELD
        # ----------------------------------------------------

        yield_level = get_yield_level(
            request.predicted_yield
        )

        if request.item == crop:

            scores.append(100)

            reasons.append(
                "This is the crop selected for your yield prediction."
            )

        # ----------------------------------------------------
        # CALCULATE SCORE
        # ----------------------------------------------------

        suitability_score = round(
            sum(scores) / len(scores),
            2
        )

        # ----------------------------------------------------
        # YIELD-BASED ADVICE
        # ----------------------------------------------------

        if request.item == crop:

            if yield_level == "High":

                advice.append(
                    "The predicted yield is high. Maintain the current crop management practices and monitor the crop regularly."
                )

            elif yield_level == "Moderate":

                advice.append(
                    "The predicted yield is moderate. Focus on balanced irrigation, soil nutrition and timely crop management."
                )

            else:

                advice.append(
                    "The predicted yield is relatively low. Review soil health, irrigation, nutrient management and weather conditions."
                )

        # ----------------------------------------------------
        # RAINFALL ADVICE
        # ----------------------------------------------------

        if request.rainfall < profile["rainfall"][0]:

            advice.append(
                "Monitor soil moisture and provide supplemental irrigation when required."
            )

        elif request.rainfall > profile["rainfall"][1]:

            advice.append(
                "Improve field drainage and avoid unnecessary irrigation during wet conditions."
            )

        else:

            advice.append(
                "Maintain irrigation according to rainfall and crop growth stage."
            )

        # ----------------------------------------------------
        # TEMPERATURE ADVICE
        # ----------------------------------------------------

        if request.temperature > 35:

            advice.append(
                "High temperature may increase crop water demand. Monitor moisture more frequently."
            )

        elif request.temperature < 10:

            advice.append(
                "Low temperature may slow crop development. Monitor the crop for cold stress."
            )

        # ----------------------------------------------------
        # PESTICIDE ADVICE
        # ----------------------------------------------------

        if request.pesticides_tonnes > 5:

            advice.append(
                "Pesticide usage is relatively high. Consider integrated pest management and targeted application."
            )

            risks.append(
                "High pesticide usage may increase production costs and environmental impact."
            )

        elif request.pesticides_tonnes > 2:

            advice.append(
                "Monitor pest levels before applying additional pesticides."
            )

        else:

            advice.append(
                "Continue regular pest monitoring and use pesticides only when necessary."
            )

        # ----------------------------------------------------
        # FINAL RESULT
        # ----------------------------------------------------

        results.append({

            "crop": crop,

            "suitability_score":
                suitability_score,

            "expected_yield":
                request.predicted_yield
                if request.item == crop
                else None,

            "yield_unit":
                "hg/ha",

            "season":
                profile["season"],

            "soil":
                profile["soil"],

            "rainfall":
                profile["rainfall"],

            "temperature":
                profile["temperature"],

            "reasons":
                reasons,

            "advice":
                advice,

            "risks":
                risks,

        })

    # ========================================================
    # SORT
    # ========================================================

    results.sort(
        key=lambda x: x["suitability_score"],
        reverse=True
    )

    # ========================================================
    # MAKE SELECTED CROP FIRST
    # ========================================================

    selected_crop = next(
        (
            item
            for item in results
            if item["crop"] == request.item
        ),
        None
    )

    other_crops = [
        item
        for item in results
        if item["crop"] != request.item
    ]

    if selected_crop:

        top_recommendations = [
            selected_crop
        ] + other_crops[:2]

    else:

        top_recommendations = results[:3]

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "success": True,

        "selected_crop":
            request.item,

        "predicted_yield":
            request.predicted_yield,

        "yield_unit":
            "hg/ha",

        "recommendations":
            top_recommendations,

        "all_crops":
            results,

        "input": {

            "area":
                request.area,

            "item":
                request.item,

            "year":
                request.year,

            "rainfall":
                request.rainfall,

            "temperature":
                request.temperature,

            "season":
                request.season,

            "soil_type":
                request.soil_type,

            "predicted_yield":
                request.predicted_yield,

            "pesticides_tonnes":
                request.pesticides_tonnes,

        }

    }