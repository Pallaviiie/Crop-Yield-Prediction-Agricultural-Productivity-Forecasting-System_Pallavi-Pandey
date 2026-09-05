from collections import Counter, defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.prediction_history import PredictionHistory
from app.routers.users import get_authenticated_user


router = APIRouter(
    prefix="/consultant",
    tags=["Consultant Analytics"]
)


# ============================================================
# CHECK CONSULTANT
# ============================================================

def require_consultant(current_user: User):
    if not current_user:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    if str(current_user.role).lower() != "consultant":
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Consultant access required"
        )

    return current_user


# ============================================================
# NORMALIZE CROPS
# ============================================================

def normalize_crops(value):

    if value is None:
        return []

    # JSON/list format
    if isinstance(value, list):
        return [
            str(crop).strip()
            for crop in value
            if crop and str(crop).strip()
        ]

    # String format:
    # "Wheat, Rice, Maize"
    # "Wheat;Rice;Maize"
    if isinstance(value, str):

        value = value.strip()

        if not value:
            return []

        value = value.replace(";", ",")

        return [
            crop.strip()
            for crop in value.split(",")
            if crop.strip()
        ]

    return [str(value).strip()]


# ============================================================
# CONSULTANT ANALYTICS
# ============================================================

@router.get("/analytics")
def get_consultant_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user)
):

    require_consultant(current_user)


    # ========================================================
    # 1. FIND FARMERS MANAGED BY THIS CONSULTANT
    # ========================================================

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id == current_user.id
        )
        .all()
    )


    farmer_ids = set()

    for conversation in conversations:

        if conversation.farmer_id:
            farmer_ids.add(
                conversation.farmer_id
            )


    # ========================================================
    # 2. GET MANAGED FARMERS
    # ========================================================

    farmers = []

    if farmer_ids:

        farmers = (
            db.query(User)
            .filter(
                User.id.in_(list(farmer_ids))
            )
            .all()
        )


    farmer_lookup = {
        farmer.id: farmer
        for farmer in farmers
    }


    # ========================================================
    # 3. CROP DISTRIBUTION
    # ========================================================
    #
    # Counts how many managed farmers have each crop.
    #
    # Example:
    #
    # Wheat -> 3
    # Rice  -> 2
    # Maize -> 1
    #
    # Converted into percentages for PieChart.
    # ========================================================

    crop_counter = Counter()


    for farmer in farmers:

        primary_crops = getattr(
            farmer,
            "primary_crops",
            None
        )

        crops = normalize_crops(
            primary_crops
        )


        # Count a crop only once per farmer
        unique_crops = set(
            crop.lower().strip()
            for crop in crops
            if crop
        )


        for crop in unique_crops:

            crop_counter[crop] += 1


    total_crop_entries = sum(
        crop_counter.values()
    )


    crop_distribution = []


    if total_crop_entries > 0:

        sorted_crops = crop_counter.most_common()


        for crop, count in sorted_crops:

            percentage = (
                count /
                total_crop_entries
            ) * 100


            # Convert crop name to display format
            display_crop = crop.title()


            crop_distribution.append({
                "name": display_crop,
                "value": round(
                    percentage,
                    2
                ),
                "count": count
            })


    # ========================================================
    # 4. GET PREDICTION HISTORY
    # ========================================================
    #
    # IMPORTANT:
    # This is the SAME PredictionHistory table used
    # by the farmer analytics dashboard.
    # ========================================================

    predictions = []


    if farmer_ids:

        predictions = (
            db.query(PredictionHistory)
            .filter(
                PredictionHistory.user_id.in_(
                    list(farmer_ids)
                )
            )
            .order_by(
                PredictionHistory.year.asc(),
                PredictionHistory.created_at.asc()
            )
            .all()
        )


    # ========================================================
    # 5. PREPARE YEAR + CROP YIELD DATA
    # ========================================================
    #
    # Example returned data:
    #
    # [
    #   {
    #       "year": 2023,
    #       "Wheat": 3.8,
    #       "Rice": 3.2
    #   },
    #   {
    #       "year": 2024,
    #       "Wheat": 4.1,
    #       "Rice": 3.9
    #   }
    # ]
    #
    # This is exactly what the Recharts LineChart needs.
    # ========================================================

    yearly_crop_values = defaultdict(
        lambda: defaultdict(list)
    )


    for prediction in predictions:

        if prediction.year is None:
            continue

        if prediction.crop is None:
            continue

        if prediction.predicted_yield is None:
            continue


        try:

            year = int(
                prediction.year
            )

            predicted_yield = float(
                prediction.predicted_yield
            )

        except (
            TypeError,
            ValueError
        ):

            continue


        crop_name = str(
            prediction.crop
        ).strip()


        if not crop_name:
            continue


        # Normalize crop key
        crop_key = crop_name.lower()


        yearly_crop_values[
            year
        ][crop_key].append(
            predicted_yield
        )


    # ========================================================
    # 6. FIND TOP TWO CROPS FOR LINE CHART
    # ========================================================
    #
    # The screenshot has:
    #
    # Avg Wheat
    # Avg Rice
    #
    # We dynamically select the two crops with the
    # highest number of prediction records.
    # ========================================================

    crop_prediction_counter = Counter()


    for prediction in predictions:

        if not prediction.crop:
            continue

        crop_key = str(
            prediction.crop
        ).strip().lower()

        if crop_key:
            crop_prediction_counter[
                crop_key
            ] += 1


    top_crops = [
        crop
        for crop, count
        in crop_prediction_counter.most_common(2)
    ]


    # ========================================================
    # 7. BUILD YIELD TREND
    # ========================================================

    yield_trends = []


    for year in sorted(
        yearly_crop_values.keys()
    ):

        row = {
            "year": year
        }


        for crop in top_crops:

            values = (
                yearly_crop_values[
                    year
                ].get(
                    crop,
                    []
                )
            )


            if values:

                average = (
                    sum(values) /
                    len(values)
                )

                row[crop] = round(
                    average,
                    2
                )

            else:

                row[crop] = None


        yield_trends.append(row)


    # ========================================================
    # 8. LINE SERIES INFORMATION
    # ========================================================

    yield_series = []


    for crop in top_crops:

        yield_series.append({
            "key": crop,
            "label": f"Avg {crop.title()}"
        })


    # ========================================================
    # 9. ADDITIONAL SUMMARY DATA
    # ========================================================

    total_predictions = len(
        predictions
    )


    all_yields = []


    for prediction in predictions:

        if prediction.predicted_yield is None:
            continue

        try:

            all_yields.append(
                float(
                    prediction.predicted_yield
                )
            )

        except (
            TypeError,
            ValueError
        ):

            pass


    average_yield = 0


    if all_yields:

        average_yield = (
            sum(all_yields) /
            len(all_yields)
        )


    # ========================================================
    # 10. RESPONSE
    # ========================================================

    return {

        "managed_farmers": len(
            farmers
        ),

        "total_predictions": total_predictions,

        "average_yield": round(
            average_yield,
            2
        ),

        "crop_distribution":
            crop_distribution,

        "yield_trends":
            yield_trends,

        "yield_series":
            yield_series,

    }