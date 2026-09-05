# ============================================================
# app/routers/prediction_reviews.py
# ============================================================

from datetime import datetime
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user import User
from app.models.conversation import Conversation
from app.models.prediction_history import PredictionHistory
from app.models.prediction_review import PredictionReview

from app.routers.users import get_authenticated_user


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/prediction-reviews",
    tags=["Prediction Reviews"],
)


# ============================================================
# CONSULTANT CHECK
# ============================================================

def require_consultant(current_user: User):

    if not current_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    if current_user.role != "consultant":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consultant access required",
        )

    return current_user


# ============================================================
# REVIEW SCHEMA
# ============================================================

class PredictionReviewRequest(BaseModel):

    status: str

    comment: Optional[str] = None


# ============================================================
# GET MANAGED FARMER IDS
# ============================================================

def get_managed_farmer_ids(
    db: Session,
    consultant_id: int,
):

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id == consultant_id
        )
        .all()
    )

    farmer_ids = list(
        {
            conversation.farmer_id
            for conversation in conversations
            if conversation.farmer_id
        }
    )

    return farmer_ids


# ============================================================
# FARMER NAME
# ============================================================

def get_farmer_name(farmer):

    if not farmer:

        return "Unknown Farmer"

    return (
        getattr(
            farmer,
            "full_name",
            None,
        )
        or getattr(
            farmer,
            "name",
            None,
        )
        or getattr(
            farmer,
            "email",
            None,
        )
        or "Unknown Farmer"
    )


# ============================================================
# PREDICTION RESPONSE
# ============================================================

def prediction_response(
    prediction,
    farmer,
    review=None,
):

    return {

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        "id": prediction.id,

        "prediction_id": prediction.id,

        "farmer_id": prediction.user_id,

        "farmer_name": get_farmer_name(farmer),

        "farmer_email": (
            farmer.email
            if farmer
            else None
        ),

        "area": prediction.area,

        "crop": prediction.crop,

        "year": prediction.year,

        "season": prediction.season,

        "rainfall": prediction.rainfall,

        "temperature": prediction.temperature,

        "humidity": prediction.humidity,

        "wind_speed": prediction.wind_speed,

        "pesticides": prediction.pesticides,

        "predicted_yield": prediction.predicted_yield,

        "recommendation": prediction.recommendation,

        "category": prediction.category,

        "confidence": prediction.confidence,

        "created_at": (
            prediction.created_at.isoformat()
            if prediction.created_at
            else None
        ),

        # ----------------------------------------------------
        # Review
        # ----------------------------------------------------

        "review": {

            "id": review.id
            if review
            else None,

            "status": (
                review.status
                if review
                else "pending"
            ),

            "comment": (
                review.comment
                if review
                else None
            ),

            "created_at": (
                review.created_at.isoformat()
                if review
                and review.created_at
                else None
            ),

            "updated_at": (
                review.updated_at.isoformat()
                if review
                and review.updated_at
                else None
            ),

            "reviewed_at": (
                review.reviewed_at.isoformat()
                if review
                and review.reviewed_at
                else None
            ),
        },
    }


# ============================================================
# GET ALL PREDICTIONS FOR REVIEW
# ============================================================

@router.get("/")
def get_prediction_reviews(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    require_consultant(current_user)

    # ========================================================
    # MANAGED FARMERS
    # ========================================================

    farmer_ids = get_managed_farmer_ids(
        db,
        current_user.id,
    )

    # No managed farmers
    if not farmer_ids:

        return {
            "success": True,
            "predictions": [],
            "summary": {
                "total": 0,
                "pending": 0,
                "approved": 0,
                "needs_changes": 0,
                "rejected": 0,
            },
        }

    # ========================================================
    # PREDICTIONS
    # ========================================================

    predictions = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.user_id.in_(
                farmer_ids
            )
        )
        .order_by(
            PredictionHistory.created_at.desc()
        )
        .all()
    )

    # ========================================================
    # FARMERS
    # ========================================================

    farmers = (
        db.query(User)
        .filter(
            User.id.in_(farmer_ids)
        )
        .all()
    )

    farmer_lookup = {
        farmer.id: farmer
        for farmer in farmers
    }

    # ========================================================
    # EXISTING REVIEWS
    # ========================================================

    prediction_ids = [
        prediction.id
        for prediction in predictions
    ]

    reviews = []

    if prediction_ids:

        reviews = (
            db.query(PredictionReview)
            .filter(
                PredictionReview.consultant_id
                == current_user.id,

                PredictionReview.prediction_id.in_(
                    prediction_ids
                ),
            )
            .all()
        )

    review_lookup = {
        review.prediction_id: review
        for review in reviews
    }

    # ========================================================
    # RESPONSE
    # ========================================================

    result = []

    summary = {
        "total": 0,
        "pending": 0,
        "approved": 0,
        "needs_changes": 0,
        "rejected": 0,
    }

    for prediction in predictions:

        review = review_lookup.get(
            prediction.id
        )

        item = prediction_response(
            prediction,
            farmer_lookup.get(
                prediction.user_id
            ),
            review,
        )

        result.append(item)

        review_status = (
            review.status
            if review
            else "pending"
        )

        summary["total"] += 1

        if review_status in summary:

            summary[review_status] += 1

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "success": True,

        "predictions": result,

        "summary": summary,
    }


# ============================================================
# GET ONE PREDICTION
# ============================================================

@router.get("/{prediction_id}")
def get_prediction_for_review(

    prediction_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    require_consultant(current_user)

    # ========================================================
    # MANAGED FARMERS
    # ========================================================

    farmer_ids = get_managed_farmer_ids(
        db,
        current_user.id,
    )

    # ========================================================
    # FIND PREDICTION
    # ========================================================

    prediction = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.id == prediction_id,

            PredictionHistory.user_id.in_(
                farmer_ids
            ),
        )
        .first()
    )

    if not prediction:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found or not accessible",
        )

    # ========================================================
    # FARMER
    # ========================================================

    farmer = (
        db.query(User)
        .filter(
            User.id == prediction.user_id
        )
        .first()
    )

    # ========================================================
    # REVIEW
    # ========================================================

    review = (
        db.query(PredictionReview)
        .filter(
            PredictionReview.prediction_id
            == prediction.id,

            PredictionReview.consultant_id
            == current_user.id,
        )
        .first()
    )

    return {

        "success": True,

        "prediction": prediction_response(
            prediction,
            farmer,
            review,
        ),
    }


# ============================================================
# CREATE / UPDATE REVIEW
# ============================================================

@router.put("/{prediction_id}/review")
def review_prediction(

    prediction_id: int,

    review_data: PredictionReviewRequest,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    require_consultant(current_user)

    # ========================================================
    # VALID STATUSES
    # ========================================================

    valid_statuses = {
        "pending",
        "approved",
        "needs_changes",
        "rejected",
    }

    review_status = (
        review_data.status
        .strip()
        .lower()
    )

    if review_status not in valid_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid review status. "
                "Use pending, approved, "
                "needs_changes or rejected."
            ),
        )

    # ========================================================
    # MANAGED FARMERS
    # ========================================================

    farmer_ids = get_managed_farmer_ids(
        db,
        current_user.id,
    )

    # ========================================================
    # FIND PREDICTION
    # ========================================================

    prediction = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.id == prediction_id,

            PredictionHistory.user_id.in_(
                farmer_ids
            ),
        )
        .first()
    )

    if not prediction:

        raise HTTPException(
            status_code=404,
            detail=(
                "Prediction not found "
                "or you do not have access "
                "to review it."
            ),
        )

    # ========================================================
    # FIND EXISTING REVIEW
    # ========================================================

    review = (
        db.query(PredictionReview)
        .filter(
            PredictionReview.prediction_id
            == prediction_id,

            PredictionReview.consultant_id
            == current_user.id,
        )
        .first()
    )

    # ========================================================
    # CREATE
    # ========================================================

    if not review:

        review = PredictionReview(

            prediction_id=prediction_id,

            consultant_id=current_user.id,

            status=review_status,

            comment=(
                review_data.comment.strip()
                if review_data.comment
                else None
            ),

            reviewed_at=(
                datetime.utcnow()
                if review_status != "pending"
                else None
            ),
        )

        db.add(review)

    # ========================================================
    # UPDATE
    # ========================================================

    else:

        review.status = review_status

        review.comment = (
            review_data.comment.strip()
            if review_data.comment
            else None
        )

        review.reviewed_at = (
            datetime.utcnow()
            if review_status != "pending"
            else None
        )

    # ========================================================
    # SAVE
    # ========================================================

    db.commit()

    db.refresh(review)

    # ========================================================
    # FARMER
    # ========================================================

    farmer = (
        db.query(User)
        .filter(
            User.id == prediction.user_id
        )
        .first()
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "success": True,

        "message": (
            "Prediction review saved successfully"
        ),

        "prediction": prediction_response(
            prediction,
            farmer,
            review,
        ),
    }


# ============================================================
# DELETE REVIEW
# ============================================================

@router.delete("/{prediction_id}/review")
def delete_prediction_review(

    prediction_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    require_consultant(current_user)

    # ========================================================
    # FIND REVIEW
    # ========================================================

    review = (
        db.query(PredictionReview)
        .filter(
            PredictionReview.prediction_id
            == prediction_id,

            PredictionReview.consultant_id
            == current_user.id,
        )
        .first()
    )

    if not review:

        raise HTTPException(
            status_code=404,
            detail="Review not found",
        )

    # ========================================================
    # DELETE
    # ========================================================

    db.delete(review)

    db.commit()

    return {

        "success": True,

        "message": "Prediction review removed",
    }