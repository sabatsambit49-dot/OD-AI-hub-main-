from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.state import StateCreate, StateUpdate, StateResponse
from app.crud import state_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/states", tags=["States"])

@router.get("", response_model=List[StateResponse])
def list_states(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return state_crud.get_states(db, skip=skip, limit=limit)

@router.get("/{state_id}", response_model=StateResponse)
def get_state(state_id: int, db: Session = Depends(get_db)):
    state = state_crud.get_state(db, state_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state

@router.post("", response_model=StateResponse, status_code=status.HTTP_201_CREATED)
def create_state(state_in: StateCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return state_crud.create_state(db, state_in)

@router.put("/{state_id}", response_model=StateResponse)
def update_state(state_id: int, state_in: StateUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    state = state_crud.update_state(db, state_id, state_in)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state

@router.delete("/{state_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_state(state_id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = state_crud.delete_state(db, state_id)
    if not success:
        raise HTTPException(status_code=404, detail="State not found")
    return None
