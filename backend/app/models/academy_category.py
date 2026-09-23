from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class AcademyCategory(Base):
    __tablename__ = "academy_categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    tagline = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    accent_color = Column(String(50), default="#0082ff", nullable=False)
    icon_letter = Column(String(10), default="A", nullable=False)
    image_url = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    courses = relationship("Course", back_populates="category", cascade="all, delete-orphan")
