from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.base import Base


class ProblemStatement(Base):
    __tablename__ = "problem_statements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    category = Column(String, nullable=True, index=True)
    organization = Column(String, nullable=True)
    difficulty = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
