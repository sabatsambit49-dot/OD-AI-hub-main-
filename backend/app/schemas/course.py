from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    institution_id: int

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    institution_id: Optional[int] = None

class CourseResponse(CourseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
