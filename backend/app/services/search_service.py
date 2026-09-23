from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.institution import Institution
from app.models.district import District
from app.models.state import State
from app.models.institution_type import InstitutionType

def search_institutions(
    db: Session,
    query: Optional[str] = None,
    state_id: Optional[int] = None,
    district_id: Optional[int] = None,
    type_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50
) -> List[Institution]:
    q = db.query(Institution).join(District).join(State).join(InstitutionType)
    
    if state_id:
        q = q.filter(District.state_id == state_id)
    if district_id:
        q = q.filter(Institution.district_id == district_id)
    if type_id:
        q = q.filter(Institution.institution_type_id == type_id)
        
    if query and query.strip():
        term = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Institution.name.ilike(term),
                Institution.address.ilike(term),
                District.name.ilike(term),
                State.name.ilike(term)
            )
        )
        
    return q.offset(skip).limit(limit).all()
