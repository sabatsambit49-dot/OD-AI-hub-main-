from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.problem_statement import (
    ProblemStatementCreate,
    ProblemStatementUpdate,
    ProblemStatementResponse,
    ProblemStatementListResponse
)
from app.crud import problem_statement_crud
from app.utils.validators import validate_pdf_file
from app.utils.file_upload import save_uploaded_file
from app.utils.auth_utils import require_role, get_current_user_optional

router = APIRouter(prefix="/problem-statements", tags=["Problem Statements"])


@router.get("", response_model=ProblemStatementListResponse)
def list_problem_statements(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    search: Optional[str] = Query(None, description="Search keyword in title, description, or organization"),
    has_pdf: Optional[bool] = Query(None, description="Filter items with PDF files"),
    has_text: Optional[bool] = Query(None, description="Filter items with text descriptions"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    items = problem_statement_crud.get_problem_statements(
        db,
        category=category,
        difficulty=difficulty,
        search=search,
        has_pdf=has_pdf,
        has_text=has_text,
        skip=skip,
        limit=limit
    )
    total = problem_statement_crud.get_problem_statements_count(
        db,
        category=category,
        difficulty=difficulty,
        search=search,
        has_pdf=has_pdf,
        has_text=has_text
    )
    return {"problem_statements": items, "total": total}


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    return problem_statement_crud.get_problem_statement_categories(db)


@router.get("/{id}", response_model=ProblemStatementResponse)
def get_problem_statement_detail(id: int, db: Session = Depends(get_db)):
    statement = problem_statement_crud.get_problem_statement(db, id)
    if not statement:
        raise HTTPException(status_code=404, detail="Problem statement not found")
    return statement


@router.post("", response_model=ProblemStatementResponse, status_code=status.HTTP_201_CREATED)
def create_problem_statement(
    title: str = Form(...),
    category: Optional[str] = Form(None),
    organization: Optional[str] = Form(None),
    difficulty: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    file_url = None
    if file and file.filename:
        validate_pdf_file(file)
        file_url = save_uploaded_file(file)

    statement_in = ProblemStatementCreate(
        title=title.strip(),
        category=category.strip() if category else None,
        organization=organization.strip() if organization else None,
        difficulty=difficulty.strip() if difficulty else None,
        description=description.strip() if description else None,
        file_url=file_url
    )
    return problem_statement_crud.create_problem_statement(db, statement_in)


@router.put("/{id}", response_model=ProblemStatementResponse)
def update_problem_statement(
    id: int,
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    organization: Optional[str] = Form(None),
    difficulty: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    remove_file: Optional[bool] = Form(False),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = problem_statement_crud.get_problem_statement(db, id)
    if not existing:
        raise HTTPException(status_code=404, detail="Problem statement not found")

    file_url = None
    if file and file.filename:
        validate_pdf_file(file)
        file_url = save_uploaded_file(file)
    elif remove_file:
        file_url = "__REMOVE__"

    statement_update = ProblemStatementUpdate(
        title=title.strip() if title is not None else None,
        category=category.strip() if category is not None else None,
        organization=organization.strip() if organization is not None else None,
        difficulty=difficulty.strip() if difficulty is not None else None,
        description=description.strip() if description is not None else None,
        file_url=file_url
    )

    updated = problem_statement_crud.update_problem_statement(db, id, statement_update)
    return updated


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem_statement(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    success = problem_statement_crud.delete_problem_statement(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Problem statement not found")
    return None
