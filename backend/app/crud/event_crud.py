from typing import Optional
from sqlalchemy.orm import Session
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate

def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()

def get_events_for_institution(db: Session, institution_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(Event)
    if institution_id:
        query = query.filter(Event.institution_id == institution_id)
    return query.order_by(Event.event_date.asc()).offset(skip).limit(limit).all()

def create_event(db: Session, event_in: EventCreate):
    db_event = Event(
        name=event_in.name,
        event_date=event_in.event_date,
        description=event_in.description,
        institution_id=event_in.institution_id
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, event_in: EventUpdate):
    db_event = get_event(db, event_id)
    if db_event:
        if event_in.name is not None:
            db_event.name = event_in.name
        if event_in.event_date is not None:
            db_event.event_date = event_in.event_date
        if event_in.description is not None:
            db_event.description = event_in.description
        if event_in.institution_id is not None:
            db_event.institution_id = event_in.institution_id
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = get_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
        return True
    return False
