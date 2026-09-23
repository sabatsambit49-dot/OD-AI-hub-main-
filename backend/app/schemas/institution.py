from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
from app.schemas.district import DistrictResponse
from app.schemas.institution_type import InstitutionTypeResponse

class InstitutionBase(BaseModel):
    name: str
    address: Optional[str] = None
    district_id: int
    institution_type_id: int

class InstitutionCreate(InstitutionBase):
    pass

class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    district_id: Optional[int] = None
    institution_type_id: Optional[int] = None

class InstitutionResponse(InstitutionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    district: Optional[DistrictResponse] = None
    institution_type: Optional[InstitutionTypeResponse] = None

    class Config:
        from_attributes = True

class InstitutionSearchQuery(BaseModel):
    query: Optional[str] = None
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    type_id: Optional[int] = None
