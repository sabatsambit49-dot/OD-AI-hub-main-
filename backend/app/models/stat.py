from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database.base import Base

class Stat(Base):
    __tablename__ = "stats"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(150), nullable=False)
    value = Column(Integer, nullable=False, default=0)
    suffix = Column(String(20), nullable=True, default="")
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
