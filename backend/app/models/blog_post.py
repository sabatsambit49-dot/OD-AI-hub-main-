from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.database.base import Base


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    title = Column(String(300), nullable=False)
    excerpt = Column(Text, nullable=True)
    body = Column(Text, nullable=True)  # Markdown or HTML
    cover_image_url = Column(String(500), nullable=True)
    published_at = Column(DateTime, nullable=True, index=True)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)