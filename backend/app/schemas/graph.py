from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class GraphDataset(BaseModel):
    label: str
    data: List[int]
    backgroundColor: Optional[str] = None
    borderColor: Optional[str] = None

class GraphDataResponse(BaseModel):
    years: List[str]
    datasets: List[GraphDataset]
    total_seats: int = 0
    total_enrolled: int = 0
    occupancy_rate: float = 0.0

class InstitutionStatsResponse(BaseModel):
    institution_id: int
    institution_name: str
    total_courses: int
    total_branches: int
    total_seats: int
    total_enrolled: int
    occupancy_rate: float
    branch_graph: GraphDataResponse
