from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.crud import course_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseResponse])
def list_courses(institution_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return course_crud.get_courses(db, institution_id=institution_id, skip=skip, limit=limit)

@router.get("/{id}", response_model=CourseResponse)
def get_course(id: int, db: Session = Depends(get_db)):
    course = course_crud.get_course(db, id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(course_in: CourseCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return course_crud.create_course(db, course_in)

@router.put("/{id}", response_model=CourseResponse)
def update_course(id: int, course_in: CourseUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    course = course_crud.update_course(db, id, course_in)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = course_crud.delete_course(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return None
