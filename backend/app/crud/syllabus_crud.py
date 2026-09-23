from typing import Optional
from sqlalchemy.orm import Session
from app.models.syllabus_entry import SyllabusEntry
from app.schemas.syllabus_entry import SyllabusEntryCreate, SyllabusEntryUpdate

def get_syllabus_entry(db: Session, syllabus_id: int):
    return db.query(SyllabusEntry).filter(SyllabusEntry.id == syllabus_id).first()

def get_syllabus_by_academic_year(db: Session, academic_year_id: int):
    return db.query(SyllabusEntry).filter(SyllabusEntry.academic_year_id == academic_year_id).all()

def get_syllabus_by_branch(db: Session, branch_id: int):
    from app.models.academic_year import AcademicYear
    return db.query(SyllabusEntry).join(AcademicYear).filter(AcademicYear.branch_id == branch_id).all()

def create_syllabus_entry(db: Session, syllabus_in: SyllabusEntryCreate):
    db_entry = SyllabusEntry(
        title=syllabus_in.title,
        content_text=syllabus_in.content_text,
        file_url=syllabus_in.file_url,
        academic_year_id=syllabus_in.academic_year_id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def update_syllabus_entry(db: Session, syllabus_id: int, syllabus_in: SyllabusEntryUpdate):
    db_entry = get_syllabus_entry(db, syllabus_id)
    if db_entry:
        if syllabus_in.title is not None:
            db_entry.title = syllabus_in.title
        if syllabus_in.content_text is not None:
            db_entry.content_text = syllabus_in.content_text
        if syllabus_in.file_url is not None:
            db_entry.file_url = syllabus_in.file_url
        if syllabus_in.academic_year_id is not None:
            db_entry.academic_year_id = syllabus_in.academic_year_id
        db.commit()
        db.refresh(db_entry)
    return db_entry

def delete_syllabus_entry(db: Session, syllabus_id: int):
    db_entry = get_syllabus_entry(db, syllabus_id)
    if db_entry:
        db.delete(db_entry)
        db.commit()
        return True
    return False
