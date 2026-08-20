import pickle
from pathlib import Path

import pandas as pd


# ============================================================
# PATHS
# ============================================================

# Current directory:
# backend/app/ml/

ML_DIR = Path(__file__).resolve().parent

MODEL_PATH = ML_DIR / "model.pkl"

ENCODER_PATH = ML_DIR / "label_encoders.pkl"


# ============================================================
# LOAD MODEL AND METADATA
# ============================================================

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"ML model not found at:\n{MODEL_PATH}\n\n"
        "Please train the model first using:\n"
        "python -m app.ml.train_model"
    )


if not ENCODER_PATH.exists():
    raise FileNotFoundError(
        f"Label encoder file not found at:\n{ENCODER_PATH}\n\n"
        "Please train the model first using:\n"
        "python -m app.ml.train_model"
    )


# Load Random Forest model
with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)


# Load encoders and metadata
with open(ENCODER_PATH, "rb") as file:
    model_metadata = pickle.load(file)


# ============================================================
# GET ENCODERS
# ============================================================

encoders = model_metadata.get("encoders", {})

if "Area" not in encoders:
    raise ValueError(
        "Area encoder is missing from label_encoders.pkl"
    )

if "Item" not in encoders:
    raise ValueError(
        "Item encoder is missing from label_encoders.pkl"
    )


area_encoder = encoders["Area"]

item_encoder = encoders["Item"]


# ============================================================
# FEATURE ORDER
# ============================================================

feature_columns = model_metadata.get(
    "feature_columns",
    [
        "Area",
        "Item",
        "Year",
        "average_rain_fall_mm_per_year",
        "pesticides_tonnes",
        "avg_temp",
    ],
)


# ============================================================
# MODEL INFORMATION
# ============================================================

MODEL_TYPE = model_metadata.get(
    "model_type",
    "RandomForestRegressor"
)

R2_SCORE = model_metadata.get(
    "r2_score",
    None
)


# ============================================================
# PREDICT CROP YIELD
# ============================================================

def predict_crop(
    area: str,
    item: str,
    year: int,
    average_rain_fall_mm_per_year: float,
    pesticides_tonnes: float,
    avg_temp: float,
):
    """
    Predict crop yield using the trained
    Random Forest Regression model.
    """

    # --------------------------------------------------------
    # CLEAN INPUT
    # --------------------------------------------------------

    area = str(area).strip()
    item = str(item).strip()

    # --------------------------------------------------------
    # VALIDATE AREA
    # --------------------------------------------------------

    if area not in area_encoder.classes_:

        raise ValueError(
            f"Area '{area}' is not available in "
            "the trained dataset."
        )

    # --------------------------------------------------------
    # VALIDATE CROP
    # --------------------------------------------------------

    if item not in item_encoder.classes_:

        raise ValueError(
            f"Crop '{item}' is not available in "
            "the trained dataset."
        )

    # --------------------------------------------------------
    # ENCODE AREA
    # --------------------------------------------------------

    area_encoded = area_encoder.transform(
        [area]
    )[0]

    # --------------------------------------------------------
    # ENCODE CROP
    # --------------------------------------------------------

    item_encoded = item_encoder.transform(
        [item]
    )[0]

    # --------------------------------------------------------
    # CREATE INPUT DATAFRAME
    # --------------------------------------------------------

    input_data = pd.DataFrame(
        [
            [
                area_encoded,
                item_encoded,
                year,
                average_rain_fall_mm_per_year,
                pesticides_tonnes,
                avg_temp,
            ]
        ],
        columns=feature_columns,
    )

    # --------------------------------------------------------
    # MAKE PREDICTION
    # --------------------------------------------------------

    prediction = model.predict(
        input_data
    )[0]

    # --------------------------------------------------------
    # PREVENT NEGATIVE YIELD
    # --------------------------------------------------------

    prediction = max(
        0.0,
        float(prediction)
    )

    return prediction


# ============================================================
# GET MODEL INFORMATION
# ============================================================

def get_model_info():
    """
    Returns information about the trained ML model.
    """

    return {
        "model_type": MODEL_TYPE,
        "r2_score": R2_SCORE,
        "feature_columns": feature_columns,
    }


# ============================================================
# GET AVAILABLE AREAS
# ============================================================

def get_available_areas():
    """
    Returns all areas/countries available
    in the training dataset.
    """

    return sorted(
        [
            str(value)
            for value in area_encoder.classes_
        ]
    )


# ============================================================
# GET AVAILABLE CROPS
# ============================================================

def get_available_crops():
    """
    Returns all crops available
    in the training dataset.
    """

    return sorted(
        [
            str(value)
            for value in item_encoder.classes_
        ]
    )