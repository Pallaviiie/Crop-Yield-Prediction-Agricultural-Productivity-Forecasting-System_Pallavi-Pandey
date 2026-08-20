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
# USER RESPONSE
# ============================================================

def consultant_response(user: User):

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "phone": getattr(user, "phone", None),
        "location": getattr(user, "location", None),
        "state": getattr(user, "state", None),
        "country": getattr(user, "country", None),
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


# ============================================================
# MESSAGE RESPONSE
# ============================================================

def message_response(message: Message):

    return {
        "id": message.id,
        "conversation_id": message.conversation_id,
        "sender_id": message.sender_id,
        "message": message.message,
        "is_read": message.is_read,
        "created_at": message.created_at,
        "sender": (
            {
                "id": message.sender.id,
                "full_name": message.sender.full_name,
                "role": message.sender.role,
                "profile_image": getattr(
                    message.sender,
                    "profile_image",
                    None,
                ),
            }
            if message.sender
            else None
        ),
    }


# ============================================================
# CONVERSATION RESPONSE
# ============================================================

def conversation_response(
    conversation: Conversation,
    current_user_id: int,
):

    if conversation.farmer_id == current_user_id:

        other_user = conversation.consultant

    else:

        other_user = conversation.farmer

    last_message = (
        conversation.messages[-1]
        if conversation.messages
        else None
    )

    unread_count = sum(
        1
        for message in conversation.messages
        if (
            message.sender_id != current_user_id
            and not message.is_read
        )
    )

    return {
        "id": conversation.id,

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
                "id": other_user.id,
                "full_name": other_user.full_name,
                "email": other_user.email,
                "role": other_user.role,
                "profile_image": getattr(
                    other_user,
                    "profile_image",
                    None,
                ),
                "phone": getattr(
                    other_user,
                    "phone",
                    None,
                ),
                "location": getattr(
                    other_user,
                    "location",
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

@router.get("/consultants")
def get_consultants(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only farmers should browse consultants
    # --------------------------------------------------------

    if current_user.role != "farmer":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only farmers can view "
                "agricultural consultants."
            ),
        )

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

@router.post("/conversations")
def create_conversation(
    conversation_data: ConversationCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_authenticated_user
    ),
):

    # --------------------------------------------------------
    # Only farmers can initiate conversations
    # --------------------------------------------------------

    if current_user.role != "farmer":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only farmers can start "
                "a consultant conversation."
            ),
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

    if consultant is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found.",
        )

    # --------------------------------------------------------
    # Verify consultant role
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
    # Check existing conversation
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
    # Create if doesn't exist
    # --------------------------------------------------------

    if conversation is None:

        conversation = Conversation(
            farmer_id=current_user.id,
            consultant_id=consultant.id,
        )

        db.add(conversation)

        db.commit()

        db.refresh(conversation)

    return conversation_response(
        conversation,
        current_user.id,
    )


# ============================================================
# GET MY CONVERSATIONS
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
# GET MESSAGES
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
        conversation_id=conversation.id,
        sender_id=current_user.id,
        message=message_text,
        is_read=False,
    )

    db.add(new_message)

    # --------------------------------------------------------
    # Update conversation timestamp
    # --------------------------------------------------------

    conversation.updated_at = datetime.utcnow()

    db.commit()

    db.refresh(new_message)

    return message_response(
        new_message
    )


# ============================================================
# MARK MESSAGE AS READ
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

    message = (
        db.query(Message)
        .filter(
            Message.id == message_id
        )
        .first()
    )

    if message is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

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
    # Don't mark your own message as read
    # --------------------------------------------------------

    if message.sender_id == current_user.id:

        return {
            "message": "Own message."
        }

    message.is_read = True

    db.commit()

    return {
        "message": "Message marked as read.",
        "message_id": message.id,
    }