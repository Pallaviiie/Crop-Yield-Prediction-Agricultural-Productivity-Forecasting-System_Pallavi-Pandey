from collections import Counter
from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from pydantic import BaseModel, Field

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message

from app.routers.users import get_authenticated_user


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# ============================================================
# SCHEMAS
# ============================================================

class ConversationCreate(BaseModel):
    consultant_id: int


class MessageCreate(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )


# ============================================================
# HELPERS
# ============================================================

def require_farmer(current_user: User):
    """
    Allow only farmers to access farmer-specific chat actions.
    """

    if current_user.role != "farmer":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only farmers can perform this action."
            ),
        )


def require_consultant(current_user: User):
    """
    Allow only consultants to access consultant-specific
    chat actions.
    """

    if current_user.role != "consultant":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only agricultural consultants can "
                "perform this action."
            ),
        )


def consultant_response(user: User):
    """
    Convert consultant database object into API response.
    """

    return {
        "id": user.id,

        "full_name": user.full_name,

        "email": user.email,

        "role": user.role,

        "phone": getattr(
            user,
            "phone",
            None,
        ),

        "location": getattr(
            user,
            "location",
            None,
        ),

        "state": getattr(
            user,
            "state",
            None,
        ),

        "country": getattr(
            user,
            "country",
            None,
        ),

        "profile_image": getattr(
            user,
            "profile_image",
            None,
        ),

        "specialization": getattr(
            user,
            "specialization",
            None,
        ),

        "experience": getattr(
            user,
            "experience",
            None,
        ),

        "qualification": getattr(
            user,
            "qualification",
            None,
        ),
    }


def farmer_response(farmer: User):
    """
    Convert farmer database object into API response.
    """

    return {
        "id": farmer.id,

        "full_name": farmer.full_name,

        "email": farmer.email,

        "role": farmer.role,

        "phone": getattr(
            farmer,
            "phone",
            None,
        ),

        "location": getattr(
            farmer,
            "location",
            None,
        ),

        "state": getattr(
            farmer,
            "state",
            None,
        ),

        "country": getattr(
            farmer,
            "country",
            None,
        ),

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


def message_response(message: Message):
    """
    Convert message database object into API response.
    """

    return {
        "id": message.id,

        "conversation_id":
            message.conversation_id,

        "sender_id":
            message.sender_id,

        "message":
            message.message,

        "is_read":
            message.is_read,

        "created_at":
            message.created_at,

        "sender": (
            {
                "id": message.sender.id,

                "full_name":
                    message.sender.full_name,

                "role":
                    message.sender.role,

                "profile_image":
                    getattr(
                        message.sender,
                        "profile_image",
                        None,
                    ),
            }
            if message.sender
            else None
        ),
    }


def conversation_response(
    conversation: Conversation,
    current_user_id: int,
):
    """
    Convert conversation into API response.

    If current user is the farmer:
        other_user = consultant

    If current user is the consultant:
        other_user = farmer
    """

    if conversation.farmer_id == current_user_id:

        other_user = conversation.consultant

    else:

        other_user = conversation.farmer

    # --------------------------------------------------------
    # Latest message
    # --------------------------------------------------------

    last_message = (
        conversation.messages[-1]
        if conversation.messages
        else None
    )

    # --------------------------------------------------------
    # Unread messages
    # --------------------------------------------------------

    unread_count = sum(
        1
        for message in conversation.messages
        if (
            message.sender_id != current_user_id
            and not message.is_read
        )
    )

    return {
        "id":
            conversation.id,

        "farmer_id":
            conversation.farmer_id,

        "consultant_id":
            conversation.consultant_id,

        "created_at":
            conversation.created_at,

        "updated_at":
            conversation.updated_at,

        "other_user": (
            {
                "id":
                    other_user.id,

                "full_name":
                    other_user.full_name,

                "email":
                    other_user.email,

                "role":
                    other_user.role,

                "profile_image":
                    getattr(
                        other_user,
                        "profile_image",
                        None,
                    ),

                "phone":
                    getattr(
                        other_user,
                        "phone",
                        None,
                    ),

                "location":
                    getattr(
                        other_user,
                        "location",
                        None,
                    ),

                "state":
                    getattr(
                        other_user,
                        "state",
                        None,
                    ),

                "country":
                    getattr(
                        other_user,
                        "country",
                        None,
                    ),

                "specialization":
                    getattr(
                        other_user,
                        "specialization",
                        None,
                    ),

                "experience":
                    getattr(
                        other_user,
                        "experience",
                        None,
                    ),

                "qualification":
                    getattr(
                        other_user,
                        "qualification",
                        None,
                    ),
            }
            if other_user
            else None
        ),

        "last_message": (
            message_response(last_message)
            if last_message
            else None
        ),

        "unread_count":
            unread_count,
    }


# ============================================================
# GET CONSULTANTS
# ============================================================
#
# Farmer uses this endpoint to display:
#
# Select Agricultural Consultant
#
# Example:
#
# GET /chat/consultants
#
# ============================================================

@router.get("/consultants")
def get_consultants(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only farmers can browse consultants
    # --------------------------------------------------------

    require_farmer(current_user)

    # --------------------------------------------------------
    # Get all registered consultants
    # --------------------------------------------------------

    consultants = (
        db.query(User)
        .filter(
            User.role == "consultant"
        )
        .order_by(
            User.full_name.asc()
        )
        .all()
    )

    return [
        consultant_response(
            consultant
        )
        for consultant in consultants
    ]


# ============================================================
# CREATE / GET CONVERSATION
# ============================================================
#
# Farmer selects a consultant and frontend sends:
#
# POST /chat/conversations
#
# {
#     "consultant_id": 5
# }
#
# If conversation already exists:
#     return existing conversation
#
# Otherwise:
#     create new conversation
#
# ============================================================

@router.post("/conversations")
def create_conversation(
    conversation_data: ConversationCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only farmers can start consultant conversations
    # --------------------------------------------------------

    require_farmer(current_user)

    # --------------------------------------------------------
    # Validate consultant ID
    # --------------------------------------------------------

    if conversation_data.consultant_id <= 0:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid consultant ID.",
        )

    # --------------------------------------------------------
    # Find consultant
    # --------------------------------------------------------

    consultant = (
        db.query(User)
        .filter(
            User.id
            == conversation_data.consultant_id
        )
        .first()
    )

    # --------------------------------------------------------
    # Consultant does not exist
    # --------------------------------------------------------

    if consultant is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found.",
        )

    # --------------------------------------------------------
    # Make sure selected user is actually a consultant
    # --------------------------------------------------------

    if consultant.role != "consultant":

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Selected user is not "
                "an agricultural consultant."
            ),
        )

    # --------------------------------------------------------
    # Check whether conversation already exists
    # --------------------------------------------------------

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.farmer_id
            == current_user.id,

            Conversation.consultant_id
            == consultant.id,
        )
        .first()
    )

    # --------------------------------------------------------
    # Create conversation if it doesn't exist
    # --------------------------------------------------------

    if conversation is None:

        conversation = Conversation(
            farmer_id=current_user.id,

            consultant_id=consultant.id,
        )

        db.add(conversation)

        db.commit()

        db.refresh(conversation)

    # --------------------------------------------------------
    # Return conversation
    # --------------------------------------------------------

    return conversation_response(
        conversation,
        current_user.id,
    )


# ============================================================
# GET MY CONVERSATIONS
# ============================================================
#
# Works for both:
#     Farmer
#     Consultant
#
# Farmer gets conversations with consultants.
#
# Consultant gets conversations with farmers.
#
# ============================================================

@router.get("/conversations")
def get_my_conversations(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    conversations = (
        db.query(Conversation)
        .filter(
            (
                Conversation.farmer_id
                == current_user.id
            )
            |
            (
                Conversation.consultant_id
                == current_user.id
            )
        )
        .order_by(
            Conversation.updated_at.desc()
        )
        .all()
    )

    return [
        conversation_response(
            conversation,
            current_user.id,
        )
        for conversation in conversations
    ]


# ============================================================
# GET SINGLE CONVERSATION
# ============================================================
#
# Useful when frontend selects a consultant and wants to
# immediately load that conversation.
#
# GET /chat/conversations/{conversation_id}
#
# ============================================================

@router.get(
    "/conversations/{conversation_id}"
)
def get_conversation(
    conversation_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Find conversation
    # --------------------------------------------------------

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # --------------------------------------------------------
    # Verify participant
    # --------------------------------------------------------

    if (
        conversation.farmer_id
        != current_user.id
        and
        conversation.consultant_id
        != current_user.id
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not a participant "
                "of this conversation."
            ),
        )

    return conversation_response(
        conversation,
        current_user.id,
    )


# ============================================================
# GET MESSAGES
# ============================================================
#
# GET:
#
# /chat/conversations/1/messages
#
# ============================================================

@router.get(
    "/conversations/{conversation_id}/messages"
)
def get_messages(
    conversation_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Find conversation
    # --------------------------------------------------------

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # --------------------------------------------------------
    # Verify participant
    # --------------------------------------------------------

    if (
        conversation.farmer_id
        != current_user.id
        and
        conversation.consultant_id
        != current_user.id
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not a participant "
                "of this conversation."
            ),
        )

    # --------------------------------------------------------
    # Get messages
    # --------------------------------------------------------

    messages = (
        db.query(Message)
        .filter(
            Message.conversation_id
            == conversation_id
        )
        .order_by(
            Message.created_at.asc()
        )
        .all()
    )

    return [
        message_response(message)
        for message in messages
    ]


# ============================================================
# SEND MESSAGE
# ============================================================
#
# POST:
#
# /chat/conversations/1/messages
#
# {
#     "message": "Which fertilizer should I use?"
# }
#
# ============================================================

@router.post(
    "/conversations/{conversation_id}/messages"
)
def send_message(
    conversation_id: int,

    message_data: MessageCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Clean message
    # --------------------------------------------------------

    message_text = (
        message_data.message.strip()
    )

    if not message_text:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty.",
        )

    # --------------------------------------------------------
    # Find conversation
    # --------------------------------------------------------

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # --------------------------------------------------------
    # Verify participant
    # --------------------------------------------------------

    if (
        conversation.farmer_id
        != current_user.id
        and
        conversation.consultant_id
        != current_user.id
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not a participant "
                "of this conversation."
            ),
        )

    # --------------------------------------------------------
    # Create message
    # --------------------------------------------------------

    new_message = Message(
        conversation_id=
            conversation.id,

        sender_id=
            current_user.id,

        message=
            message_text,

        is_read=False,
    )

    db.add(new_message)

    # --------------------------------------------------------
    # Update conversation
    # --------------------------------------------------------

    conversation.updated_at = datetime.utcnow()

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.commit()

    db.refresh(new_message)

    # --------------------------------------------------------
    # Return created message
    # --------------------------------------------------------

    return message_response(
        new_message
    )


# ============================================================
# MARK MESSAGE AS READ
# ============================================================
#
# PUT:
#
# /chat/messages/10/read
#
# ============================================================

@router.put(
    "/messages/{message_id}/read"
)
def mark_message_read(
    message_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Find message
    # --------------------------------------------------------

    message = (
        db.query(Message)
        .filter(
            Message.id
            == message_id
        )
        .first()
    )

    if message is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    # --------------------------------------------------------
    # Find conversation
    # --------------------------------------------------------

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == message.conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # --------------------------------------------------------
    # Verify participant
    # --------------------------------------------------------

    if (
        conversation.farmer_id
        != current_user.id
        and
        conversation.consultant_id
        != current_user.id
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You cannot modify "
                "this message."
            ),
        )

    # --------------------------------------------------------
    # Don't mark own message as read
    # --------------------------------------------------------

    if message.sender_id == current_user.id:

        return {
            "message":
                "Own message.",

            "message_id":
                message.id,
        }

    # --------------------------------------------------------
    # Mark as read
    # --------------------------------------------------------

    message.is_read = True

    db.commit()

    return {
        "message":
            "Message marked as read.",

        "message_id":
            message.id,
    }


# ============================================================
# MARK ALL MESSAGES IN CONVERSATION AS READ
# ============================================================
#
# Useful when consultant/farmer opens a conversation.
#
# PUT:
#
# /chat/conversations/1/read
#
# ============================================================

@router.put(
    "/conversations/{conversation_id}/read"
)
def mark_conversation_read(
    conversation_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Find conversation
    # --------------------------------------------------------

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == conversation_id
        )
        .first()
    )

    if conversation is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    # --------------------------------------------------------
    # Verify participant
    # --------------------------------------------------------

    if (
        conversation.farmer_id
        != current_user.id
        and
        conversation.consultant_id
        != current_user.id
    ):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not a participant "
                "of this conversation."
            ),
        )

    # --------------------------------------------------------
    # Mark incoming messages as read
    # --------------------------------------------------------

    updated_count = 0

    for message in conversation.messages:

        if (
            message.sender_id
            != current_user.id
            and
            not message.is_read
        ):

            message.is_read = True

            updated_count += 1

    db.commit()

    return {
        "message":
            "Conversation marked as read.",

        "conversation_id":
            conversation.id,

        "updated_count":
            updated_count,
    }


# ============================================================
# GET REGISTERED FARMERS FOR CONSULTANT
# ============================================================
#
# GET:
#
# /chat/farmers
#
# ============================================================

@router.get("/farmers")
def get_farmers_for_consultant(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only consultants
    # --------------------------------------------------------

    require_consultant(current_user)

    # --------------------------------------------------------
    # Get farmers
    # --------------------------------------------------------

    farmers = (
        db.query(User)
        .filter(
            User.role == "farmer"
        )
        .order_by(
            User.full_name.asc()
        )
        .all()
    )

    return [
        farmer_response(farmer)
        for farmer in farmers
    ]


# ============================================================
# GET PENDING CONSULTATIONS
# ============================================================
#
# GET:
#
# /chat/pending
#
# Consultant dashboard uses this to show:
#
# New consultation requests
#
# ============================================================

@router.get("/pending")
def get_pending_consultations(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only consultants
    # --------------------------------------------------------

    require_consultant(current_user)

    # --------------------------------------------------------
    # Get consultant conversations
    # --------------------------------------------------------

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

    pending = []

    # --------------------------------------------------------
    # Check each conversation
    # --------------------------------------------------------

    for conversation in conversations:

        # ----------------------------------------------------
        # Get latest message
        # ----------------------------------------------------

        last_message = (
            db.query(Message)
            .filter(
                Message.conversation_id
                == conversation.id
            )
            .order_by(
                Message.created_at.desc()
            )
            .first()
        )

        # ----------------------------------------------------
        # No messages means nothing is pending
        # ----------------------------------------------------

        if not last_message:

            continue

        # ----------------------------------------------------
        # Pending means:
        #
        # latest message belongs to farmer
        # AND consultant has not read it
        # ----------------------------------------------------

        if (
            last_message.sender_id
            == conversation.farmer_id
            and
            not last_message.is_read
        ):

            farmer = conversation.farmer

            pending.append(
                {
                    "conversation_id":
                        conversation.id,

                    "farmer": (
                        farmer_response(
                            farmer
                        )
                        if farmer
                        else None
                    ),

                    "message":
                        last_message.message,

                    "created_at":
                        last_message.created_at,

                    "is_read":
                        last_message.is_read,

                    "priority":
                        "medium",
                }
            )

    return pending


# ============================================================
# GET PENDING COUNT
# ============================================================
#
# Useful for consultant dashboard notification badge.
#
# GET:
#
# /chat/pending/count
#
# ============================================================

@router.get("/pending/count")
def get_pending_count(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only consultants
    # --------------------------------------------------------

    require_consultant(current_user)

    # --------------------------------------------------------
    # Get consultant conversations
    # --------------------------------------------------------

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id
            == current_user.id
        )
        .all()
    )

    pending_count = 0

    # --------------------------------------------------------
    # Count conversations whose latest message is an
    # unread farmer message
    # --------------------------------------------------------

    for conversation in conversations:

        last_message = (
            db.query(Message)
            .filter(
                Message.conversation_id
                == conversation.id
            )
            .order_by(
                Message.created_at.desc()
            )
            .first()
        )

        if not last_message:

            continue

        if (
            last_message.sender_id
            == conversation.farmer_id
            and
            not last_message.is_read
        ):

            pending_count += 1

    return {
        "pending_count":
            pending_count
    }


# ============================================================
# CONSULTANT: GET MY CONSULTATIONS
# ============================================================
#
# GET:
#
# /chat/consultant/consultations
#
# ============================================================

@router.get(
    "/consultant/consultations"
)
def get_consultant_consultations(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only consultants
    # --------------------------------------------------------

    require_consultant(current_user)

    # --------------------------------------------------------
    # Get conversations
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Process conversations
    # --------------------------------------------------------

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
                message.sender_id
                != current_user.id
                and
                not message.is_read
            )
        )

        result.append(
            {
                "id":
                    conversation.id,

                "farmer": (
                    farmer_response(
                        farmer
                    )
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
                        "id":
                            last_message.id,

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
# CONSULTANT ANALYTICS
# ============================================================
#
# GET:
#
# /chat/consultant/analytics
#
# ============================================================

@router.get(
    "/consultant/analytics"
)
def get_consultant_analytics(
    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only consultants
    # --------------------------------------------------------

    require_consultant(current_user)

    # --------------------------------------------------------
    # Farmers
    # --------------------------------------------------------

    farmers = (
        db.query(User)
        .filter(
            User.role == "farmer"
        )
        .all()
    )

    total_farmers = len(farmers)

    # --------------------------------------------------------
    # Consultant conversations
    # --------------------------------------------------------

    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.consultant_id
            == current_user.id
        )
        .all()
    )

    total_consultations = len(
        conversations
    )

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

        # ----------------------------------------------------
        # If crops are stored as comma-separated text
        # ----------------------------------------------------

        if isinstance(crops, str):

            crop_list = crops.split(",")

            for crop in crop_list:

                crop = crop.strip()

                if crop:

                    crop_counter[
                        crop
                    ] += 1

    crop_distribution = [
        {
            "crop":
                crop,

            "count":
                count,
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
            or
            conversation.updated_at
        )

        if date:

            month = date.strftime(
                "%Y-%m"
            )

            monthly_counter[
                month
            ] += 1

    consultation_trends = [
        {
            "month":
                month,

            "consultations":
                count,
        }

        for month, count
        in sorted(
            monthly_counter.items()
        )
    ]

    # --------------------------------------------------------
    # Return analytics
    # --------------------------------------------------------

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