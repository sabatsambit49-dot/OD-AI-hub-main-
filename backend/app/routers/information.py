from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.information_post import InformationPostCreate, InformationPostUpdate, InformationPostResponse
from app.crud import information_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/information", tags=["Information Posts"])

@router.get("", response_model=List[InformationPostResponse])
def list_information_posts(tag: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return information_crud.get_information_posts(db, tag=tag, skip=skip, limit=limit)

@router.get("/{id}", response_model=InformationPostResponse)
def get_information_post(id: int, db: Session = Depends(get_db)):
    post = information_crud.get_information_post(db, id)
    if not post:
        raise HTTPException(status_code=404, detail="Information post not found")
    return post

@router.post("", response_model=InformationPostResponse, status_code=status.HTTP_201_CREATED)
def create_information_post(post_in: InformationPostCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return information_crud.create_information_post(db, post_in)

@router.put("/{id}", response_model=InformationPostResponse)
def update_information_post(id: int, post_in: InformationPostUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    post = information_crud.update_information_post(db, id, post_in)
    if not post:
        raise HTTPException(status_code=404, detail="Information post not found")
    return post

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_information_post(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = information_crud.delete_information_post(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Information post not found")
    return None
