import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

# -------------------------
# Load Dataset
# -------------------------

df = pd.read_csv("datasets/crop_yield.csv")

print(df.head())

# -------------------------
# Rename Columns
# -------------------------

df.columns = [
    c.strip().lower().replace(" ", "_")
    for c in df.columns
]

print(df.columns)

# -------------------------
# Encode Categorical Columns
# -------------------------

encoders = {}

for col in ["area", "item"]:

    le = LabelEncoder()

    df[col] = le.fit_transform(df[col])

    encoders[col] = le

# -------------------------
# Features
# -------------------------

X = df[
    [
        "area",
        "item",
        "year",
        "average_rain_fall_mm_per_year",
        "pesticides_tonnes",
        "avg_temp",
    ]
]

# -------------------------
# Target
# -------------------------

y = df["hg/ha_yield"]

# -------------------------
# Train Test Split
# -------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# -------------------------
# Random Forest
# -------------------------

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
)

model.fit(X_train, y_train)

prediction = model.predict(X_test)

print("Accuracy:", r2_score(y_test, prediction))

# -------------------------
# Save Model
# -------------------------

joblib.dump(model, "app/ml/model.pkl")

joblib.dump(encoders, "app/ml/label_encoders.pkl")

print("Model Saved Successfully")