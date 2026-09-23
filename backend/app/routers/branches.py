from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.branch import BranchCreate, BranchUpdate, BranchResponse
from app.crud import branch_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/branches", tags=["Branches"])

@router.get("", response_model=List[BranchResponse])
def list_branches(course_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return branch_crud.get_branches(db, course_id=course_id, skip=skip, limit=limit)

@router.get("/{id}", response_model=BranchResponse)
def get_branch(id: int, db: Session = Depends(get_db)):
    branch = branch_crud.get_branch(db, id)
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch

@router.post("", response_model=BranchResponse, status_code=status.HTTP_201_CREATED)
def create_branch(branch_in: BranchCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return branch_crud.create_branch(db, branch_in)

@router.put("/{id}", response_model=BranchResponse)
def update_branch(id: int, branch_in: BranchUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    branch = branch_crud.update_branch(db, id, branch_in)
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = branch_crud.delete_branch(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Branch not found")
    return None
