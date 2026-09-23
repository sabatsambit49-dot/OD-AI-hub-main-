from typing import Optional
from sqlalchemy.orm import Session
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate

def get_course(db: Session, course_id: int):
    return db.query(Course).filter(Course.id == course_id).first()

def get_courses(db: Session, institution_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Course)
    if institution_id:
        query = query.filter(Course.institution_id == institution_id)
    return query.offset(skip).limit(limit).all()

def create_course(db: Session, course_in: CourseCreate):
    db_course = Course(
        name=course_in.name,
        description=course_in.description,
        institution_id=course_in.institution_id
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def update_course(db: Session, course_id: int, course_in: CourseUpdate):
    db_course = get_course(db, course_id)
    if db_course:
        if course_in.name is not None:
            db_course.name = course_in.name
        if course_in.description is not None:
            db_course.description = course_in.description
        if course_in.institution_id is not None:
            db_course.institution_id = course_in.institution_id
        db.commit()
        db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int):
    db_course = get_course(db, course_id)
    if db_course:
        db.delete(db_course)
        db.commit()
        return True
    return False
