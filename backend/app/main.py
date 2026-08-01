from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import Base, engine
from app.models.user import User
from app.routers.users import router as user_router
from app.routers.prediction import router as prediction_router
from app.routers.dataset import router as dataset_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(prediction_router)
app.include_router(dataset_router)
@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}