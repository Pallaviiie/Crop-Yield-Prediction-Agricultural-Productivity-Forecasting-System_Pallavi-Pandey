from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
)

from sqlalchemy.sql import func

from app.database.db import Base


class AdminDataset(Base):
    __tablename__ = "admin_datasets"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(255),
        nullable=False,
    )

    type = Column(
        String(100),
        nullable=False,
        default="CSV",
    )

    description = Column(
        Text,
        nullable=True,
    )

    records = Column(
        Integer,
        nullable=False,
        default=0,
    )

    columns = Column(
        Integer,
        nullable=False,
        default=0,
    )

    status = Column(
        String(30),
        nullable=False,
        default="Active",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )