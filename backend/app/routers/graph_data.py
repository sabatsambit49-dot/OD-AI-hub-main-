from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.graph import GraphDataResponse, InstitutionStatsResponse
from app.services import graph_data_service

router = APIRouter(prefix="/graph-data", tags=["Graph Data Visualization"])

@router.get("/institution/{id}", response_model=InstitutionStatsResponse)
def get_institution_stats(id: int, db: Session = Depends(get_db)):
    return graph_data_service.get_institution_graph_stats(db, id)

@router.get("/branch/{id}", response_model=GraphDataResponse)
def get_branch_graph(id: int, db: Session = Depends(get_db)):
    return graph_data_service.get_branch_graph_data(db, id)

@router.post("/export")
def export_graph_data(payload: Dict[str, Any]):
    # CSV string generation for client export
    years = payload.get("years", [])
    datasets = payload.get("datasets", [])
    
    csv_lines = ["Year," + ",".join([d.get("label", "Value") for d in datasets])]
    
    for idx, year in enumerate(years):
        row = [str(year)]
        for d in datasets:
            data_arr = d.get("data", [])
            val = data_arr[idx] if idx < len(data_arr) else 0
            row.append(str(val))
        csv_lines.append(",".join(row))
        
    csv_content = "\n".join(csv_lines)
    return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=graph_export.csv"})
