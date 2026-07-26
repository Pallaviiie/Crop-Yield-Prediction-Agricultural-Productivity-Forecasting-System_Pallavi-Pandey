from fastapi import FastAPI

app = FastAPI(
    title="Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Crop Yield Prediction & Agricultural Productivity Forecasting System"
    }