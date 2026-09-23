from typing import Optional
from sqlalchemy.orm import Session
from app.models.academic_year import AcademicYear
from app.schemas.academic_year import AcademicYearCreate, AcademicYearUpdate

def get_academic_year(db: Session, year_id: int):
    return db.query(AcademicYear).filter(AcademicYear.id == year_id).first()

def get_academic_years(db: Session, branch_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(AcademicYear)
    if branch_id:
        query = query.filter(AcademicYear.branch_id == branch_id)
    return query.offset(skip).limit(limit).all()

def create_academic_year(db: Session, year_in: AcademicYearCreate):
    db_year = AcademicYear(
        year_label=year_in.year_label,
        total_seats=year_in.total_seats,
        student_strength=year_in.student_strength,
        branch_id=year_in.branch_id,
        college_name=year_in.college_name
    )
    db.add(db_year)
    db.commit()
    db.refresh(db_year)
    return db_year

def update_academic_year(db: Session, year_id: int, year_in: AcademicYearUpdate):
    db_year = get_academic_year(db, year_id)
    if db_year:
        if year_in.year_label is not None:
            db_year.year_label = year_in.year_label
        if year_in.total_seats is not None:
            db_year.total_seats = year_in.total_seats
        if year_in.student_strength is not None:
            db_year.student_strength = year_in.student_strength
        if year_in.branch_id is not None:
            db_year.branch_id = year_in.branch_id
        if year_in.college_name is not None:
            db_year.college_name = year_in.college_name
        db.commit()
        db.refresh(db_year)
    return db_year

def delete_academic_year(db: Session, year_id: int):
    db_year = get_academic_year(db, year_id)
    if db_year:
        db.delete(db_year)
        db.commit()
        return True
    return False
