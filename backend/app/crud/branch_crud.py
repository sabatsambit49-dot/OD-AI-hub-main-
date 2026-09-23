from typing import Optional
from sqlalchemy.orm import Session
from app.models.branch import Branch
from app.schemas.branch import BranchCreate, BranchUpdate

def get_branch(db: Session, branch_id: int):
    return db.query(Branch).filter(Branch.id == branch_id).first()

def get_branches(db: Session, course_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Branch)
    if course_id:
        query = query.filter(Branch.course_id == course_id)
    return query.offset(skip).limit(limit).all()

def create_branch(db: Session, branch_in: BranchCreate):
    db_branch = Branch(
        name=branch_in.name,
        course_id=branch_in.course_id
    )
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch

def update_branch(db: Session, branch_id: int, branch_in: BranchUpdate):
    db_branch = get_branch(db, branch_id)
    if db_branch:
        if branch_in.name is not None:
            db_branch.name = branch_in.name
        if branch_in.course_id is not None:
            db_branch.course_id = branch_in.course_id
        db.commit()
        db.refresh(db_branch)
    return db_branch

def delete_branch(db: Session, branch_id: int):
    db_branch = get_branch(db, branch_id)
    if db_branch:
        db.delete(db_branch)
        db.commit()
        return True
    return False
