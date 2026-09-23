from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class SyllabusEntryBase(BaseModel):
    title: str
    content_text: Optional[str] = None
    file_url: Optional[str] = None
    academic_year_id: int

class SyllabusEntryCreate(SyllabusEntryBase):
    pass

class SyllabusEntryUpdate(BaseModel):
    title: Optional[str] = None
    content_text: Optional[str] = None
    file_url: Optional[str] = None
    academic_year_id: Optional[int] = None

class SyllabusEntryResponse(SyllabusEntryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
