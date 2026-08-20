from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    # ============================================================
    # BASIC USER INFORMATION
    # ============================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    full_name = Column(
        String(100),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(30),
        nullable=False,
        default="farmer",
    )

    # ============================================================
    # CONTACT
    # ============================================================

    phone = Column(
        String(30),
        nullable=True,
    )

    location = Column(
        String(255),
        nullable=True,
    )

    state = Column(
        String(100),
        nullable=True,
    )

    country = Column(
        String(100),
        nullable=True,
        default="India",
    )

    # ============================================================
    # FARM INFORMATION
    # ============================================================

    farm_location = Column(
        String(255),
        nullable=True,
    )

    farm_size = Column(
        Float,
        nullable=True,
    )

    soil_type = Column(
        String(100),
        nullable=True,
    )

    primary_crops = Column(
        String(255),
        nullable=True,
    )
    # ============================================================
    # CONSULTANT INFORMATION
    # ============================================================

    specialization = Column(
        String(255),
        nullable=True,
    )

    experience = Column(
        Integer,
        nullable=True,
    )

    qualification = Column(
        String(255),
        nullable=True,
    )
    # ============================================================
    # PROFILE
    # ============================================================

    profile_image = Column(
        String(500),
        nullable=True,
    )

    # ============================================================
    # TIMESTAMPS
    # ============================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )

    # ============================================================
    # PREDICTION RELATIONSHIP
    # ============================================================

    predictions = relationship(
        "PredictionHistory",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # ============================================================
    # CHAT RELATIONSHIPS
    # ============================================================

    # Conversations started by this user as a farmer
    farmer_conversations = relationship(
        "Conversation",
        foreign_keys="Conversation.farmer_id",
        back_populates="farmer",
        cascade="all, delete-orphan",
    )

    # Conversations where this user is the consultant
    consultant_conversations = relationship(
        "Conversation",
        foreign_keys="Conversation.consultant_id",
        back_populates="consultant",
        cascade="all, delete-orphan",
    )