from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


class CoachingBase(BaseModel):
    name: str
    city: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class CoachingCreate(CoachingBase):
    pass


class CoachingUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class CoachingResponse(CoachingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CoachingCourseBase(BaseModel):
    course_name: str
    price: Optional[float] = None
    description: Optional[str] = None
    syllabus_url: Optional[str] = None


class CoachingCourseCreate(CoachingCourseBase):
    pass


class CoachingCourseUpdate(BaseModel):
    course_name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    syllabus_url: Optional[str] = None


class CoachingCourseResponse(CoachingCourseBase):
    id: int
    coaching_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CoachingDetailResponse(CoachingResponse):
    courses: List[CoachingCourseResponse] = []


class CoachingListResponse(BaseModel):
    coachings: List[CoachingResponse]
    total: int