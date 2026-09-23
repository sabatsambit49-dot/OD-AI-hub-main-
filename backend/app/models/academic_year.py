from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    year_label = Column(String, nullable=False)  # e.g., '1st Year', '2nd Year'
    total_seats = Column(Integer, default=0, nullable=False)
    student_strength = Column(Integer, default=0, nullable=False)
    college_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    branch = relationship("Branch", back_populates="academic_years")
    syllabus_entries = relationship("SyllabusEntry", back_populates="academic_year", cascade="all, delete-orphan")
