from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base


class Offering(Base):
    __tablename__ = "offerings"

    id = Column(Integer, primary_key=True, index=True)
    pillar_section_id = Column(Integer, ForeignKey("pillar_sections.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    highlights = Column(JSON, nullable=True, default=list)  # list of highlight strings
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    section = relationship("PillarSection", back_populates="offerings")