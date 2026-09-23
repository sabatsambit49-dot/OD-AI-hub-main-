from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.district import DistrictCreate, DistrictUpdate, DistrictResponse
from app.crud import district_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/districts", tags=["Districts"])

@router.get("", response_model=List[DistrictResponse])
def list_districts(state_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return district_crud.get_districts(db, state_id=state_id, skip=skip, limit=limit)

@router.get("/{district_id}", response_model=DistrictResponse)
def get_district(district_id: int, db: Session = Depends(get_db)):
    district = district_crud.get_district(db, district_id)
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    return district

@router.post("", response_model=DistrictResponse, status_code=status.HTTP_201_CREATED)
def create_district(district_in: DistrictCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return district_crud.create_district(db, district_in)

@router.put("/{district_id}", response_model=DistrictResponse)
def update_district(district_id: int, district_in: DistrictUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    district = district_crud.update_district(db, district_id, district_in)
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    return district

@router.delete("/{district_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_district(district_id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = district_crud.delete_district(db, district_id)
    if not success:
        raise HTTPException(status_code=404, detail="District not found")
    return None
