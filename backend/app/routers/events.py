from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.crud import event_crud
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("/institution/{institution_id}", response_model=List[EventResponse])
def get_events_for_institution(institution_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return event_crud.get_events_for_institution(db, institution_id=institution_id, skip=skip, limit=limit)

@router.get("", response_model=List[EventResponse])
def list_all_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return event_crud.get_events_for_institution(db, institution_id=None, skip=skip, limit=limit)

@router.post("/with-institution", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event_in: EventCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return event_crud.create_event(db, event_in)

@router.put("/{id}", response_model=EventResponse)
def update_event(id: int, event_in: EventUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    event = event_crud.update_event(db, id, event_in)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    success = event_crud.delete_event(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return None
