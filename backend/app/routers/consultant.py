from collections import Counter
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.routers.users import get_authenticated_user


router = APIRouter(
    prefix="/consultant",
    tags=["Consultant"],
)


# ============================================================
# HELPERS
# ============================================================

def require_consultant(current_user: User):
    if current_user.role != "consultant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agricultural consultants can access this endpoint.",
        )


def farmer_response(farmer: User):
    return {
        "id": farmer.id,
        "full_name": farmer.full_name,
        "email": farmer.email,
        "role": farmer.role,

        "phone": getattr(farmer, "phone", None),
        "location": getattr(farmer, "location", None),
        "state": getattr(farmer, "state", None),
        "country": getattr(farmer, "country", None),

        "farm_location": getattr(
            farmer,
            "farm_location",
            None,
        ),

        "farm_size": getattr(
            farmer,
            "farm_size",
            None,
        ),

        "soil_type": getattr(
            farmer,
            "soil_type",
            None,
        ),

        "primary_crops": getattr(
            farmer,
            "primary_crops",
            None,
        ),

        "profile_image": getattr(
            farmer,
            "profile_image",
            None,
        ),

        "created_at": getattr(
            farmer,
            "created_at",
            None,
        ),
    }


# ============================================================
# GET FARMERS
# ============================================================

@router.get("/farmers")
def get_consultant_farmers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    require_consultant(current_user)

    farmers = (
        db.query(User)
        .filter(User.role == "farmer")
        .order_by(User.full_name.asc())
        .all()
    )

    return [
        farmer_response(farmer)
        for farmer in farmers
    ]


# ============================================================
# GET CONSULTATIONS
#
# Uses Conversation + Message because your existing chat system
# already stores consultant-farmer communication there.
# ============================================================

@router.get("/consultations")
def get_consultant_consultations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    require_consultant(current_user)

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id
            == current_user.id
        )
        .order_by(
            Conversation.updated_at.desc()
        )
        .all()
    )

    result = []

    for conversation in conversations:

        farmer = conversation.farmer

        messages = (
            db.query(Message)
            .filter(
                Message.conversation_id
                == conversation.id
            )
            .order_by(
                Message.created_at.asc()
            )
            .all()
        )

        last_message = (
            messages[-1]
            if messages
            else None
        )

        unread_count = sum(
            1
            for message in messages
            if (
                message.sender_id != current_user.id
                and not message.is_read
            )
        )

        result.append(
            {
                "id": conversation.id,

                "farmer": (
                    farmer_response(farmer)
                    if farmer
                    else None
                ),

                "farmer_id":
                    conversation.farmer_id,

                "consultant_id":
                    conversation.consultant_id,

                "created_at":
                    conversation.created_at,

                "updated_at":
                    conversation.updated_at,

                "last_message": (
                    {
                        "id": last_message.id,
                        "message":
                            last_message.message,
                        "sender_id":
                            last_message.sender_id,
                        "created_at":
                            last_message.created_at,
                        "is_read":
                            last_message.is_read,
                    }
                    if last_message
                    else None
                ),

                "message_count":
                    len(messages),

                "unread_count":
                    unread_count,
            }
        )

    return result


# ============================================================
# ANALYTICS
# ============================================================

@router.get("/analytics")
def get_consultant_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    require_consultant(current_user)

    # --------------------------------------------------------
    # Farmers
    # --------------------------------------------------------

    farmers = (
        db.query(User)
        .filter(User.role == "farmer")
        .all()
    )

    total_farmers = len(farmers)

    # --------------------------------------------------------
    # Conversations
    # --------------------------------------------------------

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id
            == current_user.id
        )
        .all()
    )

    total_consultations = len(conversations)

    # --------------------------------------------------------
    # Messages
    # --------------------------------------------------------

    conversation_ids = [
        conversation.id
        for conversation in conversations
    ]

    total_messages = 0

    if conversation_ids:
        total_messages = (
            db.query(Message)
            .filter(
                Message.conversation_id.in_(
                    conversation_ids
                )
            )
            .count()
        )

    # --------------------------------------------------------
    # Crop distribution
    # --------------------------------------------------------

    crop_counter = Counter()

    for farmer in farmers:

        crops = getattr(
            farmer,
            "primary_crops",
            None,
        )

        if not crops:
            continue

        if isinstance(crops, str):

            crop_list = crops.split(",")

            for crop in crop_list:

                crop = crop.strip()

                if crop:
                    crop_counter[crop] += 1

    crop_distribution = [
        {
            "crop": crop,
            "count": count,
        }
        for crop, count
        in crop_counter.most_common()
    ]

    # --------------------------------------------------------
    # Consultation activity by month
    # --------------------------------------------------------

    monthly_counter = Counter()

    for conversation in conversations:

        date = (
            conversation.created_at
            or conversation.updated_at
        )

        if date:

            month = date.strftime("%Y-%m")

            monthly_counter[month] += 1

    consultation_trends = [
        {
            "month": month,
            "consultations": count,
        }
        for month, count
        in sorted(monthly_counter.items())
    ]

    return {
        "total_farmers":
            total_farmers,

        "total_consultations":
            total_consultations,

        "total_messages":
            total_messages,

        "crop_distribution":
            crop_distribution,

        "consultation_trends":
            consultation_trends,
    }