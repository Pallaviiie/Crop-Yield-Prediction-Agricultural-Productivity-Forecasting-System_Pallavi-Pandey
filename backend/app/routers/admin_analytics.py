# ============================================================
# ADMIN ANALYTICS ROUTER
# ============================================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db

from app.models.user import User
from app.models.prediction_history import PredictionHistory
from app.models.admin_dataset import AdminDataset

from app.routers.users import get_authenticated_user


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/admin",
    tags=["Admin Analytics"]
)


# ============================================================
# ADMIN AUTHORIZATION
# ============================================================

def require_admin(
    current_user: User = Depends(
        get_authenticated_user
    )
):

    if current_user.role != "admin":

        from fastapi import HTTPException

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


# ============================================================
# ADMIN ANALYTICS
# ============================================================

@router.get("/analytics")
def get_admin_analytics(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_admin
    )

):

    # ========================================================
    # 1. USER COUNTS
    # ========================================================

    total_users = (
        db.query(User)
        .count()
    )


    total_farmers = (
        db.query(User)
        .filter(
            User.role == "farmer"
        )
        .count()
    )


    total_consultants = (
        db.query(User)
        .filter(
            User.role == "consultant"
        )
        .count()
    )


    total_admins = (
        db.query(User)
        .filter(
            User.role == "admin"
        )
        .count()
    )


    # ========================================================
    # 2. ACTIVE USERS
    #
    # If your User model has is_active, use it.
    # Otherwise all existing users are considered active.
    # ========================================================

    if hasattr(User, "is_active"):

        active_users = (
            db.query(User)
            .filter(
                User.is_active == True
            )
            .count()
        )

    else:

        active_users = total_users


    # ========================================================
    # 3. TOTAL PREDICTIONS
    # ========================================================

    total_predictions = (
        db.query(
            PredictionHistory
        )
        .count()
    )


    # ========================================================
    # 4. TOTAL DATASETS
    # ========================================================

    total_datasets = (
        db.query(
            AdminDataset
        )
        .count()
    )


    # ========================================================
    # 5. USER REGISTRATION GROWTH
    #
    # Example:
    #
    # [
    #   {
    #       "date": "2026-08-20",
    #       "count": 2
    #   }
    # ]
    # ========================================================

    user_registration_growth = []

    try:

        rows = (
            db.query(
                func.date(
                    User.created_at
                ).label("date"),

                func.count(
                    User.id
                ).label("count")
            )
            .group_by(
                func.date(
                    User.created_at
                )
            )
            .order_by(
                func.date(
                    User.created_at
                )
            )
            .all()
        )


        user_registration_growth = [

            {
                "date": str(row.date),
                "count": int(row.count)
            }

            for row in rows

        ]

    except Exception as e:

        print(
            "User growth analytics error:",
            e
        )

        user_registration_growth = []


    # ========================================================
    # 6. PREDICTIONS OVER TIME
    # ========================================================

    predictions_over_time = []

    try:

        rows = (
            db.query(
                func.date(
                    PredictionHistory.created_at
                ).label("date"),

                func.count(
                    PredictionHistory.id
                ).label("count")
            )
            .group_by(
                func.date(
                    PredictionHistory.created_at
                )
            )
            .order_by(
                func.date(
                    PredictionHistory.created_at
                )
            )
            .all()
        )


        predictions_over_time = [

            {
                "date": str(row.date),
                "count": int(row.count)
            }

            for row in rows

        ]

    except Exception as e:

        print(
            "Prediction activity analytics error:",
            e
        )

        predictions_over_time = []


    # ========================================================
    # 7. PREDICTIONS BY CROP
    # ========================================================

    most_predicted_crops = []

    try:

        rows = (
            db.query(
                PredictionHistory.crop.label(
                    "crop"
                ),

                func.count(
                    PredictionHistory.id
                ).label("count")
            )
            .filter(
                PredictionHistory.crop.isnot(None)
            )
            .group_by(
                PredictionHistory.crop
            )
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
                "crop":
                    row.crop or "Unknown",

                "count":
                    int(row.count)
            }

            for row in rows

        ]

    except Exception as e:

        print(
            "Crop analytics error:",
            e
        )

        most_predicted_crops = []


    # ========================================================
    # 8. AVERAGE YIELD BY CROP
    # ========================================================

    average_yield_by_crop = []

    try:

        rows = (
            db.query(
                PredictionHistory.crop.label(
                    "crop"
                ),

                func.avg(
                    PredictionHistory.predicted_yield
                ).label(
                    "average_yield"
                )
            )
            .filter(
                PredictionHistory.crop.isnot(None)
            )
            .filter(
                PredictionHistory.predicted_yield.isnot(None)
            )
            .group_by(
                PredictionHistory.crop
            )
            .order_by(
                func.avg(
                    PredictionHistory.predicted_yield
                ).desc()
            )
            .limit(10)
            .all()
        )


        average_yield_by_crop = [

            {
                "crop":
                    row.crop or "Unknown",

                "average_yield":
                    round(
                        float(
                            row.average_yield
                        ),
                        2
                    )
            }

            for row in rows

            if row.average_yield is not None

        ]

    except Exception as e:

        print(
            "Average yield analytics error:",
            e
        )

        average_yield_by_crop = []


    # ========================================================
    # 9. PREDICTIONS BY LOCATION
    #
    # We first try PredictionHistory.district/location/state.
    #
    # If those fields don't exist, we use the User location.
    # ========================================================

    predictions_by_location = []


    try:

        location_column = None

        for field in [
            "district",
            "location",
            "state"
        ]:

            if hasattr(
                PredictionHistory,
                field
            ):

                location_column = getattr(
                    PredictionHistory,
                    field
                )

                break


        if location_column is not None:

            rows = (
                db.query(
                    location_column.label(
                        "location"
                    ),

                    func.count(
                        PredictionHistory.id
                    ).label("count")
                )
                .filter(
                    location_column.isnot(None)
                )
                .group_by(
                    location_column
                )
                .order_by(
                    func.count(
                        PredictionHistory.id
                    ).desc()
                )
                .limit(10)
                .all()
            )


            predictions_by_location = [

                {
                    "location":
                        row.location or "Unknown",

                    "count":
                        int(row.count)
                }

                for row in rows

            ]


    except Exception as e:

        print(
            "Prediction location analytics error:",
            e
        )

        predictions_by_location = []


    # ========================================================
    # 10. FALLBACK LOCATION FROM USERS
    # ========================================================

    if not predictions_by_location:

        try:

            if hasattr(
                User,
                "location"
            ):

                rows = (
                    db.query(
                        User.location.label(
                            "location"
                        ),

                        func.count(
                            PredictionHistory.id
                        ).label("count")
                    )
                    .join(
                        PredictionHistory,
                        PredictionHistory.user_id
                        == User.id
                    )
                    .filter(
                        User.location.isnot(None)
                    )
                    .group_by(
                        User.location
                    )
                    .order_by(
                        func.count(
                            PredictionHistory.id
                        ).desc()
                    )
                    .limit(10)
                    .all()
                )


                predictions_by_location = [

                    {
                        "location":
                            row.location or "Unknown",

                        "count":
                            int(row.count)
                    }

                    for row in rows

                ]

        except Exception as e:

            print(
                "User location analytics error:",
                e
            )

            predictions_by_location = []


    # ========================================================
    # 11. RESPONSE
    # ========================================================

    return {

        "stats": {

            "total_users":
                total_users,

            "total_farmers":
                total_farmers,

            "total_consultants":
                total_consultants,

            "total_admins":
                total_admins,

            "active_users":
                active_users,

            "total_predictions":
                total_predictions,

            "total_datasets":
                total_datasets,

        },


        "user_registration_growth":
            user_registration_growth,


        "predictions_over_time":
            predictions_over_time,


        "most_predicted_crops":
            most_predicted_crops,


        "average_yield_by_crop":
            average_yield_by_crop,


        "predictions_by_location":
            predictions_by_location,

    }