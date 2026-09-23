from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.base import Base

class InformationPost(Base):
    __tablename__ = "information_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    tag = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    posted_at = Column(DateTime, default=datetime.utcnow)
