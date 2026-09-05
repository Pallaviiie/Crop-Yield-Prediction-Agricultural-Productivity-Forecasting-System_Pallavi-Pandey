from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.alert import Alert
from app.models.user import User
from app.routers.users import get_authenticated_user


router = APIRouter(
    prefix="/consultant/alerts",
    tags=["Consultant Alerts"],
)


# ============================================================
# HELPERS
# ============================================================

def require_consultant(current_user: User):

    if current_user.role != "consultant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agricultural consultants can access alerts.",
        )


def alert_response(alert: Alert):

    return {
        "id": alert.id,

        "consultant_id": alert.consultant_id,

        "farmer_id": alert.farmer_id,

        "prediction_id": alert.prediction_id,

        "alert_type": alert.alert_type,

        "severity": alert.severity,

        "title": alert.title,

        "message": alert.message,

        "is_read": alert.is_read,

        "created_at": alert.created_at,

        "read_at": alert.read_at,
    }


# ============================================================
# GET ALL ALERTS
# ============================================================

@router.get("/")
def get_alerts(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    require_consultant(current_user)

    alerts = (
        db.query(Alert)
        .filter(
            Alert.consultant_id == current_user.id
        )
        .order_by(
            Alert.created_at.desc()
        )
        .all()
    )

    return [
        alert_response(alert)
        for alert in alerts
    ]


# ============================================================
# GET UNREAD COUNT
# ============================================================

@router.get("/unread-count")
def get_unread_alert_count(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    require_consultant(current_user)

    count = (
        db.query(Alert)
        .filter(
            Alert.consultant_id == current_user.id,
            Alert.is_read == False,
        )
        .count()
    )

    return {
        "unread_count": count
    }


# ============================================================
# MARK ONE ALERT AS READ
# ============================================================

@router.put("/{alert_id}/read")
def mark_alert_as_read(

    alert_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    require_consultant(current_user)

    alert = (
        db.query(Alert)
        .filter(
            Alert.id == alert_id,
            Alert.consultant_id == current_user.id,
        )
        .first()
    )

    if not alert:

        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    alert.is_read = True
    alert.read_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(alert)

    return alert_response(alert)


# ============================================================
# MARK ALL AS READ
# ============================================================

@router.put("/read-all")
def mark_all_alerts_as_read(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    require_consultant(current_user)

    alerts = (
        db.query(Alert)
        .filter(
            Alert.consultant_id == current_user.id,
            Alert.is_read == False,
        )
        .all()
    )

    now = datetime.now(timezone.utc)

    for alert in alerts:

        alert.is_read = True
        alert.read_at = now

    db.commit()

    return {
        "message": "All alerts marked as read.",
        "updated": len(alerts),
    }


# ============================================================
# DELETE ALERT
# ============================================================

@router.delete("/{alert_id}")
def delete_alert(

    alert_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    require_consultant(current_user)

    alert = (
        db.query(Alert)
        .filter(
            Alert.id == alert_id,
            Alert.consultant_id == current_user.id,
        )
        .first()
    )

    if not alert:

        raise HTTPException(
            status_code=404,
            detail="Alert not found.",
        )

    db.delete(alert)

    db.commit()

    return {
        "message": "Alert deleted successfully."
    }


# ============================================================
# CREATE ALERT
# ============================================================

class AlertCreate(BaseModel):

    farmer_id: int | None = None

    prediction_id: int | None = None

    alert_type: str = "general"

    severity: str = "info"

    title: str

    message: str


@router.post("/")
def create_alert(

    data: AlertCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    require_consultant(current_user)

    alert = Alert(

        consultant_id=current_user.id,

        farmer_id=data.farmer_id,

        prediction_id=data.prediction_id,

        alert_type=data.alert_type,

        severity=data.severity,

        title=data.title,

        message=data.message,

        is_read=False,

    )

    db.add(alert)

    db.commit()

    db.refresh(alert)

    return alert_response(alert)