from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    district_id = Column(Integer, ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    institution_type_id = Column(Integer, ForeignKey("institution_types.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False, index=True)
    address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    district = relationship("District", back_populates="institutions")
    institution_type = relationship("InstitutionType", back_populates="institutions")
    courses = relationship("Course", back_populates="institution", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="institution", cascade="all, delete-orphan")
