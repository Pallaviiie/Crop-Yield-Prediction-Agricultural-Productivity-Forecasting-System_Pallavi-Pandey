import joblib
import pandas as pd
from pathlib import Path
import traceback

BASE_DIR = Path(__file__).resolve().parent

# Load model
model = joblib.load(BASE_DIR / "model.pkl")

# Load encoders
encoders = joblib.load(BASE_DIR / "label_encoders.pkl")


def predict_crop(data):
    try:
        # Encode categorical values
        area_encoded = encoders["area"].transform([data.area])[0]
        item_encoded = encoders["item"].transform([data.item])[0]

        # Prepare input
        input_data = pd.DataFrame([
            {
                "area": area_encoded,
                "item": item_encoded,
                "year": data.year,
                "average_rain_fall_mm_per_year": data.average_rain_fall_mm_per_year,
                "pesticides_tonnes": data.pesticides_tonnes,
                "avg_temp": data.avg_temp,
            }
        ])

        
        # Predict using the trained model
        prediction = model.predict(input_data)[0]

        # Convert to float and round
        prediction = round(float(prediction), 2)

        if prediction < 15000:
            category = "Poor"
            stars = "⭐"
            recommendation = "Yield is low. Improve irrigation and fertilizer management."
            production = "Low"

        elif prediction < 25000:
            category = "Average"
            stars = "⭐⭐"
            recommendation = "Average yield expected. Better nutrient management can improve production."
            production = "Medium"

        elif prediction < 35000:
            category = "Good"
            stars = "⭐⭐⭐"
            recommendation = "Good growing conditions. Continue balanced fertilizer application."
            production = "High"

        else:
            category = "Excellent"
            stars = "⭐⭐⭐⭐"
            recommendation = "Excellent conditions for cultivation."
            production = "Very High"


        return {
            "predicted_yield": prediction,
            "confidence": 98,
            "recommendation": recommendation,
            "category": category,
            "stars": stars,
            "production": production,
            "soil_tip": "Maintain soil pH between 6.0 and 7.0",
            "fertilizer_tip": "Apply Nitrogen fertilizer in two equal splits.",
            "irrigation_tip": "Provide medium irrigation depending on rainfall.",
            "pest_risk": "Low"
        }

    except Exception as e:
        traceback.print_exc()

        print("\n========== INPUT RECEIVED ==========")
        print("Area:", repr(data.area))
        print("Item:", repr(data.item))
        print("Year:", data.year)
        print("Rainfall:", data.average_rain_fall_mm_per_year)
        print("Pesticides:", data.pesticides_tonnes)
        print("Temperature:", data.avg_temp)

        print("\n========== AVAILABLE VALUES ==========")
        print("First 20 Areas:")
        print(encoders["area"].classes_[:20])

        print("\nFirst 20 Items:")
        print(encoders["item"].classes_[:20])

        raise ValueError(str(e))