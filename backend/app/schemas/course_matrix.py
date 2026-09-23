from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class CourseMatrixCollegeBase(BaseModel):
    name: str
    city: Optional[str] = None
    courses_offered: Optional[List[str]] = []


class CourseMatrixCollegeCreate(CourseMatrixCollegeBase):
    pass


class CourseMatrixCollegeUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    courses_offered: Optional[List[str]] = None


class CourseMatrixCollegeResponse(CourseMatrixCollegeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseMatrixResponse(BaseModel):
    courses: List[str]
    colleges: List[Dict[str, Any]]


class CourseMatrixCitiesResponse(BaseModel):
    cities: List[str]