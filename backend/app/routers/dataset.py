import pandas as pd
from fastapi import APIRouter, HTTPException

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


# ==========================================
# CROP YIELD DATASET
# ==========================================

@router.get("/crop")
def get_crop(limit: int = 20):

    if crop_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Crop dataset not available"
        )

    return crop_df.head(limit).fillna("").to_dict(
        orient="records"
    )


# ==========================================
# SOIL DATASET
# ==========================================

@router.get("/soil")
def get_soil(limit: int = 20):

    if soil_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Soil dataset not available"
        )

    return soil_df.head(limit).fillna("").to_dict(
        orient="records"
    )


# ==========================================
# RAINFALL DATASET
# ==========================================

@router.get("/rainfall")
def get_rainfall(limit: int = 20):

    if rainfall_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Rainfall dataset not available"
        )

    return rainfall_df.head(limit).fillna("").to_dict(
        orient="records"
    )


# ==========================================
# TEMPERATURE DATASET
# ==========================================

@router.get("/temperature")
def get_temperature(limit: int = 20):

    if temperature_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Temperature dataset not available"
        )

    return temperature_df.head(limit).fillna("").to_dict(
        orient="records"
    )


# ==========================================
# PESTICIDES DATASET
# ==========================================

@router.get("/pesticides")
def get_pesticides(limit: int = 20):

    if pesticide_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Pesticides dataset not available"
        )

    return pesticide_df.head(limit).fillna("").to_dict(
        orient="records"
    )

# ==========================================
# DATASET SUMMARY FOR DASHBOARD
# ==========================================

@router.get("/summary")
def get_dataset_summary():

    return {
        "crop_records": len(crop_df),
        "soil_records": len(soil_df),
        "rainfall_records": len(rainfall_df),
        "temperature_records": len(temperature_df),
        "pesticide_records": len(pesticide_df),
        "crop_columns": crop_df.columns.tolist(),
        "soil_columns": soil_df.columns.tolist(),
        "rainfall_columns": rainfall_df.columns.tolist(),
        "temperature_columns": temperature_df.columns.tolist(),
        "pesticide_columns": pesticide_df.columns.tolist(),
    }

@router.get("/analytics/crop")
def get_crop_analytics():

    if crop_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Crop dataset not available"
        )

    df = crop_df.copy()

    # Remove unnecessary CSV index column
    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])

    # Crop yield by crop type
    crop_yield = (
        df.groupby("Item")["hg/ha_yield"]
        .mean()
        .round(2)
        .sort_values(ascending=False)
        .reset_index()
    )

    # Yearly yield trend
    yearly_yield = (
        df.groupby("Year")["hg/ha_yield"]
        .mean()
        .round(2)
        .reset_index()
        .sort_values("Year")
    )

    return {
        "total_records": len(df),
        "total_crops": int(df["Item"].nunique()),
        "total_areas": int(df["Area"].nunique()),
        "average_yield": round(
            float(df["hg/ha_yield"].mean()),
            2
        ),
        "crop_yield": crop_yield.to_dict(
            orient="records"
        ),
        "yearly_yield": yearly_yield.to_dict(
            orient="records"
        ),
    }

@router.get("/analytics/soil")
def get_soil_analytics():

    if soil_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Soil dataset not available"
        )

    df = soil_df.copy()

    return {
        "total_records": len(df),

        "average_temperature": round(
            float(df["Temparature"].mean()),
            2
        ),

        "average_humidity": round(
            float(df["Humidity"].mean()),
            2
        ),

        "average_moisture": round(
            float(df["Moisture"].mean()),
            2
        ),

        "average_nitrogen": round(
            float(df["Nitrogen"].mean()),
            2
        ),

        "average_potassium": round(
            float(df["Potassium"].mean()),
            2
        ),

        "average_phosphorous": round(
            float(df["Phosphorous"].mean()),
            2
        ),

        "soil_types": (
            df["Soil Type"]
            .value_counts()
            .reset_index()
            .rename(
                columns={
                    "Soil Type": "soil_type",
                    "count": "count"
                }
            )
            .to_dict(orient="records")
        ),
    }

@router.get("/analytics/rainfall")
def get_rainfall_analytics():

    if rainfall_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Rainfall dataset not available"
        )

    df = rainfall_df.copy()

    # Average monthly rainfall
    monthly_columns = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
    ]

    monthly_rainfall = []

    for month in monthly_columns:

        monthly_rainfall.append({
            "month": month,
            "rainfall": round(
                float(df[month].mean()),
                2
            ),
        })

    # Average annual rainfall by subdivision
    subdivision_rainfall = (
        df.groupby("SUBDIVISION")["ANNUAL"]
        .mean()
        .round(2)
        .sort_values(ascending=False)
        .head(15)
        .reset_index()
    )

    return {
        "total_records": len(df),

        "average_annual_rainfall": round(
            float(df["ANNUAL"].mean()),
            2
        ),

        "monthly_rainfall": monthly_rainfall,

        "top_subdivisions": subdivision_rainfall.to_dict(
            orient="records"
        ),
    }

@router.get("/analytics/temperature")
def get_temperature_analytics():

    if temperature_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Temperature dataset not available"
        )

    df = temperature_df.copy()

    # Remove rows where temperature is missing
    df = df.dropna(
        subset=["AverageTemperature"]
    )

    # Convert date
    df["dt"] = pd.to_datetime(
        df["dt"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["dt"]
    )

    # Get year
    df["Year"] = df["dt"].dt.year

    yearly_temperature = (
        df.groupby("Year")["AverageTemperature"]
        .mean()
        .round(2)
        .reset_index()
        .sort_values("Year")
    )

    return {
        "total_records": len(df),

        "average_temperature": round(
            float(
                df["AverageTemperature"].mean()
            ),
            2
        ),

        "yearly_temperature": yearly_temperature.to_dict(
            orient="records"
        ),
    }

@router.get("/analytics/pesticides")
def get_pesticide_analytics():

    if pesticide_df.empty:
        raise HTTPException(
            status_code=404,
            detail="Pesticide dataset not available"
        )

    df = pesticide_df.copy()

    df["Value"] = pd.to_numeric(
        df["Value"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["Value"]
    )

    yearly_pesticides = (
        df.groupby("Year")["Value"]
        .sum()
        .round(2)
        .reset_index()
        .sort_values("Year")
    )

    top_areas = (
        df.groupby("Area")["Value"]
        .sum()
        .round(2)
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )

    return {
        "total_records": len(df),

        "average_pesticide_usage": round(
            float(df["Value"].mean()),
            2
        ),

        "yearly_pesticides": yearly_pesticides.to_dict(
            orient="records"
        ),

        "top_areas": top_areas.to_dict(
            orient="records"
        ),
    }