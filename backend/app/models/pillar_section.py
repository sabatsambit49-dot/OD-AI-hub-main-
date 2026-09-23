from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class PillarSection(Base):
    __tablename__ = "pillar_sections"

    id = Column(Integer, primary_key=True, index=True)
    pillar_id = Column(Integer, ForeignKey("pillars.id", ondelete="CASCADE"), nullable=False, index=True)
    audience_id = Column(Integer, ForeignKey("institution_audiences.id", ondelete="SET NULL"), nullable=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    accent_color = Column(String(50), nullable=True)
    icon = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    pillar = relationship("Pillar", back_populates="sections")
    audience = relationship("InstitutionAudience", back_populates="sections")
    offerings = relationship("Offering", back_populates="section", cascade="all, delete-orphan")