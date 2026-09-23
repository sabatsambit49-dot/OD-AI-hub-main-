from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.institution import Institution
from app.models.course import Course
from app.models.branch import Branch
from app.models.academic_year import AcademicYear
from app.models.syllabus_entry import SyllabusEntry
from app.models.event import Event

def get_institution_full_tree(db: Session, institution_id: int) -> Optional[Dict[str, Any]]:
    inst = db.query(Institution).filter(Institution.id == institution_id).first()
    if not inst:
        return None

    courses = db.query(Course).filter(Course.institution_id == institution_id).all()
    courses_tree = []
    
    for c in courses:
        branches = db.query(Branch).filter(Branch.course_id == c.id).all()
        branches_list = []
        
        for b in branches:
            years = db.query(AcademicYear).filter(AcademicYear.branch_id == b.id).all()
            years_list = []
            
            for y in years:
                syllabi = db.query(SyllabusEntry).filter(SyllabusEntry.academic_year_id == y.id).all()
                years_list.append({
                    "id": y.id,
                    "year_label": y.year_label,
                    "total_seats": y.total_seats,
                    "student_strength": y.student_strength,
                    "syllabi": [
                        {
                            "id": s.id,
                            "title": s.title,
                            "content_text": s.content_text,
                            "file_url": s.file_url,
                            "created_at": s.created_at
                        } for s in syllabi
                    ]
                })
                
            branches_list.append({
                "id": b.id,
                "name": b.name,
                "academic_years": years_list
            })
            
        courses_tree.append({
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "branches": branches_list
        })
        
    events = db.query(Event).filter(Event.institution_id == institution_id).order_by(Event.event_date.asc()).all()

    return {
        "id": inst.id,
        "name": inst.name,
        "address": inst.address,
        "district_id": inst.district_id,
        "district_name": inst.district.name if inst.district else None,
        "state_id": inst.district.state_id if inst.district else None,
        "state_name": inst.district.state.name if (inst.district and inst.district.state) else None,
        "institution_type_id": inst.institution_type_id,
        "institution_type_name": inst.institution_type.name if inst.institution_type else None,
        "created_at": inst.created_at,
        "updated_at": inst.updated_at,
        "courses": courses_tree,
        "events": [
            {
                "id": e.id,
                "name": e.name,
                "event_date": e.event_date,
                "description": e.description
            } for e in events
        ]
    }
