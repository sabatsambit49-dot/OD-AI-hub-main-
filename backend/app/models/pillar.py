from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base


class Pillar(Base):
    __tablename__ = "pillars"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    tagline = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    accent_color = Column(String(50), default="#0082ff", nullable=False)
    icon = Column(String(50), nullable=True)  # icon name or letter
    hero_image_url = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sections = relationship("PillarSection", back_populates="pillar", cascade="all, delete-orphan")