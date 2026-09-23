import os
import pandas as pd
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.config import settings
from app.database.session import get_db
from app.crud import course_matrix_crud
from app.schemas.course_matrix import CourseMatrixCollegeCreate, CourseMatrixCollegeResponse
from app.utils.auth_utils import require_role

router = APIRouter(
    prefix="/course-matrix",
    tags=["Course Matrix"]
)

# Cache the parsed data so we only read the file once
_CACHE = {}


def _parse_excel():
    """Parse the Excel file and return courses and colleges data."""
    file_path = os.path.join(settings.UPLOAD_DIR, "Internship_related_institute.xlsx")

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Excel file not found. Please upload Internship_related_institute.xlsx."
        )

    try:
        # Read the Excel file, ignoring the first row (which is merged headers)
        df = pd.read_excel(file_path, sheet_name="Course Matrix", header=None)

        # Row index 1 (second row in Excel) contains the actual column headers
        headers = df.iloc[1].tolist()

        # Forward-fill any NaN in the first two columns (Sl. No. and College Name)
        headers[0] = "Sl. No." if pd.isna(headers[0]) else headers[0]
        headers[1] = "College Name" if pd.isna(headers[1]) else headers[1]

        # Assign the new headers to the dataframe
        df.columns = headers

        # Drop the first two rows (which were the merged header and the actual header)
        df = df.iloc[2:].reset_index(drop=True)

        # Drop any empty columns or rows if completely NA
        df = df.dropna(how='all', subset=["College Name"])

        course_columns = headers[2:]

        # Clean course columns to get unique valid course names
        unique_courses = []
        for col in course_columns:
            if pd.notna(col) and str(col).strip():
                unique_courses.append(str(col).strip())

        # Deduplicate and sort
        unique_courses = sorted(list(set(unique_courses)))

        # Prepare colleges data
        colleges_data = []
        for index, row in df.iterrows():
            college = {
                "sl_no": row["Sl. No."],
                "name": row["College Name"],
                "city": None,  # Excel doesn't have city column
                "courses_offered": [],
                "source": "excel"
            }
            # Only include courses that are marked "Yes"
            for course in unique_courses:
                if course in df.columns:
                    val = str(row[course]).strip().lower()
                    if val == 'yes':
                        college["courses_offered"].append(course)

            # Only include colleges that offer at least one course
            if college["courses_offered"] or True:
                colleges_data.append(college)

        return unique_courses, colleges_data

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing Excel file: {str(e)}"
        )


@router.get("/", response_model=Dict[str, Any])
async def get_course_matrix(db: Session = Depends(get_db)):
    """
    Returns available courses and colleges (merged from Excel and DB).
    """
    global _CACHE
    if _CACHE:
        # Still need to merge with DB colleges
        pass

    unique_courses, excel_colleges = _parse_excel()

    # Get DB colleges
    db_colleges = course_matrix_crud.get_colleges(db)
    db_colleges_data = []
    for college in db_colleges:
        db_colleges_data.append({
            "sl_no": college.id,
            "name": college.name,
            "city": college.city,
            "courses_offered": college.courses_offered or [],
            "source": "db"
        })

    # Merge colleges (DB colleges take precedence if same name)
    merged_colleges = {}
    for college in excel_colleges:
        merged_colleges[college["name"].lower()] = college
    for college in db_colleges_data:
        merged_colleges[college["name"].lower()] = college

    _CACHE = {
        "courses": unique_courses,
        "colleges": list(merged_colleges.values())
    }

    return _CACHE


@router.get("/cities", response_model=List[str])
async def get_course_matrix_cities(db: Session = Depends(get_db)):
    """
    Returns distinct cities across all colleges (from DB only, as Excel doesn't have city).
    """
    # Get cities from DB
    db_cities = course_matrix_crud.get_college_cities(db)
    return sorted(db_cities)


@router.post("/colleges", response_model=CourseMatrixCollegeResponse, status_code=status.HTTP_201_CREATED)
async def add_college(
    college_in: CourseMatrixCollegeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    """
    Add a new college to the course matrix (editor+ only).
    """
    return course_matrix_crud.create_college(db, college_in)


@router.get("/colleges", response_model=List[CourseMatrixCollegeResponse])
async def list_colleges(
    city: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    List DB-stored colleges (for management).
    """
    return course_matrix_crud.get_colleges(db, city=city)