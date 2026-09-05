from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func

from app.database.db import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Consultant who receives the alert
    consultant_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Farmer related to the alert
    farmer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    # Optional prediction related to the alert
    prediction_id = Column(
        Integer,
        ForeignKey(
            "prediction_history.id",
            ondelete="SET NULL"
        ),
        nullable=True,
        index=True
    )

    # Alert category
    alert_type = Column(
        String(50),
        nullable=False,
        default="general",
        index=True
    )

    # Severity
    severity = Column(
        String(20),
        nullable=False,
        default="info",
        index=True
    )

    # Short title
    title = Column(
        String(255),
        nullable=False
    )

    # Full alert message
    message = Column(
        Text,
        nullable=False
    )

    # Read/unread
    is_read = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    read_at = Column(
        DateTime(timezone=True),
        nullable=True
    )