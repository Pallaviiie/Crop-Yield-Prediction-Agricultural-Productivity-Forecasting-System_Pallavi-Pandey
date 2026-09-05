from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime


from app.database.db import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)

    # Main activity title
    action = Column(String(255), nullable=False)

    # Person who performed/caused the activity
    actor_id = Column(Integer, nullable=True, index=True)
    actor_name = Column(String(255), nullable=True)
    actor_role = Column(String(50), nullable=True)

    # Extra information displayed below the action
    details = Column(Text, nullable=True)

    # success / info / warning / danger
    type = Column(
        String(30),
        nullable=False,
        default="info",
    )

    timestamp = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True,
    )