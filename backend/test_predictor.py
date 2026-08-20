from app.ml.predictor import predict_crop_yield


prediction = predict_crop_yield(
    area="Albania",
    item="Maize",
    year=2024,
    average_rain_fall_mm_per_year=1485.0,
    pesticides_tonnes=121.0,
    avg_temp=16.37
)


print("\n========== PREDICTION RESULT ==========")
print(f"Predicted Crop Yield: {prediction:.2f} hg/ha")
print("=======================================\n")