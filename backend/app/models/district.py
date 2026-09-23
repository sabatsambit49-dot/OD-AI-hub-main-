from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    state_id = Column(Integer, ForeignKey("states.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False, index=True)

    state = relationship("State", back_populates="districts")
    institutions = relationship("Institution", back_populates="district", cascade="all, delete-orphan")
