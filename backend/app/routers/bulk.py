import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.state import State
from app.models.district import District
from app.models.institution_type import InstitutionType
from app.models.institution import Institution
from app.utils.auth_utils import require_role

router = APIRouter(prefix="/bulk", tags=["Bulk Import & Export"])

@router.get("/export-institutions/{institution_id}")
def export_institution_csv(institution_id: int, db: Session = Depends(get_db)):
    from app.services import institution_service
    tree = institution_service.get_institution_full_tree(db, institution_id)
    if not tree:
        raise HTTPException(status_code=404, detail="Institution not found")
        
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Institution", "State", "District", "Type", "Course", "Branch", "Year", "Total Seats", "Enrolled Students"])
    
    inst_name = tree["name"]
    state_name = tree.get("state_name", "")
    district_name = tree.get("district_name", "")
    type_name = tree.get("institution_type_name", "")
    
    for c in tree.get("courses", []):
        c_name = c["name"]
        for b in c.get("branches", []):
            b_name = b["name"]
            for y in b.get("academic_years", []):
                writer.writerow([inst_name, state_name, district_name, type_name, c_name, b_name, y["year_label"], y["total_seats"], y["student_strength"]])
                
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=institution_{institution_id}_report.csv"}
    )

@router.post("/import-csv", status_code=status.HTTP_200_OK)
def bulk_import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV format")
        
    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(content))
    
    imported_count = 0
    for row in reader:
        state_name = row.get("State", "").strip()
        district_name = row.get("District", "").strip()
        type_name = row.get("Type", "").strip()
        inst_name = row.get("Institution", "").strip()
        address = row.get("Address", "").strip()
        
        if not state_name or not district_name or not type_name or not inst_name:
            continue
            
        state = db.query(State).filter(State.name == state_name).first()
        if not state:
            state = State(name=state_name)
            db.add(state)
            db.commit()
            db.refresh(state)
            
        district = db.query(District).filter(District.name == district_name, District.state_id == state.id).first()
        if not district:
            district = District(name=district_name, state_id=state.id)
            db.add(district)
            db.commit()
            db.refresh(district)
            
        itype = db.query(InstitutionType).filter(InstitutionType.name == type_name).first()
        if not itype:
            itype = InstitutionType(name=type_name)
            db.add(itype)
            db.commit()
            db.refresh(itype)
            
        inst = db.query(Institution).filter(
            Institution.name == inst_name,
            Institution.district_id == district.id,
            Institution.institution_type_id == itype.id
        ).first()
        
        if not inst:
            inst = Institution(
                name=inst_name,
                address=address,
                district_id=district.id,
                institution_type_id=itype.id
            )
            db.add(inst)
            db.commit()
            imported_count += 1
            
    return {"message": f"Successfully imported {imported_count} new institutions from CSV"}
