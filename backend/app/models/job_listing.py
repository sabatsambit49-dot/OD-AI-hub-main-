from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.database.base import Base


class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    department = Column(String(150), nullable=True)
    location = Column(String(200), nullable=True)
    type = Column(String(50), default="full-time", nullable=False)  # 'full-time', 'part-time', 'contract', 'internship'
    description = Column(Text, nullable=True)
    is_open = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)