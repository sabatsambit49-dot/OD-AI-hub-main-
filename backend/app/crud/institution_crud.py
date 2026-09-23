from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.institution import Institution
from app.models.district import District
from app.schemas.institution import InstitutionCreate, InstitutionUpdate

def get_institution(db: Session, institution_id: int):
    return db.query(Institution).filter(Institution.id == institution_id).first()

def get_institutions(
    db: Session,
    state_id: Optional[int] = None,
    district_id: Optional[int] = None,
    type_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Institution]:
    query = db.query(Institution)
    
    if state_id:
        query = query.join(District).filter(District.state_id == state_id)
    if district_id:
        query = query.filter(Institution.district_id == district_id)
    if type_id:
        query = query.filter(Institution.institution_type_id == type_id)
        
    return query.offset(skip).limit(limit).all()

def create_institution(db: Session, inst_in: InstitutionCreate):
    db_inst = Institution(
        name=inst_in.name,
        address=inst_in.address,
        district_id=inst_in.district_id,
        institution_type_id=inst_in.institution_type_id
    )
    db.add(db_inst)
    db.commit()
    db.refresh(db_inst)
    return db_inst

def update_institution(db: Session, institution_id: int, inst_in: InstitutionUpdate):
    db_inst = get_institution(db, institution_id)
    if db_inst:
        if inst_in.name is not None:
            db_inst.name = inst_in.name
        if inst_in.address is not None:
            db_inst.address = inst_in.address
        if inst_in.district_id is not None:
            db_inst.district_id = inst_in.district_id
        if inst_in.institution_type_id is not None:
            db_inst.institution_type_id = inst_in.institution_type_id
        db.commit()
        db.refresh(db_inst)
    return db_inst

def delete_institution(db: Session, institution_id: int):
    db_inst = get_institution(db, institution_id)
    if db_inst:
        db.delete(db_inst)
        db.commit()
        return True
    return False
