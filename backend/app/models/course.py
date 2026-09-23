from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Numeric, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    
    # Institution Hierarchy link (Nullable for standalone Academy courses)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=True)
    
    # Core naming (name and title kept synchronized for backward compatibility)
    name = Column(String, nullable=True)
    title = Column(String(250), nullable=True)
    slug = Column(String(200), unique=True, index=True, nullable=True)
    
    # Academy categorization
    category_id = Column(Integer, ForeignKey("academy_categories.id", ondelete="SET NULL"), nullable=True, index=True)
    group_label = Column(String(100), nullable=True)  # e.g., "Class 5-7", "Class 8-10", "B.Tech", "BCA", etc.
    target_audience = Column(Text, nullable=True)     # Who the course is for
    
    # Duration and Delivery
    duration_value = Column(Integer, nullable=True)
    duration_unit = Column(String(50), nullable=True, default="weeks")  # 'weeks', 'months', 'hours'
    mode = Column(String(50), default="online", nullable=False)          # 'online', 'offline', 'hybrid'
    
    # Pricing (Portable Numeric)
    price = Column(Numeric(10, 2), default=0.00, nullable=False)
    discount_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String(10), default="INR", nullable=False)
    is_free = Column(Boolean, default=False, nullable=False)
    batch_size = Column(Integer, nullable=True)  # total seats or batch capacity
    
    # Descriptions & Syllabus
    description = Column(Text, nullable=True)        # Legacy field
    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)
    highlights = Column(JSON, nullable=True, default=list)  # Syllabus or highlights list
    prerequisites = Column(Text, nullable=True)
    
    # Schedule & Accreditation
    start_date = Column(DateTime, nullable=True)
    certificate_included = Column(Boolean, default=True, nullable=False)
    image_url = Column(String(500), nullable=True)
    
    # Status & Ordering
    is_featured = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    display_order = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    institution = relationship("Institution", back_populates="courses")
    branches = relationship("Branch", back_populates="course", cascade="all, delete-orphan")
    category = relationship("AcademyCategory", back_populates="courses")
    enquiries = relationship("Enquiry", back_populates="course", cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        # Auto-sync title and name if one is provided
        if "title" in kwargs and "name" not in kwargs:
            kwargs["name"] = kwargs["title"]
        elif "name" in kwargs and "title" not in kwargs:
            kwargs["title"] = kwargs["name"]
        if "short_description" in kwargs and "description" not in kwargs:
            kwargs["description"] = kwargs["short_description"]
        elif "description" in kwargs and "short_description" not in kwargs:
            kwargs["short_description"] = kwargs["description"]
        super().__init__(**kwargs)
