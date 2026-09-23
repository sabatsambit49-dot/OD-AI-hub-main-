from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.academic_year import AcademicYear
from app.models.branch import Branch
from app.models.course import Course
from app.models.institution import Institution
from app.schemas.graph import GraphDataResponse, GraphDataset, InstitutionStatsResponse

def get_branch_graph_data(db: Session, branch_id: int) -> GraphDataResponse:
    years = db.query(AcademicYear).filter(AcademicYear.branch_id == branch_id).order_by(AcademicYear.id.asc()).all()
    
    year_labels = [y.year_label for y in years]
    seats_data = [y.total_seats for y in years]
    enrolled_data = [y.student_strength for y in years]
    
    total_seats = sum(seats_data)
    total_enrolled = sum(enrolled_data)
    occupancy_rate = (total_enrolled / total_seats * 100) if total_seats > 0 else 0.0
    
    datasets = [
        GraphDataset(
            label="Total Seats",
            data=seats_data,
            backgroundColor="rgba(51, 102, 204, 0.8)",
            borderColor="#3366cc"
        ),
        GraphDataset(
            label="Students Enrolled",
            data=enrolled_data,
            backgroundColor="rgba(217, 119, 6, 0.8)",
            borderColor="#d97706"
        )
    ]
    
    return GraphDataResponse(
        years=year_labels,
        datasets=datasets,
        total_seats=total_seats,
        total_enrolled=total_enrolled,
        occupancy_rate=round(occupancy_rate, 2)
    )

def get_academic_year_graph_data(db: Session, academic_year_id: int) -> GraphDataResponse:
    year = db.query(AcademicYear).filter(AcademicYear.id == academic_year_id).first()
    if not year:
        return GraphDataResponse(years=[], datasets=[])
        
    return GraphDataResponse(
        years=[year.year_label],
        datasets=[
            GraphDataset(label="Total Seats", data=[year.total_seats], backgroundColor="rgba(51, 102, 204, 0.8)"),
            GraphDataset(label="Students Enrolled", data=[year.student_strength], backgroundColor="rgba(217, 119, 6, 0.8)")
        ],
        total_seats=year.total_seats,
        total_enrolled=year.student_strength,
        occupancy_rate=round((year.student_strength / year.total_seats * 100) if year.total_seats > 0 else 0.0, 2)
    )

def get_institution_graph_stats(db: Session, institution_id: int) -> InstitutionStatsResponse:
    inst = db.query(Institution).filter(Institution.id == institution_id).first()
    if not inst:
        return InstitutionStatsResponse(
            institution_id=institution_id,
            institution_name="Unknown",
            total_courses=0,
            total_branches=0,
            total_seats=0,
            total_enrolled=0,
            occupancy_rate=0.0,
            branch_graph=GraphDataResponse(years=[], datasets=[])
        )
        
    courses = db.query(Course).filter(Course.institution_id == institution_id).all()
    course_ids = [c.id for c in courses]
    
    branches = db.query(Branch).filter(Branch.course_id.in_(course_ids)).all() if course_ids else []
    branch_ids = [b.id for b in branches]
    
    years = db.query(AcademicYear).filter(AcademicYear.branch_id.in_(branch_ids)).all() if branch_ids else []
    
    total_seats = sum(y.total_seats for y in years)
    total_enrolled = sum(y.student_strength for y in years)
    occupancy_rate = (total_enrolled / total_seats * 100) if total_seats > 0 else 0.0
    
    # Aggregate year-wise totals across all branches
    year_map = {}
    for y in years:
        if y.year_label not in year_map:
            year_map[y.year_label] = {"seats": 0, "enrolled": 0}
        year_map[y.year_label]["seats"] += y.total_seats
        year_map[y.year_label]["enrolled"] += y.student_strength
        
    sorted_labels = sorted(year_map.keys())
    seats_list = [year_map[lbl]["seats"] for lbl in sorted_labels]
    enrolled_list = [year_map[lbl]["enrolled"] for lbl in sorted_labels]
    
    graph_data = GraphDataResponse(
        years=sorted_labels,
        datasets=[
            GraphDataset(label="Total Seats", data=seats_list, backgroundColor="rgba(51, 102, 204, 0.8)"),
            GraphDataset(label="Students Enrolled", data=enrolled_list, backgroundColor="rgba(217, 119, 6, 0.8)")
        ],
        total_seats=total_seats,
        total_enrolled=total_enrolled,
        occupancy_rate=round(occupancy_rate, 2)
    )
    
    return InstitutionStatsResponse(
        institution_id=inst.id,
        institution_name=inst.name,
        total_courses=len(courses),
        total_branches=len(branches),
        total_seats=total_seats,
        total_enrolled=total_enrolled,
        occupancy_rate=round(occupancy_rate, 2),
        branch_graph=graph_data
    )
