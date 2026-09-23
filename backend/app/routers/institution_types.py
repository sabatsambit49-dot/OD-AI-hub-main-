from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.institution_type import InstitutionTypeCreate, InstitutionTypeUpdate, InstitutionTypeResponse
from app.crud import institution_type_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/institution-types", tags=["Institution Types"])

@router.get("", response_model=List[InstitutionTypeResponse])
def list_institution_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return institution_type_crud.get_institution_types(db, skip=skip, limit=limit)

@router.get("/{type_id}", response_model=InstitutionTypeResponse)
def get_institution_type(type_id: int, db: Session = Depends(get_db)):
    itype = institution_type_crud.get_institution_type(db, type_id)
    if not itype:
        raise HTTPException(status_code=404, detail="Institution Type not found")
    return itype

@router.post("", response_model=InstitutionTypeResponse, status_code=status.HTTP_201_CREATED)
def create_institution_type(type_in: InstitutionTypeCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return institution_type_crud.create_institution_type(db, type_in)

@router.put("/{type_id}", response_model=InstitutionTypeResponse)
def update_institution_type(type_id: int, type_in: InstitutionTypeUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    itype = institution_type_crud.update_institution_type(db, type_id, type_in)
    if not itype:
        raise HTTPException(status_code=404, detail="Institution Type not found")
    return itype

@router.delete("/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_institution_type(type_id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = institution_type_crud.delete_institution_type(db, type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Institution Type not found")
    return None
