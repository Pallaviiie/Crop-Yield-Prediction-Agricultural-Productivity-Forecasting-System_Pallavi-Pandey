from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)

from sqlalchemy.orm import relationship

from app.database.db import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    farmer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    consultant_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # ============================================================
    # RELATIONSHIPS
    # ============================================================

    farmer = relationship(
        "User",
        foreign_keys=[farmer_id],
        back_populates="farmer_conversations",
    )

    consultant = relationship(
        "User",
        foreign_keys=[consultant_id],
        back_populates="consultant_conversations",
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )

    # ============================================================
    # UNIQUE FARMER + CONSULTANT
    # ============================================================

    __table_args__ = (
        UniqueConstraint(
            "farmer_id",
            "consultant_id",
            name="unique_farmer_consultant_conversation",
        ),
    )