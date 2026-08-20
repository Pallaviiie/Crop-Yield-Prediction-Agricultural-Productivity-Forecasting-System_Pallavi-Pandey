from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import pandas as pd
import math


router = APIRouter(
    prefix="/soil",
    tags=["Soil Health"]
)


# ============================================================
# SOIL CSV LOCATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

CSV_PATH = BASE_DIR / "datasets" / "soil.csv"


# ============================================================
# REQUEST MODEL
# ============================================================

class SoilAnalysisRequest(BaseModel):

    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100)

    moisture: float = Field(
        ...,
        ge=0,
        le=100,
        description="Soil moisture percentage"
    )

    soil_type: str
    crop_type: str

    nitrogen: float = Field(..., ge=0)
    potassium: float = Field(..., ge=0)
    phosphorous: float = Field(..., ge=0)


# ============================================================
# LOAD DATASET
# ============================================================

def load_soil_dataset():

    if not CSV_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Soil dataset not found at: {CSV_PATH}"
        )

    try:

        df = pd.read_csv(CSV_PATH)

        # Remove accidental spaces from column names
        df.columns = (
            df.columns
            .astype(str)
            .str.strip()
        )

        return df

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to read soil dataset: {str(error)}"
        )


# ============================================================
# NORMALIZE COLUMN NAMES
# ============================================================

def find_column(df, possible_names):

    normalized = {
        str(column).strip().lower().replace(" ", "").replace("_", ""):
        column
        for column in df.columns
    }

    for name in possible_names:

        key = (
            name
            .lower()
            .replace(" ", "")
            .replace("_", "")
        )

        if key in normalized:
            return normalized[key]

    return None


# ============================================================
# ANALYZE NITROGEN
# ============================================================

def analyze_nitrogen(value):

    if value < 40:

        return {
            "status": "Low",
            "level": "warning",
            "message": "Nitrogen level is low. Crop growth may be limited."
        }

    if value <= 100:

        return {
            "status": "Good",
            "level": "good",
            "message": "Nitrogen level is suitable for many crops."
        }

    return {
        "status": "High",
        "level": "warning",
        "message": "Nitrogen level is high. Avoid excessive nitrogen fertilizer."
    }


# ============================================================
# ANALYZE PHOSPHOROUS
# ============================================================

def analyze_phosphorous(value):

    if value < 20:

        return {
            "status": "Low",
            "level": "warning",
            "message": "Phosphorous is low. Phosphorous supplementation may be required."
        }

    if value <= 80:

        return {
            "status": "Good",
            "level": "good",
            "message": "Phosphorous level is within a useful range."
        }

    return {
        "status": "High",
        "level": "warning",
        "message": "Phosphorous level is high. Avoid unnecessary phosphorus application."
    }


# ============================================================
# ANALYZE POTASSIUM
# ============================================================

def analyze_potassium(value):

    if value < 40:

        return {
            "status": "Low",
            "level": "warning",
            "message": "Potassium level is low and may affect crop development."
        }

    if value <= 160:

        return {
            "status": "Good",
            "level": "good",
            "message": "Potassium level is suitable."
        }

    return {
        "status": "High",
        "level": "warning",
        "message": "Potassium level is high. Avoid unnecessary potassium fertilizer."
    }


# ============================================================
# ANALYZE MOISTURE
# ============================================================

def analyze_moisture(value):

    if value < 25:

        return {
            "status": "Low",
            "level": "warning",
            "message": "Soil moisture is low. Irrigation may be required."
        }

    if value <= 65:

        return {
            "status": "Optimal",
            "level": "good",
            "message": "Soil moisture is suitable for crop growth."
        }

    return {
        "status": "High",
        "level": "warning",
        "message": "Soil moisture is high. Check drainage to avoid waterlogging."
    }


# ============================================================
# ANALYZE HUMIDITY
# ============================================================

def analyze_humidity(value):

    if value < 30:

        return {
            "status": "Low",
            "level": "warning",
            "message": "Atmospheric humidity is relatively low."
        }

    if value <= 80:

        return {
            "status": "Good",
            "level": "good",
            "message": "Humidity is within a generally suitable range."
        }

    return {
        "status": "High",
        "level": "warning",
        "message": "High humidity may increase fungal disease risk."
    }


# ============================================================
# OVERALL SOIL SCORE
# ============================================================

def calculate_score(
    nitrogen,
    phosphorous,
    potassium,
    moisture
):

    score = 100

    # Nitrogen
    if nitrogen < 40:
        score -= 15
    elif nitrogen > 100:
        score -= 5

    # Phosphorous
    if phosphorous < 20:
        score -= 15
    elif phosphorous > 80:
        score -= 5

    # Potassium
    if potassium < 40:
        score -= 15
    elif potassium > 160:
        score -= 5

    # Moisture
    if moisture < 25 or moisture > 65:
        score -= 10

    return max(0, min(100, score))


# ============================================================
# SCORE STATUS
# ============================================================

def get_score_status(score):

    if score >= 80:
        return "Healthy"

    if score >= 60:
        return "Moderate"

    return "Needs Attention"


# ============================================================
# DATASET BASED FERTILIZER RECOMMENDATION
# ============================================================

def get_fertilizer_recommendation(
    df,
    soil_type,
    crop_type,
    nitrogen,
    potassium,
    phosphorous
):

    fertilizer_column = find_column(
        df,
        [
            "Fertilizer Name",
            "Fertilizer"
        ]
    )

    soil_column = find_column(
        df,
        [
            "Soil Type"
        ]
    )

    crop_column = find_column(
        df,
        [
            "Crop Type"
        ]
    )

    nitrogen_column = find_column(
        df,
        [
            "Nitrogen",
            "N"
        ]
    )

    potassium_column = find_column(
        df,
        [
            "Potassium",
            "K"
        ]
    )

    phosphorous_column = find_column(
        df,
        [
            "Phosphorous",
            "Phosphorus",
            "P"
        ]
    )

    if not fertilizer_column:
        return {
            "fertilizer": None,
            "reason": "Fertilizer column was not found in the dataset."
        }

    working_df = df.copy()

    # --------------------------------------------------------
    # FILTER BY SOIL TYPE
    # --------------------------------------------------------

    if soil_column:

        matching_soil = working_df[
            working_df[soil_column]
            .astype(str)
            .str.strip()
            .str.lower()
            ==
            str(soil_type).strip().lower()
        ]

        if len(matching_soil) > 0:
            working_df = matching_soil

    # --------------------------------------------------------
    # FILTER BY CROP TYPE
    # --------------------------------------------------------

    if crop_column:

        matching_crop = working_df[
            working_df[crop_column]
            .astype(str)
            .str.strip()
            .str.lower()
            ==
            str(crop_type).strip().lower()
        ]

        if len(matching_crop) > 0:
            working_df = matching_crop

    if len(working_df) == 0:
        working_df = df.copy()

    # --------------------------------------------------------
    # CALCULATE DISTANCE FROM DATASET RECORDS
    # --------------------------------------------------------

    numeric_columns = []

    if nitrogen_column:
        numeric_columns.append(
            (nitrogen_column, nitrogen)
        )

    if potassium_column:
        numeric_columns.append(
            (potassium_column, potassium)
        )

    if phosphorous_column:
        numeric_columns.append(
            (phosphorous_column, phosphorous)
        )

    if numeric_columns:

        distances = []

        for _, row in working_df.iterrows():

            distance = 0

            for column, user_value in numeric_columns:

                try:

                    dataset_value = float(row[column])

                    # Normalized difference
                    scale = max(abs(user_value), 1)

                    distance += (
                        (dataset_value - user_value) / scale
                    ) ** 2

                except (ValueError, TypeError):

                    distance += 1

            distances.append(
                math.sqrt(distance)
            )

        working_df = working_df.copy()

        working_df["_distance"] = distances

        nearest = working_df.sort_values(
            "_distance"
        ).head(10)

    else:

        nearest = working_df.head(10)

    # --------------------------------------------------------
    # MOST COMMON FERTILIZER
    # --------------------------------------------------------

    fertilizer_counts = (
        nearest[fertilizer_column]
        .astype(str)
        .str.strip()
        .value_counts()
    )

    if fertilizer_counts.empty:

        return {
            "fertilizer": None,
            "reason": "No fertilizer recommendation available."
        }

    recommended = fertilizer_counts.index[0]

    return {
        "fertilizer": recommended,
        "reason": (
            f"The dataset indicates {recommended} "
            f"as the most common fertilizer for soil/crop "
            f"conditions similar to your input."
        )
    }


# ============================================================
# SOIL ANALYSIS ENDPOINT
# ============================================================

@router.post("/analyze")
def analyze_soil(request: SoilAnalysisRequest):

    df = load_soil_dataset()

    # --------------------------------------------------------
    # ANALYZE INDIVIDUAL PARAMETERS
    # --------------------------------------------------------

    nitrogen = analyze_nitrogen(
        request.nitrogen
    )

    phosphorous = analyze_phosphorous(
        request.phosphorous
    )

    potassium = analyze_potassium(
        request.potassium
    )

    moisture = analyze_moisture(
        request.moisture
    )

    humidity = analyze_humidity(
        request.humidity
    )

    # --------------------------------------------------------
    # OVERALL SCORE
    # --------------------------------------------------------

    score = calculate_score(
        request.nitrogen,
        request.phosphorous,
        request.potassium,
        request.moisture
    )

    score_status = get_score_status(score)

    # --------------------------------------------------------
    # FERTILIZER RECOMMENDATION
    # --------------------------------------------------------

    fertilizer = get_fertilizer_recommendation(
        df=df,
        soil_type=request.soil_type,
        crop_type=request.crop_type,
        nitrogen=request.nitrogen,
        potassium=request.potassium,
        phosphorous=request.phosphorous
    )

    # --------------------------------------------------------
    # ALERTS
    # --------------------------------------------------------

    alerts = []

    if nitrogen["level"] == "warning":
        alerts.append({
            "type": "nitrogen",
            "severity": "warning",
            "title": "Nitrogen requires attention",
            "message": nitrogen["message"]
        })

    if phosphorous["level"] == "warning":
        alerts.append({
            "type": "phosphorous",
            "severity": "warning",
            "title": "Phosphorous requires attention",
            "message": phosphorous["message"]
        })

    if potassium["level"] == "warning":
        alerts.append({
            "type": "potassium",
            "severity": "warning",
            "title": "Potassium requires attention",
            "message": potassium["message"]
        })

    if moisture["level"] == "warning":
        alerts.append({
            "type": "moisture",
            "severity": "warning",
            "title": "Moisture requires attention",
            "message": moisture["message"]
        })

    if humidity["level"] == "warning":
        alerts.append({
            "type": "humidity",
            "severity": "warning",
            "title": "Humidity alert",
            "message": humidity["message"]
        })

    if not alerts:

        alerts.append({
            "type": "good",
            "severity": "good",
            "title": "Soil conditions look good",
            "message": "No major soil parameter requires immediate attention."
        })

    # --------------------------------------------------------
    # RETURN RESULT
    # --------------------------------------------------------

    return {
        "success": True,

        "soil_health": {
            "score": score,
            "status": score_status
        },

        "location_input": {
            "soil_type": request.soil_type,
            "crop_type": request.crop_type
        },

        "parameters": {

            "temperature": {
                "value": request.temperature,
                "unit": "°C"
            },

            "humidity": {
                "value": request.humidity,
                "unit": "%"
            },

            "moisture": {
                "value": request.moisture,
                "unit": "%"
            },

            "nitrogen": {
                "value": request.nitrogen,
                "unit": "dataset units",
                **nitrogen
            },

            "phosphorous": {
                "value": request.phosphorous,
                "unit": "dataset units",
                **phosphorous
            },

            "potassium": {
                "value": request.potassium,
                "unit": "dataset units",
                **potassium
            }
        },

        "fertilizer_recommendation": fertilizer,

        "alerts": alerts,

        "dataset": {
            "file": "soil.csv",
            "records": len(df)
        }
    }


# ============================================================
# DATASET INFORMATION
# ============================================================

@router.get("/dataset-info")
def soil_dataset_info():

    df = load_soil_dataset()

    return {
        "success": True,
        "file": "soil.csv",
        "records": len(df),
        "columns": list(df.columns)
    }