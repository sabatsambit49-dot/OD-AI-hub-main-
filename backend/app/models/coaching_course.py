from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base


class CoachingCourse(Base):
    __tablename__ = "coaching_courses"

    id = Column(Integer, primary_key=True, index=True)
    coaching_id = Column(Integer, ForeignKey("coaching_centers.id", ondelete="CASCADE"), nullable=False)
    course_name = Column(String, nullable=False)
    price = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    syllabus_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    coaching = relationship("Coaching", back_populates="courses")
