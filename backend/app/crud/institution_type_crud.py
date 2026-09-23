from sqlalchemy.orm import Session
from app.models.institution_type import InstitutionType
from app.schemas.institution_type import InstitutionTypeCreate, InstitutionTypeUpdate

def get_institution_type(db: Session, type_id: int):
    return db.query(InstitutionType).filter(InstitutionType.id == type_id).first()

def get_institution_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(InstitutionType).offset(skip).limit(limit).all()

def create_institution_type(db: Session, type_in: InstitutionTypeCreate):
    db_type = InstitutionType(name=type_in.name)
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

def update_institution_type(db: Session, type_id: int, type_in: InstitutionTypeUpdate):
    db_type = get_institution_type(db, type_id)
    if db_type:
        db_type.name = type_in.name
        db.commit()
        db.refresh(db_type)
    return db_type

def delete_institution_type(db: Session, type_id: int):
    db_type = get_institution_type(db, type_id)
    if db_type:
        db.delete(db_type)
        db.commit()
        return True
    return False
