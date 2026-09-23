from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base


class PublicEvent(Base):
    __tablename__ = "public_events"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False, index=True)  # 'workshop', 'hackathon', 'demo_class', 'seminar'
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False, index=True)
    mode = Column(String(50), default="online", nullable=False)  # 'online', 'offline', 'hybrid'
    location = Column(String(300), nullable=True)
    registration_open = Column(Boolean, default=True, nullable=False)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="draft", nullable=False)  # 'draft', 'published', 'archived'
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("public_events.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(150), nullable=True)
    organization = Column(String(200), nullable=True)
    status = Column(String(50), default="registered", nullable=False)  # 'registered', 'attended', 'cancelled'
    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("PublicEvent", back_populates="registrations")