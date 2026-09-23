from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.coaching import (
    CoachingCreate, CoachingUpdate, CoachingResponse,
    CoachingCourseCreate, CoachingCourseUpdate, CoachingCourseResponse,
    CoachingDetailResponse, CoachingListResponse
)
from app.crud import coaching_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/coaching", tags=["Coaching"])


@router.get("", response_model=CoachingListResponse)
def list_coachings(
    city: Optional[str] = Query(None, description="Filter by city"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    coachings = coaching_crud.get_coachings(db, city=city, skip=skip, limit=limit)
    total = coaching_crud.get_coachings_count(db, city=city)
    return {"coachings": coachings, "total": total}


@router.get("/cities", response_model=List[str])
def get_coaching_cities(db: Session = Depends(get_db)):
    return coaching_crud.get_coaching_cities(db)


@router.post("", response_model=CoachingResponse, status_code=status.HTTP_201_CREATED)
def create_coaching(
    coaching_in: CoachingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return coaching_crud.create_coaching(db, coaching_in)


@router.get("/{coaching_id}", response_model=CoachingDetailResponse)
def get_coaching_detail(coaching_id: int, db: Session = Depends(get_db)):
    coaching = coaching_crud.get_coaching(db, coaching_id)
    if not coaching:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    courses = coaching_crud.get_courses_by_coaching(db, coaching_id)
    return CoachingDetailResponse.model_validate(coaching, update={"courses": courses})


@router.put("/{coaching_id}", response_model=CoachingResponse)
def update_coaching(
    coaching_id: int,
    coaching_in: CoachingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    coaching = coaching_crud.update_coaching(db, coaching_id, coaching_in)
    if not coaching:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    return coaching


@router.delete("/{coaching_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coaching(
    coaching_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    success = coaching_crud.delete_coaching(db, coaching_id)
    if not success:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    return None


# Coaching Course endpoints
@router.get("/{coaching_id}/courses", response_model=List[CoachingCourseResponse])
def list_coaching_courses(coaching_id: int, db: Session = Depends(get_db)):
    coaching = coaching_crud.get_coaching(db, coaching_id)
    if not coaching:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    return coaching_crud.get_courses_by_coaching(db, coaching_id)


@router.post("/{coaching_id}/courses", response_model=CoachingCourseResponse, status_code=status.HTTP_201_CREATED)
def add_coaching_course(
    coaching_id: int,
    course_in: CoachingCourseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    coaching = coaching_crud.get_coaching(db, coaching_id)
    if not coaching:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    return coaching_crud.create_coaching_course(db, coaching_id, course_in)


@router.put("/{coaching_id}/courses/{course_id}", response_model=CoachingCourseResponse)
def update_coaching_course(
    coaching_id: int,
    course_id: int,
    course_in: CoachingCourseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    coaching = coaching_crud.get_coaching(db, coaching_id)
    if not coaching:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    course = coaching_crud.update_coaching_course(db, course_id, course_in)
    if not course or course.coaching_id != coaching_id:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.delete("/{coaching_id}/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coaching_course(
    coaching_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    coaching = coaching_crud.get_coaching(db, coaching_id)
    if not coaching:
        raise HTTPException(status_code=404, detail="Coaching center not found")
    course = coaching_crud.get_coaching_course(db, course_id)
    if not course or course.coaching_id != coaching_id:
        raise HTTPException(status_code=404, detail="Course not found")
    success = coaching_crud.delete_coaching_course(db, course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return None