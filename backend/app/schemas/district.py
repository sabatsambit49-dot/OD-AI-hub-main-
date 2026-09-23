from pydantic import BaseModel
from typing import Optional
from app.schemas.state import StateResponse

class DistrictBase(BaseModel):
    name: str
    state_id: int

class DistrictCreate(DistrictBase):
    pass

class DistrictUpdate(BaseModel):
    name: Optional[str] = None
    state_id: Optional[int] = None

class DistrictResponse(DistrictBase):
    id: int
    state: Optional[StateResponse] = None

    class Config:
        from_attributes = True
