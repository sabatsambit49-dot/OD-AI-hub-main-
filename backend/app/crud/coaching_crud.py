from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.coaching import Coaching
from app.models.coaching_course import CoachingCourse
from app.schemas.coaching import CoachingCreate, CoachingUpdate, CoachingCourseCreate, CoachingCourseUpdate


def get_coaching(db: Session, coaching_id: int) -> Optional[Coaching]:
    return db.query(Coaching).filter(Coaching.id == coaching_id).first()


def get_coachings(
    db: Session,
    city: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Coaching]:
    query = db.query(Coaching)
    if city:
        query = query.filter(func.lower(Coaching.city) == func.lower(city))
    return query.offset(skip).limit(limit).all()


def get_coachings_count(db: Session, city: Optional[str] = None) -> int:
    query = db.query(func.count(Coaching.id))
    if city:
        query = query.filter(func.lower(Coaching.city) == func.lower(city))
    return query.scalar()


def create_coaching(db: Session, coaching_in: CoachingCreate) -> Coaching:
    db_coaching = Coaching(
        name=coaching_in.name,
        city=coaching_in.city,
        address=coaching_in.address,
        phone=coaching_in.phone
    )
    db.add(db_coaching)
    db.commit()
    db.refresh(db_coaching)
    return db_coaching


def update_coaching(db: Session, coaching_id: int, coaching_in: CoachingUpdate) -> Optional[Coaching]:
    db_coaching = get_coaching(db, coaching_id)
    if db_coaching:
        if coaching_in.name is not None:
            db_coaching.name = coaching_in.name
        if coaching_in.city is not None:
            db_coaching.city = coaching_in.city
        if coaching_in.address is not None:
            db_coaching.address = coaching_in.address
        if coaching_in.phone is not None:
            db_coaching.phone = coaching_in.phone
        db.commit()
        db.refresh(db_coaching)
    return db_coaching


def delete_coaching(db: Session, coaching_id: int) -> bool:
    db_coaching = get_coaching(db, coaching_id)
    if db_coaching:
        db.delete(db_coaching)
        db.commit()
        return True
    return False


def get_coaching_cities(db: Session) -> List[str]:
    cities = db.query(Coaching.city).filter(Coaching.city.isnot(None)).distinct().all()
    return [city[0] for city in cities if city[0]]


# Coaching Course CRUD
def get_coaching_course(db: Session, course_id: int) -> Optional[CoachingCourse]:
    return db.query(CoachingCourse).filter(CoachingCourse.id == course_id).first()


def get_courses_by_coaching(db: Session, coaching_id: int) -> List[CoachingCourse]:
    return db.query(CoachingCourse).filter(CoachingCourse.coaching_id == coaching_id).all()


def create_coaching_course(db: Session, coaching_id: int, course_in: CoachingCourseCreate) -> CoachingCourse:
    db_course = CoachingCourse(
        coaching_id=coaching_id,
        course_name=course_in.course_name,
        price=course_in.price,
        description=course_in.description,
        syllabus_url=course_in.syllabus_url
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


def update_coaching_course(db: Session, course_id: int, course_in: CoachingCourseUpdate) -> Optional[CoachingCourse]:
    db_course = get_coaching_course(db, course_id)
    if db_course:
        if course_in.course_name is not None:
            db_course.course_name = course_in.course_name
        if course_in.price is not None:
            db_course.price = course_in.price
        if course_in.description is not None:
            db_course.description = course_in.description
        if course_in.syllabus_url is not None:
            db_course.syllabus_url = course_in.syllabus_url
        db.commit()
        db.refresh(db_course)
    return db_course


def delete_coaching_course(db: Session, course_id: int) -> bool:
    db_course = get_coaching_course(db, course_id)
    if db_course:
        db.delete(db_course)
        db.commit()
        return True
    return False