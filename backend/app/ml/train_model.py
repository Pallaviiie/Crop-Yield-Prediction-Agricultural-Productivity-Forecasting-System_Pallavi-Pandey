import pandas as pd
import pickle
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


# ============================================================
# PATHS
# ============================================================

# Current file:
# backend/app/ml/train_model.py

CURRENT_FILE = Path(__file__).resolve()

# backend/
BASE_DIR = CURRENT_FILE.parent.parent.parent

# Dataset:
# backend/datasets/crop_yield.csv
DATASET_PATH = BASE_DIR / "datasets" / "crop_yield.csv"

# ML directory:
# backend/app/ml/
ML_DIR = CURRENT_FILE.parent

# Saved Random Forest model
MODEL_PATH = ML_DIR / "model.pkl"

# Saved encoders and metadata
ENCODER_PATH = ML_DIR / "label_encoders.pkl"


# ============================================================
# LOAD DATASET
# ============================================================

print("\n=======================================")
print("   CROP YIELD ML MODEL TRAINING")
print("=======================================\n")

print("Loading dataset...")

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found at:\n{DATASET_PATH}"
    )

df = pd.read_csv(DATASET_PATH)

print("\nDataset loaded successfully!")
print("Original shape:", df.shape)


# ============================================================
# CLEAN COLUMN NAMES
# ============================================================

df.columns = df.columns.str.strip()

print("\nDataset columns:")
print(df.columns.tolist())


# ============================================================
# REMOVE UNNECESSARY COLUMN
# ============================================================

if "Unnamed: 0" in df.columns:

    df = df.drop(
        columns=["Unnamed: 0"]
    )

    print(
        "\nRemoved unnecessary "
        "'Unnamed: 0' column."
    )


# ============================================================
# CHECK MISSING VALUES
# ============================================================

print("\nMissing values before cleaning:")
print(df.isnull().sum())


# Remove rows containing missing values
df = df.dropna().reset_index(drop=True)

print(
    "\nShape after removing "
    f"missing values: {df.shape}"
)


# ============================================================
# FEATURE COLUMNS
# ============================================================

FEATURE_COLUMNS = [
    "Area",
    "Item",
    "Year",
    "average_rain_fall_mm_per_year",
    "pesticides_tonnes",
    "avg_temp"
]


# Target column
TARGET_COLUMN = "hg/ha_yield"


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = (
    FEATURE_COLUMNS + [TARGET_COLUMN]
)

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:

    raise ValueError(
        "The following required columns "
        f"are missing from the dataset:\n"
        f"{missing_columns}"
    )


# ============================================================
# FEATURES AND TARGET
# ============================================================

X = df[FEATURE_COLUMNS].copy()

y = df[TARGET_COLUMN].copy()


print("\nFeatures selected:")
for feature in FEATURE_COLUMNS:
    print(f"  - {feature}")

print(f"\nTarget variable:")
print(f"  - {TARGET_COLUMN}")


# ============================================================
# ENCODE CATEGORICAL FEATURES
# ============================================================

label_encoders = {}


for column in ["Area", "Item"]:

    print(
        f"\nEncoding categorical feature: "
        f"{column}"
    )

    encoder = LabelEncoder()

    X[column] = encoder.fit_transform(
        X[column].astype(str)
    )

    label_encoders[column] = encoder


print(
    "\nCategorical features encoded "
    "successfully!"
)


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)


print("\n=======================================")
print("DATA SPLIT")
print("=======================================")

print(
    "Training data shape:",
    X_train.shape
)

print(
    "Testing data shape:",
    X_test.shape
)


# ============================================================
# CREATE RANDOM FOREST MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=50,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# TRAIN MODEL
# ============================================================

print("\n=======================================")
print("TRAINING RANDOM FOREST MODEL")
print("=======================================\n")

model.fit(
    X_train,
    y_train
)

print(
    "Random Forest model "
    "training completed successfully!"
)


# ============================================================
# MAKE PREDICTIONS
# ============================================================

print("\nGenerating predictions...")

y_pred = model.predict(X_test)


# ============================================================
# MODEL EVALUATION
# ============================================================

mae = mean_absolute_error(
    y_test,
    y_pred
)

mse = mean_squared_error(
    y_test,
    y_pred
)

rmse = mse ** 0.5

r2 = r2_score(
    y_test,
    y_pred
)


# ============================================================
# DISPLAY MODEL PERFORMANCE
# ============================================================

print("\n=======================================")
print("       RANDOM FOREST PERFORMANCE")
print("=======================================\n")

print(f"MAE       : {mae:.2f}")
print(f"MSE       : {mse:.2f}")
print(f"RMSE      : {rmse:.2f}")
print(f"R² Score  : {r2:.4f}")

print(
    f"\nR² Percentage: {r2 * 100:.2f}%"
)

print("\n=======================================")


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

print("\nFeature Importance:")

feature_importance = pd.DataFrame({
    "Feature": FEATURE_COLUMNS,
    "Importance": model.feature_importances_
})

feature_importance = (
    feature_importance
    .sort_values(
        by="Importance",
        ascending=False
    )
)

print(
    feature_importance.to_string(
        index=False
    )
)


# ============================================================
# SAVE RANDOM FOREST MODEL
# ============================================================

print("\nSaving Random Forest model...")

with open(
    MODEL_PATH,
    "wb"
) as file:

    pickle.dump(
        model,
        file
    )


# ============================================================
# SAVE ENCODERS + MODEL METADATA
# ============================================================

model_metadata = {

    "encoders": label_encoders,

    "feature_columns": FEATURE_COLUMNS,

    "target_column": TARGET_COLUMN,

    "model_type": "RandomForestRegressor",

    "n_estimators": 200,

    "test_size": 0.20,

    "random_state": 42,

    "mae": float(mae),

    "mse": float(mse),

    "rmse": float(rmse),

    "r2_score": float(r2)
}


with open(
    ENCODER_PATH,
    "wb"
) as file:

    pickle.dump(
        model_metadata,
        file
    )


# ============================================================
# FINAL SUCCESS MESSAGE
# ============================================================

print("\n=======================================")
print("       MODEL SAVED SUCCESSFULLY")
print("=======================================\n")

print("Model saved at:")
print(MODEL_PATH)

print("\nEncoders and metadata saved at:")
print(ENCODER_PATH)

print(
    f"\nFinal R² Score: "
    f"{r2:.4f}"
)

print(
    f"Equivalent R² percentage: "
    f"{r2 * 100:.2f}%"
)

print("\nTraining completed successfully!")
print("=======================================\n")
