from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.course_matrix_college import CourseMatrixCollege
from app.schemas.course_matrix import CourseMatrixCollegeCreate, CourseMatrixCollegeUpdate


def get_college(db: Session, college_id: int) -> Optional[CourseMatrixCollege]:
    return db.query(CourseMatrixCollege).filter(CourseMatrixCollege.id == college_id).first()


def get_colleges(
    db: Session,
    city: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[CourseMatrixCollege]:
    query = db.query(CourseMatrixCollege)
    if city:
        query = query.filter(func.lower(CourseMatrixCollege.city) == func.lower(city))
    return query.offset(skip).limit(limit).all()


def create_college(db: Session, college_in: CourseMatrixCollegeCreate) -> CourseMatrixCollege:
    db_college = CourseMatrixCollege(
        name=college_in.name,
        city=college_in.city,
        courses_offered=college_in.courses_offered or []
    )
    db.add(db_college)
    db.commit()
    db.refresh(db_college)
    return db_college


def update_college(db: Session, college_id: int, college_in: CourseMatrixCollegeUpdate) -> Optional[CourseMatrixCollege]:
    db_college = get_college(db, college_id)
    if db_college:
        if college_in.name is not None:
            db_college.name = college_in.name
        if college_in.city is not None:
            db_college.city = college_in.city
        if college_in.courses_offered is not None:
            db_college.courses_offered = college_in.courses_offered
        db.commit()
        db.refresh(db_college)
    return db_college


def delete_college(db: Session, college_id: int) -> bool:
    db_college = get_college(db, college_id)
    if db_college:
        db.delete(db_college)
        db.commit()
        return True
    return False


def get_college_cities(db: Session) -> List[str]:
    cities = db.query(CourseMatrixCollege.city).filter(CourseMatrixCollege.city.isnot(None)).distinct().all()
    return [city[0] for city in cities if city[0]]