from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user import User
from app.models.prediction_history import PredictionHistory
from app.models.admin_dataset import AdminDataset
from app.models.activity_log import ActivityLog
from app.utils.activity_logger import log_activity

from app.routers.users import (
    get_authenticated_user,
    hash_password,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =========================================================
# ADMIN AUTHORIZATION
# =========================================================

def require_admin(
    current_user=Depends(get_authenticated_user),
):
    """
    Allow access only to authenticated admin users.
    """

    if not current_user:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return current_user


# =========================================================
# PYDANTIC SCHEMAS
# =========================================================

class AdminUserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    role: str = "farmer"

    phone: str | None = None
    location: str | None = None
    country: str | None = "India"


class AdminUserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None

    role: str | None = None

    phone: str | None = None
    location: str | None = None
    country: str | None = None

    password: str | None = None


class DatasetCreate(BaseModel):
    name: str
    type: str = "CSV"
    description: str | None = None
    records: int = 0
    columns: int = 0
    status: str = "Active"


# =========================================================
# HELPERS
# =========================================================

def serialize_user(user: User):
    """
    Convert User SQLAlchemy object into JSON-safe data.
    """

    return {
        "id": user.id,
        "full_name": getattr(user, "full_name", None),
        "email": getattr(user, "email", None),
        "role": getattr(user, "role", None),
        "phone": getattr(user, "phone", None),
        "location": getattr(user, "location", None),
        "country": getattr(user, "country", None),

        "created_at": (
            user.created_at.isoformat()
            if getattr(user, "created_at", None)
            else None
        ),

        # Your current User model does not contain is_active.
        # Until that column is added, users are considered active.
        "is_active": (
            bool(user.is_active)
            if hasattr(user, "is_active")
            else True
        ),
    }


def serialize_dataset(dataset: AdminDataset):
    return {
        "id": dataset.id,
        "name": dataset.name,
        "type": dataset.type,
        "description": dataset.description,
        "records": dataset.records,
        "columns": dataset.columns,
        "status": dataset.status,

        "created_at": (
            dataset.created_at.isoformat()
            if dataset.created_at
            else None
        ),

        "updated_at": (
            dataset.updated_at.isoformat()
            if dataset.updated_at
            else None
        ),
    }


def get_prediction_field(model, fields):
    """
    Return the first existing SQLAlchemy column
    from the supplied possible field names.
    """

    for field in fields:
        if hasattr(model, field):
            return getattr(model, field)

    return None


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    total_users = db.query(User).count()

    total_farmers = (
        db.query(User)
        .filter(User.role == "farmer")
        .count()
    )

    total_consultants = (
        db.query(User)
        .filter(User.role == "consultant")
        .count()
    )

    total_admins = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    total_predictions = (
        db.query(PredictionHistory)
        .count()
    )

    total_datasets = (
        db.query(AdminDataset)
        .count()
    )

    if hasattr(User, "is_active"):
        active_users = (
            db.query(User)
            .filter(User.is_active.is_(True))
            .count()
        )
    else:
        active_users = total_users

    # -----------------------------------------------------
    # USER REGISTRATION GROWTH
    # -----------------------------------------------------

    user_registration_growth = []

    try:
        rows = (
            db.query(
                func.date(User.created_at).label("date"),
                func.count(User.id).label("count"),
            )
            .group_by(func.date(User.created_at))
            .order_by(func.date(User.created_at))
            .all()
        )

        user_registration_growth = [
            {
                "date": str(row.date),
                "count": row.count,
            }
            for row in rows
        ]

    except Exception:
        user_registration_growth = []

    # -----------------------------------------------------
    # PREDICTIONS BY LOCATION
    # -----------------------------------------------------

    predictions_by_state = []

    try:
        location_column = get_prediction_field(
            PredictionHistory,
            [
                "state",
                "district",
                "location",
            ],
        )

        if location_column is not None:

            rows = (
                db.query(
                    location_column.label("state"),
                    func.count(
                        PredictionHistory.id
                    ).label("count"),
                )
                .group_by(location_column)
                .order_by(
                    func.count(
                        PredictionHistory.id
                    ).desc()
                )
                .limit(10)
                .all()
            )

            predictions_by_state = [
                {
                    "state": row.state or "Unknown",
                    "count": row.count,
                }
                for row in rows
            ]

    except Exception:
        predictions_by_state = []

    # -----------------------------------------------------
    # MOST PREDICTED CROPS
    # -----------------------------------------------------

    most_predicted_crops = []

    try:
        crop_column = get_prediction_field(
            PredictionHistory,
            [
                "crop",
                "crop_name",
            ],
        )

        if crop_column is not None:

            rows = (
                db.query(
                    crop_column.label("crop"),
                    func.count(
                        PredictionHistory.id
                    ).label("count"),
                )
                .group_by(crop_column)
                .order_by(
                    func.count(
                        PredictionHistory.id
                    ).desc()
                )
                .limit(10)
                .all()
            )

            most_predicted_crops = [
                {
                    "crop": row.crop or "Unknown",
                    "count": row.count,
                }
                for row in rows
            ]

    except Exception:
        most_predicted_crops = []

    # -----------------------------------------------------
    # PREDICTIONS OVER TIME
    # -----------------------------------------------------

    predictions_over_time = []

    try:
        created_column = get_prediction_field(
            PredictionHistory,
            ["created_at"],
        )

        if created_column is not None:

            rows = (
                db.query(
                    func.date(
                        created_column
                    ).label("date"),
                    func.count(
                        PredictionHistory.id
                    ).label("count"),
                )
                .group_by(
                    func.date(created_column)
                )
                .order_by(
                    func.date(created_column)
                )
                .all()
            )

            predictions_over_time = [
                {
                    "date": str(row.date),
                    "count": row.count,
                }
                for row in rows
            ]

    except Exception:
        predictions_over_time = []

    return {
        "stats": {
            "total_users": total_users,
            "total_farmers": total_farmers,
            "total_consultants": total_consultants,
            "total_admins": total_admins,
            "total_predictions": total_predictions,
            "active_users": active_users,
            "total_datasets": total_datasets,
        },

        "user_registration_growth":
            user_registration_growth,

        "predictions_by_state":
            predictions_by_state,

        "most_predicted_crops":
            most_predicted_crops,

        "predictions_over_time":
            predictions_over_time,
    }


# =========================================================
# USER MANAGEMENT
# =========================================================

@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    users = (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )

    return [
        serialize_user(user)
        for user in users
    ]


# =========================================================
# CREATE USER
# =========================================================

@router.post("/users")
def create_user(
    data: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    existing = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    if data.role not in [
        "farmer",
        "consultant",
        "admin",
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid user role",
        )

    user_data = {
        "full_name": data.full_name.strip(),
        "email": str(data.email).lower().strip(),
        "password_hash": hash_password(data.password),
        "role": data.role,
        "phone": data.phone,
        "location": data.location,
        "country": data.country,
    }

    if hasattr(User, "is_active"):
        user_data["is_active"] = True

    new_user = User(**user_data)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return serialize_user(new_user)


# =========================================================
# UPDATE USER
# =========================================================

@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # -----------------------------------------------------
    # EMAIL
    # -----------------------------------------------------

    if data.email is not None:

        new_email = str(data.email).lower().strip()

        existing = (
            db.query(User)
            .filter(
                User.email == new_email,
                User.id != user_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already in use",
            )

        user.email = new_email

    # -----------------------------------------------------
    # NAME
    # -----------------------------------------------------

    if data.full_name is not None:
        user.full_name = data.full_name.strip()

    # -----------------------------------------------------
    # ROLE
    # -----------------------------------------------------

    if data.role is not None:

        if data.role not in [
            "farmer",
            "consultant",
            "admin",
        ]:
            raise HTTPException(
                status_code=400,
                detail="Invalid user role",
            )

        # Prevent admin from removing
        # their own admin privileges.
        if (
            user.id == current_user.id
            and data.role != "admin"
        ):
            raise HTTPException(
                status_code=400,
                detail="You cannot remove your own admin privileges",
            )

        user.role = data.role

    # -----------------------------------------------------
    # OTHER FIELDS
    # -----------------------------------------------------

    if data.phone is not None:
        user.phone = data.phone

    if data.location is not None:
        user.location = data.location

    if data.country is not None:
        user.country = data.country

    # -----------------------------------------------------
    # PASSWORD
    # -----------------------------------------------------

    if data.password:
        user.password_hash = hash_password(
            data.password
        )

    db.commit()
    db.refresh(user)

    return serialize_user(user)


# =========================================================
# DELETE USER
# =========================================================

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own admin account",
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


# =========================================================
# ACTIVATE / DEACTIVATE USER
# =========================================================

@router.put("/users/{user_id}/status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if not hasattr(User, "is_active"):
        raise HTTPException(
            status_code=400,
            detail=(
                "User status management is not enabled yet. "
                "Add an is_active column to the User model first."
            ),
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own admin account",
        )

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)

    return serialize_user(user)


# =========================================================
# DATASET MANAGEMENT
# =========================================================

@router.get("/datasets")
def get_datasets(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    datasets = (
        db.query(AdminDataset)
        .order_by(AdminDataset.id.desc())
        .all()
    )

    return [
        serialize_dataset(dataset)
        for dataset in datasets
    ]


# =========================================================
# CREATE DATASET
# =========================================================

@router.post("/datasets")
def create_dataset(
    data: DatasetCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    if data.records < 0:
        raise HTTPException(
            status_code=400,
            detail="Records cannot be negative",
        )

    if data.columns < 0:
        raise HTTPException(
            status_code=400,
            detail="Columns cannot be negative",
        )

    dataset = AdminDataset(
        name=data.name.strip(),
        type=data.type.strip(),
        description=data.description,
        records=data.records,
        columns=data.columns,
        status=data.status,
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return serialize_dataset(dataset)


# =========================================================
# DELETE DATASET
# =========================================================

@router.delete("/datasets/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    dataset = (
        db.query(AdminDataset)
        .filter(
            AdminDataset.id == dataset_id
        )
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found",
        )

    db.delete(dataset)
    db.commit()

    return {
        "message": "Dataset deleted successfully"
    }


# =========================================================
# PREDICTION MONITOR
# =========================================================

@router.get("/predictions")
def get_predictions(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
    limit: int = Query(
        500,
        ge=1,
        le=2000,
    ),
):

    predictions = (
        db.query(PredictionHistory)
        .order_by(PredictionHistory.id.desc())
        .limit(limit)
        .all()
    )

    result = []

    for prediction in predictions:

        crop_column = get_prediction_field(
            prediction,
            [
                "crop",
                "crop_name",
            ],
        )

        location_column = get_prediction_field(
            prediction,
            [
                "state",
                "district",
                "location",
            ],
        )

        yield_column = get_prediction_field(
            prediction,
            [
                "predicted_yield",
                "yield_value",
            ],
        )

        confidence_column = get_prediction_field(
            prediction,
            [
                "confidence",
                "prediction_confidence",
            ],
        )

        created_at = getattr(
            prediction,
            "created_at",
            None,
        )

        result.append(
            {
                "id": prediction.id,

                "crop": (
                    crop_column
                    if crop_column
                    else "Unknown"
                ),

                "district": (
                    location_column
                    if location_column
                    else "Unknown"
                ),

                "season": (
                    getattr(
                        prediction,
                        "season",
                        None,
                    )
                    or "Unknown"
                ),

                "yield": yield_column,

                "confidence":
                    confidence_column,

                "date": (
                    created_at.isoformat()
                    if created_at
                    else None
                ),

                "status": "Completed",
            }
        )

    return result


# =========================================================
# ANALYTICS
# =========================================================

@router.get("/analytics")
def admin_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    # -----------------------------------------------------
    # USER GROWTH
    # -----------------------------------------------------

    user_growth = []

    try:

        rows = (
            db.query(
                func.date(User.created_at).label("date"),
                func.count(User.id).label("count"),
            )
            .group_by(func.date(User.created_at))
            .order_by(func.date(User.created_at))
            .all()
        )

        user_growth = [
            {
                "date": str(row.date),
                "count": row.count,
            }
            for row in rows
        ]

    except Exception:
        user_growth = []

    # -----------------------------------------------------
    # PREDICTIONS BY STATE
    # -----------------------------------------------------

    predictions_by_state = []

    try:

        state_column = get_prediction_field(
            PredictionHistory,
            [
                "state",
                "district",
                "location",
            ],
        )

        if state_column is not None:

            rows = (
                db.query(
                    state_column.label("state"),
                    func.count(
                        PredictionHistory.id
                    ).label("count"),
                )
                .group_by(state_column)
                .order_by(
                    func.count(
                        PredictionHistory.id
                    ).desc()
                )
                .limit(10)
                .all()
            )

            predictions_by_state = [
                {
                    "state": row.state or "Unknown",
                    "count": row.count,
                }
                for row in rows
            ]

    except Exception:
        predictions_by_state = []

    # -----------------------------------------------------
    # MOST PREDICTED CROPS
    # -----------------------------------------------------

    most_predicted_crops = []

    try:

        crop_column = get_prediction_field(
            PredictionHistory,
            [
                "crop",
                "crop_name",
            ],
        )

        if crop_column is not None:

            rows = (
                db.query(
                    crop_column.label("crop"),
                    func.count(
                        PredictionHistory.id
                    ).label("count"),
                )
                .group_by(crop_column)
                .order_by(
                    func.count(
                        PredictionHistory.id
                    ).desc()
                )
                .limit(10)
                .all()
            )

            most_predicted_crops = [
                {
                    "crop": row.crop or "Unknown",
                    "count": row.count,
                }
                for row in rows
            ]

    except Exception:
        most_predicted_crops = []

    # -----------------------------------------------------
    # AVERAGE YIELD BY CROP
    # -----------------------------------------------------

    average_yield_by_crop = []

    try:

        crop_column = get_prediction_field(
            PredictionHistory,
            [
                "crop",
                "crop_name",
            ],
        )

        yield_column = get_prediction_field(
            PredictionHistory,
            [
                "predicted_yield",
                "yield_value",
            ],
        )

        if (
            crop_column is not None
            and yield_column is not None
        ):

            rows = (
                db.query(
                    crop_column.label("crop"),
                    func.avg(
                        yield_column
                    ).label("average_yield"),
                )
                .group_by(crop_column)
                .order_by(
                    func.avg(
                        yield_column
                    ).desc()
                )
                .limit(10)
                .all()
            )

            average_yield_by_crop = [
                {
                    "crop": row.crop or "Unknown",

                    "average_yield": (
                        float(row.average_yield)
                        if row.average_yield is not None
                        else 0
                    ),
                }
                for row in rows
            ]

    except Exception:
        average_yield_by_crop = []

    return {
        "user_growth": user_growth,

        "predictions_by_state":
            predictions_by_state,

        "most_predicted_crops":
            most_predicted_crops,

        "average_yield_by_crop":
            average_yield_by_crop,
    }


# =========================================================
# ACTIVITY LOGS
# =========================================================

@router.get("/activity-logs")
def get_activity_logs(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
    limit: int = Query(
        100,
        ge=1,
        le=500,
    ),
):
    logs = (
        db.query(ActivityLog)
        .order_by(
            ActivityLog.timestamp.desc()
        )
        .limit(limit)
        .all()
    )

    return [
        {
            "id": log.id,
            "action": log.action,
            "actor_name": log.actor_name,
            "actor_role": log.actor_role,
            "details": log.details,
            "type": log.type,
            "timestamp": (
                log.timestamp.isoformat()
                if log.timestamp
                else None
            ),
        }
        for log in logs
    ]