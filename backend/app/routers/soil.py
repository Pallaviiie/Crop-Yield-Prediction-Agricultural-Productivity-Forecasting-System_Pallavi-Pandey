from pathlib import Path

import pandas as pd

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/soil",
    tags=["Soil Health"],
)


# ============================================================
# DATASET PATH
#
# soil.py:
# backend/app/routers/soil.py
#
# dataset:
# backend/datasets/soil.csv
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parents[2]

SOIL_CSV = BACKEND_DIR / "datasets" / "soil.csv"


# ============================================================
# REQUEST MODEL
# ============================================================

class SoilAnalysisRequest(BaseModel):

    temperature: float
    humidity: float
    soil_type: str
    crop_type: str


# ============================================================
# NORMALIZE TEXT
# ============================================================

def normalize_text(value):

    if value is None:
        return ""

    return (
        str(value)
        .strip()
        .lower()
        .replace("_", " ")
        .replace("-", " ")
    )


# ============================================================
# NORMALIZE CSV COLUMNS
# ============================================================

def normalize_columns(df):

    mapping = {}

    for column in df.columns:

        original = str(column).strip()

        normalized = (
            original
            .lower()
            .replace(" ", "")
            .replace("_", "")
            .replace("-", "")
        )

        # Temperature
        if normalized in [
            "temperature",
            "temparature",
            "temp",
        ]:

            mapping[original] = "Temperature"

        # Humidity
        elif normalized in [
            "humidity",
        ]:

            mapping[original] = "Humidity"

        # Moisture
        elif normalized in [
            "moisture",
            "soilmoisture",
        ]:

            mapping[original] = "Moisture"

        # Soil Type
        elif normalized in [
            "soiltype",
            "soil",
        ]:

            mapping[original] = "Soil Type"

        # Crop Type
        elif normalized in [
            "croptype",
            "crop",
        ]:

            mapping[original] = "Crop Type"

        # Nitrogen
        elif normalized in [
            "nitrogen",
            "n",
        ]:

            mapping[original] = "Nitrogen"

        # Potassium
        elif normalized in [
            "potassium",
            "k",
        ]:

            mapping[original] = "Potassium"

        # Phosphorous / Phosphorus
        elif normalized in [
            "phosphorous",
            "phosphorus",
            "p",
        ]:

            mapping[original] = "Phosphorous"

        # Fertilizer
        elif normalized in [
            "fertilizername",
            "fertilizer",
        ]:

            mapping[original] = "Fertilizer Name"


    return df.rename(
        columns=mapping
    )


# ============================================================
# LOAD SOIL DATASET
# ============================================================

def load_soil_dataset():

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    if not SOIL_CSV.exists():

        raise FileNotFoundError(
            f"soil.csv could not be found at: {SOIL_CSV}"
        )


    print(
        f"SOIL CSV FOUND: {SOIL_CSV}"
    )


    # --------------------------------------------------------
    # READ CSV
    # --------------------------------------------------------

    try:

        df = pd.read_csv(
            SOIL_CSV
        )

    except Exception as error:

        raise ValueError(
            f"Unable to read soil.csv: {error}"
        )


    # --------------------------------------------------------
    # CLEAN COLUMN NAMES
    # --------------------------------------------------------

    df.columns = [

        str(column)
        .replace("\ufeff", "")
        .strip()

        for column in df.columns

    ]


    # --------------------------------------------------------
    # NORMALIZE COLUMN NAMES
    # --------------------------------------------------------

    df = normalize_columns(
        df
    )


    print(
        "SOIL CSV COLUMNS:",
        list(df.columns)
    )


    # ========================================================
    # REQUIRED COLUMNS
    # ========================================================

    required_columns = [

        "Temperature",
        "Humidity",
        "Moisture",
        "Soil Type",
        "Crop Type",
        "Nitrogen",
        "Potassium",
        "Phosphorous",
        "Fertilizer Name",

    ]


    missing_columns = [

        column

        for column in required_columns

        if column not in df.columns

    ]


    if missing_columns:

        raise ValueError(
            "Missing soil.csv columns: "
            + ", ".join(missing_columns)
            + ". Found columns: "
            + ", ".join(
                str(column)
                for column in df.columns
            )
        )


    # ========================================================
    # CONVERT NUMERIC VALUES
    # ========================================================

    numeric_columns = [

        "Temperature",
        "Humidity",
        "Moisture",
        "Nitrogen",
        "Potassium",
        "Phosphorous",

    ]


    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )


    # --------------------------------------------------------
    # REMOVE INVALID ROWS
    # --------------------------------------------------------

    df = df.dropna(
        subset=numeric_columns
    ).copy()


    if df.empty:

        raise ValueError(
            "soil.csv contains no valid soil records."
        )


    return df


# ============================================================
# STATUS FUNCTIONS
# ============================================================

def nutrient_status(value):

    value = float(value)

    if value < 30:
        return "Low"

    elif value > 100:
        return "High"

    return "Good"


def moisture_status(value):

    value = float(value)

    if value < 25:
        return "Low"

    elif value > 75:
        return "High"

    return "Good"


def temperature_status(value):

    value = float(value)

    if value < 10:
        return "Low"

    elif value > 35:
        return "High"

    return "Good"


def humidity_status(value):

    value = float(value)

    if value < 30:
        return "Low"

    elif value > 80:
        return "High"

    return "Good"


# ============================================================
# NUTRIENT MESSAGE
# ============================================================

def nutrient_message(
    name,
    value,
    status
):

    if status == "Low":

        return (
            f"{name} level is low. "
            "Crop growth may be limited and "
            "soil-test-based supplementation "
            "may be required."
        )


    if status == "High":

        return (
            f"{name} level is high. "
            "Avoid unnecessary additional "
            "fertilizer application."
        )


    return (
        f"{name} level is within a suitable "
        "range for the matched soil record."
    )


# ============================================================
# SOIL HEALTH SCORE
# ============================================================

def calculate_soil_health_score(
    nitrogen,
    phosphorous,
    potassium,
    moisture,
    humidity,
    temperature,
):

    scores = []


    # --------------------------------------------------------
    # NITROGEN
    # --------------------------------------------------------

    if 30 <= nitrogen <= 100:

        scores.append(100)

    elif nitrogen < 30:

        scores.append(
            max(
                0,
                (nitrogen / 30) * 70
            )
        )

    else:

        scores.append(75)


    # --------------------------------------------------------
    # PHOSPHOROUS
    # --------------------------------------------------------

    if 30 <= phosphorous <= 100:

        scores.append(100)

    elif phosphorous < 30:

        scores.append(
            max(
                0,
                (phosphorous / 30) * 70
            )
        )

    else:

        scores.append(75)


    # --------------------------------------------------------
    # POTASSIUM
    # --------------------------------------------------------

    if 30 <= potassium <= 100:

        scores.append(100)

    elif potassium < 30:

        scores.append(
            max(
                0,
                (potassium / 30) * 70
            )
        )

    else:

        scores.append(75)


    # --------------------------------------------------------
    # MOISTURE
    # --------------------------------------------------------

    if 25 <= moisture <= 75:

        scores.append(100)

    elif moisture < 25:

        scores.append(
            max(
                0,
                (moisture / 25) * 70
            )
        )

    else:

        scores.append(70)


    # --------------------------------------------------------
    # HUMIDITY
    # --------------------------------------------------------

    if 30 <= humidity <= 80:

        scores.append(100)

    else:

        scores.append(70)


    # --------------------------------------------------------
    # TEMPERATURE
    # --------------------------------------------------------

    if 15 <= temperature <= 35:

        scores.append(100)

    elif 10 <= temperature < 15:

        scores.append(75)

    elif 35 < temperature <= 40:

        scores.append(75)

    else:

        scores.append(50)


    # --------------------------------------------------------
    # FINAL SCORE
    # --------------------------------------------------------

    score = round(
        sum(scores) / len(scores)
    )


    score = max(
        0,
        min(100, score)
    )


    if score >= 80:

        status = "Healthy"

    elif score >= 60:

        status = "Moderate"

    else:

        status = "Needs Attention"


    return score, status


# ============================================================
# FIND BEST MATCH
# ============================================================

def find_best_soil_match(
    df,
    request
):

    work = df.copy()


    # --------------------------------------------------------
    # NORMALIZE SOIL/CROP
    # --------------------------------------------------------

    work["_soil"] = (
        work["Soil Type"]
        .map(normalize_text)
    )


    work["_crop"] = (
        work["Crop Type"]
        .map(normalize_text)
    )


    requested_soil = normalize_text(
        request.soil_type
    )


    requested_crop = normalize_text(
        request.crop_type
    )


    # ========================================================
    # EXACT SOIL + CROP MATCH
    # ========================================================

    exact = work[
        (work["_soil"] == requested_soil)
        &
        (work["_crop"] == requested_crop)
    ]


    if not exact.empty:

        candidates = exact.copy()


    else:

        # ====================================================
        # CROP MATCH
        # ====================================================

        crop_matches = work[
            work["_crop"] == requested_crop
        ]


        if not crop_matches.empty:

            candidates = crop_matches.copy()


        else:

            # =================================================
            # SOIL MATCH
            # =================================================

            soil_matches = work[
                work["_soil"] == requested_soil
            ]


            if not soil_matches.empty:

                candidates = soil_matches.copy()


            else:

                # =============================================
                # FALLBACK
                # =============================================

                candidates = work.copy()


    # ========================================================
    # TEMPERATURE DISTANCE
    # ========================================================

    candidates["_temperature_distance"] = (

        candidates["Temperature"]
        -
        float(request.temperature)

    ).abs()


    # ========================================================
    # HUMIDITY DISTANCE
    # ========================================================

    candidates["_humidity_distance"] = (

        candidates["Humidity"]
        -
        float(request.humidity)

    ).abs()


    # ========================================================
    # TOTAL DISTANCE
    # ========================================================

    candidates["_distance"] = (

        candidates["_temperature_distance"]

        +

        candidates["_humidity_distance"]

    )


    # ========================================================
    # CLOSEST RECORD
    # ========================================================

    candidates = candidates.sort_values(
        "_distance"
    )


    return candidates.iloc[0]


# ============================================================
# SOIL ANALYSIS ENDPOINT
# ============================================================

@router.post("/analyze")
def analyze_soil(
    request: SoilAnalysisRequest
):

    try:

        # ----------------------------------------------------
        # LOAD DATA
        # ----------------------------------------------------

        df = load_soil_dataset()


        # ----------------------------------------------------
        # FIND MATCH
        # ----------------------------------------------------

        matched = find_best_soil_match(
            df,
            request
        )


        # ----------------------------------------------------
        # GET DATASET VALUES
        # ----------------------------------------------------

        temperature = float(
            matched["Temperature"]
        )

        humidity = float(
            matched["Humidity"]
        )

        moisture = float(
            matched["Moisture"]
        )

        nitrogen = float(
            matched["Nitrogen"]
        )

        potassium = float(
            matched["Potassium"]
        )

        phosphorous = float(
            matched["Phosphorous"]
        )

        soil_type = str(
            matched["Soil Type"]
        )

        crop_type = str(
            matched["Crop Type"]
        )

        fertilizer_name = str(
            matched["Fertilizer Name"]
        )


        # ====================================================
        # STATUSES
        # ====================================================

        nitrogen_status = nutrient_status(
            nitrogen
        )

        phosphorous_status = nutrient_status(
            phosphorous
        )

        potassium_status = nutrient_status(
            potassium
        )

        moisture_status_value = moisture_status(
            moisture
        )

        humidity_status_value = humidity_status(
            humidity
        )

        temperature_status_value = temperature_status(
            temperature
        )


        # ====================================================
        # SOIL HEALTH
        # ====================================================

        score, health_status = (
            calculate_soil_health_score(

                nitrogen,
                phosphorous,
                potassium,
                moisture,
                humidity,
                temperature,

            )
        )


        # ====================================================
        # PARAMETERS
        # ====================================================

        parameters = {

            "nitrogen": {

                "value": nitrogen,

                "status": nitrogen_status,

                "message": nutrient_message(
                    "Nitrogen",
                    nitrogen,
                    nitrogen_status
                ),

            },


            "phosphorous": {

                "value": phosphorous,

                "status": phosphorous_status,

                "message": nutrient_message(
                    "Phosphorous",
                    phosphorous,
                    phosphorous_status
                ),

            },


            "potassium": {

                "value": potassium,

                "status": potassium_status,

                "message": nutrient_message(
                    "Potassium",
                    potassium,
                    potassium_status
                ),

            },


            "moisture": {

                "value": moisture,

                "status": moisture_status_value,

                "message":
                    "Moisture value obtained from the matched soil dataset record.",

            },


            "humidity": {

                "value": humidity,

                "status": humidity_status_value,

                "message":
                    "Humidity value obtained from the matched soil dataset record.",

            },


            "temperature": {

                "value": temperature,

                "status": temperature_status_value,

                "message":
                    "Temperature value obtained from the matched soil dataset record.",

            },

        }


        # ====================================================
        # ALERTS
        # ====================================================

        alerts = []


        # Nitrogen
        if nitrogen < 30:

            alerts.append({

                "title":
                    "Nitrogen requires attention",

                "message":
                    "Nitrogen level is low. Crop growth may be limited.",

                "level":
                    "High",

            })


        elif nitrogen > 100:

            alerts.append({

                "title":
                    "Nitrogen level is high",

                "message":
                    "Avoid unnecessary additional nitrogen fertilizer application.",

                "level":
                    "Medium",

            })


        # Phosphorous
        if phosphorous < 30:

            alerts.append({

                "title":
                    "Phosphorous requires attention",

                "message":
                    "Phosphorous is low. Phosphorous supplementation may be required.",

                "level":
                    "High",

            })


        elif phosphorous > 100:

            alerts.append({

                "title":
                    "Phosphorous level is high",

                "message":
                    "Avoid unnecessary additional phosphorous application.",

                "level":
                    "Medium",

            })


        # Potassium
        if potassium < 30:

            alerts.append({

                "title":
                    "Potassium requires attention",

                "message":
                    "Potassium is low and may affect crop development.",

                "level":
                    "High",

            })


        elif potassium > 100:

            alerts.append({

                "title":
                    "Potassium level is high",

                "message":
                    "Avoid unnecessary additional potassium application.",

                "level":
                    "Medium",

            })


        # Moisture
        if moisture < 25:

            alerts.append({

                "title":
                    "Soil moisture is low",

                "message":
                    "Increase irrigation support and monitor soil moisture.",

                "level":
                    "High",

            })


        elif moisture > 75:

            alerts.append({

                "title":
                    "Soil moisture is high",

                "message":
                    "Improve drainage and avoid unnecessary irrigation.",

                "level":
                    "Medium",

            })


        # Humidity
        if humidity < 30:

            alerts.append({

                "title":
                    "Humidity is low",

                "message":
                    "Low humidity can increase crop water demand.",

                "level":
                    "Medium",

            })


        elif humidity > 80:

            alerts.append({

                "title":
                    "Humidity is high",

                "message":
                    "High humidity may increase fungal disease risk in some crops.",

                "level":
                    "Medium",

            })


        # Temperature
        if temperature > 35:

            alerts.append({

                "title":
                    "High temperature detected",

                "message":
                    "Monitor crop water demand and heat stress.",

                "level":
                    "Medium",

            })


        elif temperature < 10:

            alerts.append({

                "title":
                    "Low temperature detected",

                "message":
                    "Low temperature may slow crop development.",

                "level":
                    "Medium",

            })


        # ====================================================
        # RESPONSE
        # ====================================================

        return {

            "matched_record": {

                "temperature":
                    temperature,

                "humidity":
                    humidity,

                "moisture":
                    moisture,

                "soil_type":
                    soil_type,

                "crop_type":
                    crop_type,

                "nitrogen":
                    nitrogen,

                "potassium":
                    potassium,

                "phosphorous":
                    phosphorous,

                "fertilizer_name":
                    fertilizer_name,

            },


            "soil_health": {

                "score":
                    score,

                "status":
                    health_status,

            },


            "parameters":
                parameters,


            "fertilizer": {

                "name":
                    fertilizer_name,

                "fertilizer_name":
                    fertilizer_name,

                "message":
                    (
                        "The dataset indicates "
                        f"{fertilizer_name} as the fertilizer "
                        "associated with soil/crop conditions "
                        "similar to your input."
                    ),

            },


            "alerts":
                alerts,


            "match_info": {

                "message":
                    (
                        "Closest matching soil dataset record "
                        "was selected using crop type, soil type, "
                        "temperature and humidity."
                    ),

                "requested_temperature":
                    float(request.temperature),

                "requested_humidity":
                    float(request.humidity),

                "requested_soil_type":
                    request.soil_type,

                "requested_crop_type":
                    request.crop_type,

            },

        }


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except FileNotFoundError as error:

        print(
            "SOIL CSV ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


    except ValueError as error:

        print(
            "SOIL DATA ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


    except Exception as error:

        print(
            "SOIL ANALYSIS ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to analyze soil dataset: "
                + str(error)
            )
        )