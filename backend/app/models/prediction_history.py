from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.db import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    area = Column(
        String,
        nullable=False,
    )

    crop = Column(
        String,
        nullable=False,
    )

    year = Column(
        Integer,
        nullable=False,
    )

    season = Column(
        String,
        nullable=True,
        index=True
    )

    rainfall = Column(
        Float,
        nullable=True,
    )

    temperature = Column(
        Float,
        nullable=True,
    )

    humidity = Column(
        Float,
        nullable=True,
    )

    wind_speed = Column(
        Float,
        nullable=True,
    )

    pesticides = Column(
        Float,
        nullable=True,
    )

    predicted_yield = Column(
        Float,
        nullable=False,
    )

    recommendation = Column(
        String,
        nullable=True,
    )

    category = Column(
        String,
        nullable=False,
        default="Average",
    )

    confidence = Column(
        Integer,
        nullable=False,
        default=0,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # ========================================================
    # RELATIONSHIP
    # ========================================================

    user = relationship(
        "User",
        back_populates="predictions",
    )