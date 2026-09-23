from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ProblemStatementBase(BaseModel):
    title: str
    category: Optional[str] = None
    organization: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    file_url: Optional[str] = None


class ProblemStatementCreate(ProblemStatementBase):
    pass


class ProblemStatementUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    organization: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None
    file_url: Optional[str] = None


class ProblemStatementResponse(ProblemStatementBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProblemStatementListResponse(BaseModel):
    problem_statements: List[ProblemStatementResponse]
    total: int
