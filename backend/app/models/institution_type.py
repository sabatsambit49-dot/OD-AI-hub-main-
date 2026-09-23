from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.base import Base

class InstitutionType(Base):
    __tablename__ = "institution_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)

    institutions = relationship("Institution", back_populates="institution_type")
