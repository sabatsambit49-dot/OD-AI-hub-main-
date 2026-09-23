import time
from collections import defaultdict
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud import academy_crud
from app.schemas.academy import (
    AcademyCategoryResponse,
    AcademyCoursePublicResponse,
    EnquiryCreate,
    EnquiryResponse,
    StatResponse,
    TestimonialResponse,
    FaqResponse
)

router = APIRouter(prefix="", tags=["Public OD AI HUB API"])

# In-memory rate limiting tracker for enquiries: IP -> list of timestamps
ENQUIRY_RATE_LIMITS = defaultdict(list)
MAX_ENQUIRIES_PER_MINUTE = 5
RATE_WINDOW_SECONDS = 60

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    # Filter out timestamps older than window
    timestamps = [ts for ts in ENQUIRY_RATE_LIMITS[client_ip] if now - ts < RATE_WINDOW_SECONDS]
    if len(timestamps) >= MAX_ENQUIRIES_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many enquiry submissions from this IP. Please wait a minute before trying again."
        )
    timestamps.append(now)
    ENQUIRY_RATE_LIMITS[client_ip] = timestamps

def add_cache_header(response: Response, max_age: int = 0):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"

def to_public_course_response(c) -> AcademyCoursePublicResponse:
    dur_str = f"{c.duration_value} {c.duration_unit}" if c.duration_value else ""
    price_val = float(c.price) if c.price is not None else 0.0
    disc_val = float(c.discount_price) if c.discount_price is not None else None
    
    return AcademyCoursePublicResponse(
        id=c.id,
        title=c.title or c.name,
        slug=c.slug or f"course-{c.id}",
        category_id=c.category_id,
        category_slug=c.category.slug if c.category else None,
        category_name=c.category.name if c.category else None,
        category_accent=c.category.accent_color if c.category else "#0082ff",
        group_label=c.group_label,
        target_audience=c.target_audience,
        duration_value=c.duration_value,
        duration_unit=c.duration_unit,
        duration_formatted=dur_str,
        mode=c.mode or "online",
        price=price_val,
        discount_price=disc_val,
        price_display=academy_crud.format_price_display(c.price, c.is_free, c.currency),
        discount_display=academy_crud.format_price_display(c.discount_price, False, c.currency) if c.discount_price else None,
        currency=c.currency or "INR",
        is_free=c.is_free or (c.price == 0),
        batch_size=c.batch_size,
        short_description=c.short_description or c.description,
        full_description=c.full_description or c.short_description or c.description,
        highlights=c.highlights or [],
        prerequisites=c.prerequisites,
        start_date=c.start_date,
        certificate_included=c.certificate_included,
        image_url=c.image_url,
        is_featured=c.is_featured,
        status=c.status,
        display_order=c.display_order or 0
    )


# ===================== ACADEMY =====================
@router.get("/academy/categories", response_model=List[AcademyCategoryResponse])
def get_public_categories(response: Response, db: Session = Depends(get_db)):
    """Return all active academy categories ordered by display_order."""
    add_cache_header(response, 30)
    return academy_crud.get_categories(db, active_only=True)

@router.get("/academy/categories/{slug}/courses", response_model=List[AcademyCoursePublicResponse])
def get_public_category_courses(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return published courses for a specific category slug ordered by display_order."""
    add_cache_header(response, 30)
    cat = academy_crud.get_category_by_slug(db, slug)
    if not cat or not cat.is_active:
        raise HTTPException(status_code=404, detail=f"Academy category '{slug}' not found")
    
    courses = academy_crud.get_academy_courses(db, category_id=cat.id, published_only=True)
    return [to_public_course_response(c) for c in courses]

@router.get("/academy/courses/{slug}", response_model=AcademyCoursePublicResponse)
def get_public_course_detail(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return published course detail by slug."""
    add_cache_header(response, 30)
    course = academy_crud.get_course_by_slug(db, slug, published_only=True)
    if not course:
        raise HTTPException(status_code=404, detail=f"Course '{slug}' not found")
    return to_public_course_response(course)


# ===================== STATS, TESTIMONIALS, FAQS =====================
@router.get("/stats", response_model=List[StatResponse])
def get_public_stats(response: Response, db: Session = Depends(get_db)):
    """Return active counter statistics."""
    add_cache_header(response, 30)
    return academy_crud.get_stats(db, active_only=True)

@router.get("/testimonials", response_model=List[TestimonialResponse])
def get_public_testimonials(response: Response, db: Session = Depends(get_db)):
    """Return active student testimonials."""
    add_cache_header(response, 30)
    return academy_crud.get_testimonials(db, active_only=True)

@router.get("/faqs", response_model=List[FaqResponse])
def get_public_faqs(response: Response, db: Session = Depends(get_db)):
    """Return active FAQ entries."""
    add_cache_header(response, 30)
    return academy_crud.get_faqs(db, active_only=True)


# ===================== ENQUIRIES =====================
@router.post("/enquiries", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_enquiry(data: EnquiryCreate, request: Request, db: Session = Depends(get_db)):
    """Submit visitor enquiry with anti-spam honeypot and rate-limiting."""
    # Honeypot detection
    if data.honeypot:
        # Silently reject or return mock response to fool bots
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid submission")

    # Rate limiting check
    check_rate_limit(request)

    # Validate course exists if course_id provided
    if data.course_id:
        course = academy_crud.get_course(db, data.course_id)
        if not course:
            raise HTTPException(status_code=400, detail="Referenced course not found")

    enquiry = academy_crud.create_enquiry(db, data)
    res = EnquiryResponse.from_orm(enquiry)
    if enquiry.course:
        res.course_title = enquiry.course.title or enquiry.course.name
    return res
