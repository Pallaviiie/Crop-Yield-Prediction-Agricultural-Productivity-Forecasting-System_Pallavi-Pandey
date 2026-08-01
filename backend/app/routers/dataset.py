from fastapi import APIRouter
from app.dataset_loader import (
    crop_df,
    soil_df,
    rainfall_df,
    temperature_df,
    pesticide_df,
)

router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.get("/crop")
def get_crop():
    return crop_df.head(20).to_dict(orient="records")


@router.get("/soil")
def get_soil():
    return soil_df.head(20).to_dict(orient="records")


@router.get("/rainfall")
def get_rainfall():
    return rainfall_df.head(20).to_dict(orient="records")


@router.get("/temperature")
def get_temperature():
    df = temperature_df.fillna("")
    return df.head(20).to_dict(orient="records")


@router.get("/pesticides")
def get_pesticides():
    return pesticide_df.head(20).to_dict(orient="records")