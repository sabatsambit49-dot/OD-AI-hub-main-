from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.academic_year import AcademicYearCreate, AcademicYearUpdate, AcademicYearResponse
from app.schemas.graph import GraphDataResponse
from app.crud import academic_year_crud
from app.services import graph_data_service
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/academic-years", tags=["Academic Years"])

@router.get("", response_model=List[AcademicYearResponse])
def list_academic_years(branch_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return academic_year_crud.get_academic_years(db, branch_id=branch_id, skip=skip, limit=limit)

@router.get("/{id}", response_model=AcademicYearResponse)
def get_academic_year(id: int, db: Session = Depends(get_db)):
    year = academic_year_crud.get_academic_year(db, id)
    if not year:
        raise HTTPException(status_code=404, detail="Academic year not found")
    return year

@router.get("/{id}/graph-data", response_model=GraphDataResponse)
def get_academic_year_graph(id: int, db: Session = Depends(get_db)):
    return graph_data_service.get_academic_year_graph_data(db, id)

@router.post("", response_model=AcademicYearResponse, status_code=status.HTTP_201_CREATED)
def create_academic_year(year_in: AcademicYearCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academic_year_crud.create_academic_year(db, year_in)

@router.put("/{id}", response_model=AcademicYearResponse)
def update_academic_year(id: int, year_in: AcademicYearUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    year = academic_year_crud.update_academic_year(db, id, year_in)
    if not year:
        raise HTTPException(status_code=404, detail="Academic year not found")
    return year

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_academic_year(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = academic_year_crud.delete_academic_year(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Academic year not found")
    return None
