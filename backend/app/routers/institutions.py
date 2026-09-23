from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.institution import InstitutionCreate, InstitutionUpdate, InstitutionResponse, InstitutionSearchQuery
from app.crud import institution_crud
from app.services import search_service, institution_service
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/institutions", tags=["Institutions"])

@router.get("", response_model=List[InstitutionResponse])
def list_institutions(
    state_id: Optional[int] = None,
    district_id: Optional[int] = None,
    type_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return institution_crud.get_institutions(
        db, state_id=state_id, district_id=district_id, type_id=type_id, skip=skip, limit=limit
    )

@router.post("/search", response_model=List[InstitutionResponse])
def search_institutions(
    search_query: InstitutionSearchQuery,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return search_service.search_institutions(
        db=db,
        query=search_query.query,
        state_id=search_query.state_id,
        district_id=search_query.district_id,
        type_id=search_query.type_id,
        skip=skip,
        limit=limit
    )

@router.get("/{id}", response_model=Dict[str, Any])
def get_institution_detail(id: int, db: Session = Depends(get_db)):
    tree = institution_service.get_institution_full_tree(db, id)
    if not tree:
        raise HTTPException(status_code=404, detail="Institution not found")
    return tree

@router.post("", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED)
def create_institution(inst_in: InstitutionCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return institution_crud.create_institution(db, inst_in)

@router.put("/{id}", response_model=InstitutionResponse)
def update_institution(id: int, inst_in: InstitutionUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    inst = institution_crud.update_institution(db, id, inst_in)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return inst

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_institution(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = institution_crud.delete_institution(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Institution not found")
    return None
