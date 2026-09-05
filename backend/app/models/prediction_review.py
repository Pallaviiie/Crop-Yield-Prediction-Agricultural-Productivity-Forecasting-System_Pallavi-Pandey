# ============================================================
# app/models/prediction_review.py
# ============================================================

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.db import Base


class PredictionReview(Base):

    __tablename__ = "prediction_reviews"

    # ========================================================
    # PRIMARY KEY
    # ========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ========================================================
    # PREDICTION
    # ========================================================

    prediction_id = Column(
        Integer,
        ForeignKey(
            "prediction_history.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ========================================================
    # CONSULTANT
    # ========================================================

    consultant_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ========================================================
    # REVIEW STATUS
    # ========================================================

    status = Column(
        String(30),
        nullable=False,
        default="pending",
        index=True,
    )

    # Possible values:
    #
    # pending
    # approved
    # needs_changes
    # rejected

    # ========================================================
    # CONSULTANT COMMENT
    # ========================================================

    comment = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    # ========================================================
    # RELATIONSHIPS
    # ========================================================

    prediction = relationship(
        "PredictionHistory",
        foreign_keys=[prediction_id],
    )

    consultant = relationship(
        "User",
        foreign_keys=[consultant_id],
    )

    # ========================================================
    # PREVENT DUPLICATE REVIEW
    # ========================================================

    __table_args__ = (
        UniqueConstraint(
            "prediction_id",
            "consultant_id",
            name="uq_prediction_consultant_review",
        ),
    )