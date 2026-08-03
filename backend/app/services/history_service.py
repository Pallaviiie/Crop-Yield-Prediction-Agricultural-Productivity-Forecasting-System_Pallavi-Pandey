from sqlalchemy.orm import Session
from app.models.prediction_history import PredictionHistory


# ----------------------------
# Save Prediction
# ----------------------------
def save_prediction(db: Session, prediction_data: dict):
    history = PredictionHistory(
        user_id=prediction_data["user_id"],
        area=prediction_data["area"],
        crop=prediction_data["crop"],
        year=prediction_data["year"],
        rainfall=prediction_data["rainfall"],
        temperature=prediction_data["temperature"],
        humidity=prediction_data["humidity"],
        wind_speed=prediction_data["wind_speed"],
        pesticides=prediction_data["pesticides"],
        predicted_yield=prediction_data["predicted_yield"],
        recommendation=prediction_data["recommendation"],
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


# ----------------------------
# Get All Predictions
# ----------------------------
def get_prediction_history(db: Session):
    return (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.created_at.desc())
        .all()
    )


# ----------------------------
# Get Prediction by ID
# ----------------------------
def get_prediction_by_id(db: Session, prediction_id: int):
    return (
        db.query(PredictionHistory)
        .filter(PredictionHistory.id == prediction_id)
        .first()
    )


# ----------------------------
# Delete Prediction
# ----------------------------
def delete_prediction(db: Session, prediction_id: int):
    prediction = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.id == prediction_id)
        .first()
    )

    if prediction:
        db.delete(prediction)
        db.commit()
        return True

    return False


# ----------------------------
# Search by Crop
# ----------------------------
def search_prediction(db: Session, crop: str):
    return (
        db.query(PredictionHistory)
        .filter(PredictionHistory.crop.ilike(f"%{crop}%"))
        .order_by(PredictionHistory.created_at.desc())
        .all()
    )


# ----------------------------
# Filter by Area
# ----------------------------
def filter_by_area(db: Session, area: str):
    return (
        db.query(PredictionHistory)
        .filter(PredictionHistory.area.ilike(f"%{area}%"))
        .order_by(PredictionHistory.created_at.desc())
        .all()
    )