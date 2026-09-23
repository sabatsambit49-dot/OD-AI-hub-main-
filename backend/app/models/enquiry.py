from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(150), nullable=True)
    class_or_degree = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="new", nullable=False)  # 'new', 'contacted', 'closed'
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="enquiries")
