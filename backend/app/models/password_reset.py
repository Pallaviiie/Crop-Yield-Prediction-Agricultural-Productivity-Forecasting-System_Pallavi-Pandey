from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from app.database.db import Base


class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), nullable=False, index=True)

    otp = Column(String(6), nullable=False)

    expires_at = Column(DateTime, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )