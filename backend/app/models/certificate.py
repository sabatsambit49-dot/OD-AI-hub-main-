from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.base import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(100), unique=True, index=True, nullable=False)  # e.g., "ODAI-2024-001"
    holder_name = Column(String(200), nullable=False)
    program = Column(String(300), nullable=False)
    issued_on = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)