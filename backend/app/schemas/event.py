from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class EventBase(BaseModel):
    name: str
    event_date: datetime
    description: Optional[str] = None
    institution_id: Optional[int] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    name: Optional[str] = None
    event_date: Optional[datetime] = None
    description: Optional[str] = None
    institution_id: Optional[int] = None

class EventResponse(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
