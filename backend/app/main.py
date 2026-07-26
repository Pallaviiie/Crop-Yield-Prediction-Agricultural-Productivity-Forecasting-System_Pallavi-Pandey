from fastapi import FastAPI
from app.database.db import Base, engine

# Import models
from app.models.user import User

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }