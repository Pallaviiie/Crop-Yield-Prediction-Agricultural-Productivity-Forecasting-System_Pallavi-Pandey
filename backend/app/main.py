from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.db import Base, engine


# ============================================================
# MODELS
# ============================================================
# Import ALL active models before create_all()

from app.models.user import User
from app.models.prediction_history import PredictionHistory
from app.models.conversation import Conversation
from app.models.message import Message


# ============================================================
# ROUTERS
# ============================================================

from app.routers import soil
from app.routers.users import router as user_router
from app.routers.google_auth import router as google_auth_router
from app.routers.prediction import router as prediction_router
from app.routers.dataset import router as dataset_router
from app.routers.weather import router as weather_router
from app.routers.chat import router as chat_router
from app.routers import consultant
from app.routers.analytics import router as analytics_router
from app.routers import recommendation
from app.routers.reports import router as reports_router
from app.routers import risk_assessment



# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# APPLICATION
# ============================================================

app = FastAPI(
    title="YieldSense AI",
    description=(
        "AI-powered agricultural system for crop yield "
        "prediction, weather information and productivity analysis."
    ),
    version="1.0.0",
)


# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(user_router)
app.include_router(google_auth_router)
app.include_router(prediction_router)
app.include_router(dataset_router)
app.include_router(weather_router)
app.include_router(soil.router)
app.include_router(chat_router)
app.include_router(consultant.router)
app.include_router(analytics_router)
app.include_router(recommendation.router)
app.include_router(reports_router)
app.include_router(risk_assessment.router)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully",
        "status": "online",
        "service": "YieldSense AI",
        "version": "1.0.0",
    }