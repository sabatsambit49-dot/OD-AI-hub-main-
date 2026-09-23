from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class InformationPostBase(BaseModel):
    title: str
    tag: str
    body: str

class InformationPostCreate(InformationPostBase):
    pass

class InformationPostUpdate(BaseModel):
    title: Optional[str] = None
    tag: Optional[str] = None
    body: Optional[str] = None

class InformationPostResponse(InformationPostBase):
    id: int
    posted_at: datetime

    class Config:
        from_attributes = True
