import joblib

encoders = joblib.load("app/ml/label_encoders.pkl")

print(type(encoders))
print(encoders.keys())
