from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base


class NavbarItem(Base):
    __tablename__ = "navbar_items"

    id = Column(Integer, primary_key=True, index=True)
    pillar_id = Column(Integer, ForeignKey("pillars.id", ondelete="SET NULL"), nullable=True, index=True)
    label = Column(String(200), nullable=False)
    url = Column(String(500), nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    pillar = relationship("Pillar")