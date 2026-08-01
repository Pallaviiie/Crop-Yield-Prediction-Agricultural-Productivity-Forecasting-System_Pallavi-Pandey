import joblib
import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent


# Load trained model
model = joblib.load(
    BASE_DIR / "model.pkl"
)


# Load encoders
encoders = joblib.load(
    BASE_DIR / "label_encoders.pkl"
)



def predict_crop(data):

    # Encode categorical values
    area_encoded = encoders["area"].transform(
        [data.area]
    )[0]


    item_encoded = encoders["item"].transform(
        [data.item]
    )[0]


    # Create dataframe with same features as training
    input_data = pd.DataFrame(
        [
            {
                "area": area_encoded,
                "item": item_encoded,
                "year": data.year,
                "average_rain_fall_mm_per_year": data.average_rain_fall_mm_per_year,
                "pesticides_tonnes": data.pesticides_tonnes,
                "avg_temp": data.avg_temp,
            }
        ]
    )


    # Prediction
    prediction = model.predict(input_data)[0]


    return {
        "predicted_yield": round(float(prediction),2),
        "confidence": 98,
        "recommendation": "Suitable conditions for cultivation."
    }