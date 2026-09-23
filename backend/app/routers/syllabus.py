from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.syllabus_entry import SyllabusEntryCreate, SyllabusEntryUpdate, SyllabusEntryResponse
from app.crud import syllabus_crud
# pyrefly: ignore [missing-import]
from app.utils.validators import validate_pdf_file
from app.utils.file_upload import save_uploaded_file
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/syllabus", tags=["Syllabus"])

@router.get("/branch/{branch_id}", response_model=List[SyllabusEntryResponse])
def get_syllabus_by_branch(branch_id: int, db: Session = Depends(get_db)):
    return syllabus_crud.get_syllabus_by_branch(db, branch_id)

@router.get("/academic-year/{academic_year_id}", response_model=List[SyllabusEntryResponse])
def get_syllabus_by_academic_year(academic_year_id: int, db: Session = Depends(get_db)):
    return syllabus_crud.get_syllabus_by_academic_year(db, academic_year_id)

@router.post("/upload", response_model=SyllabusEntryResponse, status_code=status.HTTP_201_CREATED)
def upload_syllabus_file(
    academic_year_id: int = Form(...),
    title: str = Form(...),
    content_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    file_url = None
    if file:
        validate_pdf_file(file)
        file_url = save_uploaded_file(file)
        
    syllabus_in = SyllabusEntryCreate(
        academic_year_id=academic_year_id,
        title=title,
        content_text=content_text,
        file_url=file_url
    )
    return syllabus_crud.create_syllabus_entry(db, syllabus_in)

@router.put("/{id}", response_model=SyllabusEntryResponse)
def update_syllabus_entry(
    id: int,
    syllabus_in: SyllabusEntryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    entry = syllabus_crud.update_syllabus_entry(db, id, syllabus_in)
    if not entry:
        raise HTTPException(status_code=404, detail="Syllabus entry not found")
    return entry

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_syllabus_entry(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = syllabus_crud.delete_syllabus_entry(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Syllabus entry not found")
    return None
