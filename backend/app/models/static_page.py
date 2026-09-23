from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.database.base import Base


class StaticPage(Base):
    __tablename__ = "static_pages"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)  # 'about', 'careers', 'contact', 'privacy-policy', 'refund-policy', 'terms'
    title = Column(String(300), nullable=False)
    body_blocks = Column(JSON, nullable=True, default=list)  # array of {type: 'paragraph|heading|image|list', content: '...'}
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)