# ============================================================
# app/routers/consultant.py
# ============================================================

from collections import Counter
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database.db import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.prediction_history import PredictionHistory
from app.models.note import Note
from app.routers.users import get_authenticated_user


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/consultant",
    tags=["Consultant"]
)


# ============================================================
# CONSULTANT CHECK
# ============================================================

def require_consultant(current_user: User):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    if current_user.role != "consultant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consultant access required"
        )

    return current_user


# ============================================================
# FARMER RESPONSE
# ============================================================

def farmer_response(farmer):

    primary_crops = getattr(
        farmer,
        "primary_crops",
        None
    )

    # Convert crop list/string into a clean response
    if isinstance(primary_crops, list):
        crops = primary_crops

    elif isinstance(primary_crops, str):
        crops = [
            crop.strip()
            for crop in primary_crops.replace(";", ",").split(",")
            if crop.strip()
        ]

    else:
        crops = []

    return {
        "id": farmer.id,
        "user_id": farmer.id,

        "name": getattr(
            farmer,
            "full_name",
            None
        ) or getattr(
            farmer,
            "name",
            None
        ) or "Unknown Farmer",

        "full_name": getattr(
            farmer,
            "full_name",
            None
        ) or "Unknown Farmer",

        "email": getattr(
            farmer,
            "email",
            None
        ),

        "location": getattr(
            farmer,
            "location",
            None
        ) or getattr(
            farmer,
            "address",
            None
        ),

        "farm_size": getattr(
            farmer,
            "farm_size",
            None
        ) or getattr(
            farmer,
            "farm_area",
            None
        ),

        "crops": crops,

        "primary_crops": crops,

        "created_at": (
            farmer.created_at.isoformat()
            if getattr(farmer, "created_at", None)
            else None
        ),

        "status": "active"
    }


# ============================================================
# GET ALL FARMERS
# ============================================================

@router.get("/farmers")
def get_consultant_farmers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):

    require_consultant(current_user)

    farmers = (
        db.query(User)
        .filter(User.role == "farmer")
        .order_by(User.created_at.desc())
        .all()
    )

    return {
        "success": True,
        "farmers": [
            farmer_response(farmer)
            for farmer in farmers
        ]
    }
# ============================================================
# NOTE SCHEMAS
# ============================================================

class NoteCreate(BaseModel):
    title: str
    content: str


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
# ============================================================
# CONSULTANT DASHBOARD
# ============================================================

@router.get("/dashboard")
def consultant_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):

    require_consultant(current_user)

    # --------------------------------------------------------
    # Managed farmers
    # --------------------------------------------------------

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id == current_user.id
        )
        .all()
    )

    farmer_ids = list({
        conversation.farmer_id
        for conversation in conversations
        if conversation.farmer_id
    })

    total_farmers = len(farmer_ids)

    # --------------------------------------------------------
    # Active consultations
    # --------------------------------------------------------

    active_consultations = sum(
        1
        for conversation in conversations
        if getattr(conversation, "status", "active") == "active"
    )

    # --------------------------------------------------------
    # Unread messages
    # --------------------------------------------------------

    # Count unread messages from farmers in this consultant's conversations
    unread_messages = 0

    for conversation in conversations:
        unread_messages += (
           db.query(Message)
           .filter(
               Message.conversation_id == conversation.id,
               Message.sender_id != current_user.id,
               Message.is_read == False
            )
           .count()
        )

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    prediction_query = db.query(
        PredictionHistory
    )

    if farmer_ids:
        prediction_query = prediction_query.filter(
            PredictionHistory.user_id.in_(farmer_ids)
        )
    else:
        prediction_query = prediction_query.filter(False)

    predictions = (
        prediction_query
        .order_by(PredictionHistory.created_at.asc())
        .all()
    )

    # --------------------------------------------------------
    # Weekly predictions
    # --------------------------------------------------------

    today = datetime.utcnow().date()

    start_of_week = (
        today - timedelta(days=today.weekday())
    )

    weekly_predictions = {
        "Mon": 0,
        "Tue": 0,
        "Wed": 0,
        "Thu": 0,
        "Fri": 0,
        "Sat": 0,
        "Sun": 0,
    }

    for prediction in predictions:

        if not prediction.created_at:
            continue

        prediction_date = prediction.created_at.date()

        if prediction_date >= start_of_week:

            day_name = prediction_date.strftime("%a")

            if day_name in weekly_predictions:
                weekly_predictions[day_name] += 1

    # --------------------------------------------------------
    # Return
    # --------------------------------------------------------

    return {
        "success": True,

        "consultant": {
            "id": current_user.id,
            "name": getattr(
                current_user,
                "full_name",
                None
            ) or "Consultant",

            "email": current_user.email
        },

        "metrics": {
            "total_farmers": total_farmers,
            "active_consultations": active_consultations,
            "pending_messages": unread_messages,
            "total_predictions": len(predictions)
        },

        "weekly_predictions": [
            {
                "day": day,
                "predictions": count
            }
            for day, count in weekly_predictions.items()
        ]
    }


# ============================================================
# CONSULTANT ANALYTICS
# ============================================================

@router.get("/analytics")
def get_consultant_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """
    Analytics for the currently logged-in consultant.

    Only predictions belonging to farmers managed by this
    consultant are included.
    """

    require_consultant(current_user)

    # =========================================================
    # 1. FIND MANAGED FARMERS
    # =========================================================

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id == current_user.id
        )
        .all()
    )

    farmer_ids = list({
        conversation.farmer_id
        for conversation in conversations
        if conversation.farmer_id
    })
    total_farmers = len(farmer_ids)
    # ============================================================
    # ACTIVE CONSULTATIONS
    # ============================================================

    active_consultations = len([
       conversation
       for conversation in conversations
       if getattr(conversation, "is_active", True)
    ])

    # ============================================================
    # UNREAD MESSAGES
    # ============================================================

    unread_messages = 0

    for conversation in conversations:
        unread_messages += (
           db.query(Message)
           .filter(
                Message.conversation_id == conversation.id,
                Message.sender_id != current_user.id,
                Message.is_read == False
            )
            .count()
        )
    # =========================================================
    # 2. GET FARMERS
    # =========================================================

    farmers = []

    if farmer_ids:

        farmers = (
            db.query(User)
            .filter(
                User.id.in_(farmer_ids),
                User.role == "farmer"
            )
            .all()
        )

    farmer_lookup = {
        farmer.id: farmer
        for farmer in farmers
    }

    # =========================================================
    # 3. GET PREDICTIONS OF MANAGED FARMERS
    # =========================================================

    predictions = []

    if farmer_ids:

        predictions = (
            db.query(PredictionHistory)
            .filter(
                PredictionHistory.user_id.in_(farmer_ids)
            )
            .order_by(
                PredictionHistory.created_at.asc()
            )
            .all()
        )

    # =========================================================
    # 4. CROP DISTRIBUTION
    # =========================================================

    crop_counts = Counter()

    for farmer in farmers:

        crops = getattr(
            farmer,
            "primary_crops",
            None
        )

        if not crops:
            continue

        # List
        if isinstance(crops, list):

            for crop in crops:

                crop_name = str(crop).strip()

                if crop_name:
                    crop_counts[crop_name] += 1

        # String
        elif isinstance(crops, str):

            crop_list = (
                crops
                .replace(";", ",")
                .split(",")
            )

            for crop in crop_list:

                crop_name = crop.strip()

                if crop_name:
                    crop_counts[crop_name] += 1

    total_crop_count = sum(
        crop_counts.values()
    )

    crop_distribution = []

    for crop, count in crop_counts.items():

        value = (
            round(
                (count / total_crop_count) * 100,
                2
            )
            if total_crop_count > 0
            else 0
        )

        crop_distribution.append({
            "crop": crop,
            "count": count,
            "value": value,
        })

    crop_distribution.sort(
        key=lambda x: x["value"],
        reverse=True
    )

    # =========================================================
    # 5. YIELD TREND
    # =========================================================
    #
    # IMPORTANT:
    # Every PredictionHistory record becomes one point.
    #
    # This means the chart uses the SAME prediction history
    # that the farmer analytics uses.
    # =========================================================

    yield_trends = []

    for prediction in predictions:

        farmer = farmer_lookup.get(
            prediction.user_id
        )

        try:

            predicted_yield = float(
                prediction.predicted_yield
            )

        except (
            TypeError,
            ValueError
        ):

            continue

        created_at = prediction.created_at

        if created_at:

            label = created_at.strftime(
                "%d %b"
            )

        else:

            label = str(
                prediction.year
            )

        yield_trends.append({

            "id": prediction.id,

            "label": label,

            "year": (
                str(prediction.year)
                if prediction.year is not None
                else ""
            ),

            "crop": (
                prediction.crop
                or "Unknown"
            ),

            "area": prediction.area,

            "yield": round(
                predicted_yield,
                2
            ),

            "confidence": (
                prediction.confidence
                or 0
            ),

            "farmer_id": prediction.user_id,

            "farmer_name": (
                farmer.full_name
                if farmer
                else "Farmer"
            ),

            "created_at": (
                created_at.isoformat()
                if created_at
                else None
            ),
        })

    # =========================================================
    # 6. SUMMARY
    # =========================================================

    yields = []

    for prediction in predictions:

        try:

            yields.append(
                float(
                    prediction.predicted_yield
                )
            )

        except (
            TypeError,
            ValueError
        ):

            pass

    total_predictions = len(yields)

    average_yield = (
        sum(yields) / len(yields)
        if yields
        else 0
    )

    highest_yield = (
        max(yields)
        if yields
        else 0
    )

    lowest_yield = (
        min(yields)
        if yields
        else 0
    )

    # =========================================================
    # 7. MOST GROWN CROP
    # =========================================================

    most_grown_crop = None

    if crop_counts:

        most_grown_crop = max(
            crop_counts,
            key=crop_counts.get
        )

    # =========================================================
    # 8. CROP-WISE YIELD PERFORMANCE
    # =========================================================

    crop_yields = {}

    for prediction in predictions:

        crop = (
            prediction.crop
            or "Unknown"
        )

        try:

            value = float(
                prediction.predicted_yield
            )

        except (
            TypeError,
            ValueError
        ):

            continue

        crop_yields.setdefault(
            crop,
            []
        ).append(value)

    crop_yield_performance = []

    for crop, values in crop_yields.items():

        if not values:
            continue

        crop_yield_performance.append({

            "crop": crop,

            "yield": round(
                sum(values) / len(values),
                2
            ),

            "predictions": len(values),

        })

    crop_yield_performance.sort(
        key=lambda x: x["yield"],
        reverse=True
    )

    # =========================================================
    # 9. FARM-WISE YIELD RECORDS
    # =========================================================

    farm_yield_records = []

    for farmer in farmers:

        farmer_predictions = [
            prediction
            for prediction in predictions
            if prediction.user_id == farmer.id
        ]

        farmer_yields = []

        for prediction in farmer_predictions:

            try:

                farmer_yields.append(
                    float(
                        prediction.predicted_yield
                    )
                )

            except (
                TypeError,
                ValueError
            ):

                pass

        farm_yield_records.append({

            "farmer_id": farmer.id,

            "farmer_name": (
                farmer.full_name
                or "Farmer"
            ),

            "predictions": len(
                farmer_yields
            ),

            "average_yield": round(
                (
                    sum(farmer_yields)
                    / len(farmer_yields)
                )
                if farmer_yields
                else 0,
                2
            ),

        })

    # =========================================================
    # 10. RESPONSE
    # =========================================================

    return {

        "success": True,

        "summary": {

            "total_farmers": len(
                farmers
            ),

            "total_predictions":
                total_predictions,

            "average_yield": round(
                average_yield,
                2
            ),

            "highest_yield": round(
                highest_yield,
                2
            ),

            "lowest_yield": round(
                lowest_yield,
                2
            ),

            "most_grown_crop":
                most_grown_crop,

        },

        "crop_distribution":
            crop_distribution,

        "yield_trends":
            yield_trends,

        "crop_yield_performance":
            crop_yield_performance,

        "farm_yield_records":
            farm_yield_records,

    }
# ============================================================
# GET CONSULTANT NOTES
# ============================================================

@router.get("/notes")
def get_consultant_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):
    require_consultant(current_user)

    notes = (
        db.query(Note)
        .filter(
            Note.consultant_id == current_user.id
        )
        .order_by(
            Note.updated_at.desc(),
            Note.created_at.desc()
        )
        .all()
    )

    return {
        "success": True,
        "notes": [
            {
                "id": note.id,
                "title": note.title,
                "content": note.content,
                "created_at": (
                    note.created_at.isoformat()
                    if note.created_at
                    else None
                ),
                "updated_at": (
                    note.updated_at.isoformat()
                    if note.updated_at
                    else None
                ),
            }
            for note in notes
        ]
    }
# ============================================================
# CREATE CONSULTANT NOTE
# ============================================================

@router.post("/notes")
def create_consultant_note(
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):
    require_consultant(current_user)

    title = note_data.title.strip()
    content = note_data.content.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Note title is required"
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Note content is required"
        )

    note = Note(
        consultant_id=current_user.id,
        title=title,
        content=content
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return {
        "success": True,
        "message": "Note created successfully",
        "note": {
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "created_at": (
                note.created_at.isoformat()
                if note.created_at
                else None
            ),
            "updated_at": (
                note.updated_at.isoformat()
                if note.updated_at
                else None
            )
        }
    }
# ============================================================
# UPDATE CONSULTANT NOTE
# ============================================================

@router.put("/notes/{note_id}")
def update_consultant_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):
    require_consultant(current_user)

    note = (
        db.query(Note)
        .filter(
            Note.id == note_id,
            Note.consultant_id == current_user.id
        )
        .first()
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    if note_data.title is not None:
        title = note_data.title.strip()

        if not title:
            raise HTTPException(
                status_code=400,
                detail="Note title cannot be empty"
            )

        note.title = title

    if note_data.content is not None:
        content = note_data.content.strip()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Note content cannot be empty"
            )

        note.content = content

    db.commit()
    db.refresh(note)

    return {
        "success": True,
        "message": "Note updated successfully",
        "note": {
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "created_at": (
                note.created_at.isoformat()
                if note.created_at
                else None
            ),
            "updated_at": (
                note.updated_at.isoformat()
                if note.updated_at
                else None
            )
        }
    }
# ============================================================
# DELETE CONSULTANT NOTE
# ============================================================

@router.delete("/notes/{note_id}")
def delete_consultant_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):
    require_consultant(current_user)

    note = (
        db.query(Note)
        .filter(
            Note.id == note_id,
            Note.consultant_id == current_user.id
        )
        .first()
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(note)
    db.commit()

    return {
        "success": True,
        "message": "Note deleted successfully"
    }