from fastapi import FastAPI
from app.database.db import Base, engine

from app.models.user import User
from app.routers.users import router as user_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="1.0.0"
)

app.include_router(user_router)

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }