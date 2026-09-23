from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class BranchBase(BaseModel):
    name: str
    course_id: int

class BranchCreate(BranchBase):
    pass

class BranchUpdate(BaseModel):
    name: Optional[str] = None
    course_id: Optional[int] = None

class BranchResponse(BranchBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
