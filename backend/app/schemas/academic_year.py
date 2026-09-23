from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class AcademicYearBase(BaseModel):
    year_label: str
    total_seats: int
    student_strength: int
    branch_id: int
    college_name: Optional[str] = None

class AcademicYearCreate(AcademicYearBase):
    pass

class AcademicYearUpdate(BaseModel):
    year_label: Optional[str] = None
    total_seats: Optional[int] = None
    student_strength: Optional[int] = None
    branch_id: Optional[int] = None
    college_name: Optional[str] = None

class AcademicYearResponse(AcademicYearBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
