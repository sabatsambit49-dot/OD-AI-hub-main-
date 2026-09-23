from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.database.base import Base


class SuccessStory(Base):
    __tablename__ = "success_stories"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False, index=True)  # 'student', 'startup', 'business', 'institution'
    name = Column(String(200), nullable=False)
    role_or_organization = Column(String(200), nullable=True)
    photo_url = Column(String(500), nullable=True)
    quote = Column(Text, nullable=False)
    outcome = Column(Text, nullable=True)  # measurable outcome
    is_published = Column(Boolean, default=False, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)