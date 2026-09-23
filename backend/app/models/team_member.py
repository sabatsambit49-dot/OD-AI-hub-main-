from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.database.base import Base


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    photo_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)