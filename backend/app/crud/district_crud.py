from typing import Optional
from sqlalchemy.orm import Session
from app.models.district import District
from app.schemas.district import DistrictCreate, DistrictUpdate

def get_district(db: Session, district_id: int):
    return db.query(District).filter(District.id == district_id).first()

def get_districts(db: Session, state_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(District)
    if state_id:
        query = query.filter(District.state_id == state_id)
    return query.offset(skip).limit(limit).all()

def create_district(db: Session, district_in: DistrictCreate):
    db_district = District(name=district_in.name, state_id=district_in.state_id)
    db.add(db_district)
    db.commit()
    db.refresh(db_district)
    return db_district

def update_district(db: Session, district_id: int, district_in: DistrictUpdate):
    db_district = get_district(db, district_id)
    if db_district:
        if district_in.name is not None:
            db_district.name = district_in.name
        if district_in.state_id is not None:
            db_district.state_id = district_in.state_id
        db.commit()
        db.refresh(db_district)
    return db_district

def delete_district(db: Session, district_id: int):
    db_district = get_district(db, district_id)
    if db_district:
        db.delete(db_district)
        db.commit()
        return True
    return False
