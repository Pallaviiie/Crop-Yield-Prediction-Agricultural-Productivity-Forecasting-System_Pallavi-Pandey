import pickle
from pathlib import Path

import pandas as pd
import numpy as np


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


# ============================================================
# LOAD RANDOM FOREST MODEL
# ============================================================

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)


# ============================================================
# LOAD ENCODERS AND METADATA
# ============================================================

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
# CONFIDENCE CALCULATION
# ============================================================

def calculate_prediction_confidence(model, X):
    """
    Estimate prediction confidence based on agreement
    between individual trees in a Random Forest.

    Returns a percentage between 0 and 99.
    """

    try:

        # ----------------------------------------------------
        # RANDOM FOREST / ENSEMBLE MODEL
        # ----------------------------------------------------

        if hasattr(model, "estimators_"):

            tree_predictions = np.array([
                estimator.predict(X)[0]
                for estimator in model.estimators_
            ])

            mean_prediction = np.mean(
                tree_predictions
            )

            std_prediction = np.std(
                tree_predictions
            )

            # Avoid division by zero
            if mean_prediction == 0:
                return 0.0

            # Coefficient of variation
            variation = (
                std_prediction
                / abs(mean_prediction)
            )

            # Convert variation to confidence
            confidence = (
                100 * np.exp(-variation)
            )

            return round(
                float(
                    np.clip(
                        confidence,
                        0,
                        99
                    )
                ),
                2
            )


        # ----------------------------------------------------
        # FALLBACK FOR OTHER MODELS
        # ----------------------------------------------------

        if R2_SCORE is not None:

            confidence = (
                float(R2_SCORE) * 100
            )

            return round(
                float(
                    np.clip(
                        confidence,
                        0,
                        99
                    )
                ),
                2
            )


        return 0.0


    except Exception as e:

        print(
            "Confidence calculation error:",
            repr(e)
        )

        return 0.0


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

    Returns:
        predicted_yield, confidence
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


    # Prevent negative yield
    predicted_yield = max(
        float(prediction),
        0.0
    )


    # --------------------------------------------------------
    # CALCULATE CONFIDENCE
    # --------------------------------------------------------

    confidence = calculate_prediction_confidence(
        model,
        input_data
    )


    # --------------------------------------------------------
    # RETURN BOTH VALUES
    # --------------------------------------------------------

    return predicted_yield, confidence


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