from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database.base import Base


class FooterLink(Base):
    __tablename__ = "footer_links"

    id = Column(Integer, primary_key=True, index=True)
    group_label = Column(String(100), nullable=False, index=True)  # 'Quick Links', 'Support', 'Legal', 'Connect'
    label = Column(String(200), nullable=False)
    url = Column(String(500), nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)