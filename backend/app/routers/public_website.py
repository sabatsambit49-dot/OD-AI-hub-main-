from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud import website_crud
from app.schemas.website import (
    PillarPublicResponse,
    PillarSectionPublicResponse,
    OfferingPublicResponse,
    InstitutionAudiencePublicResponse,
    PublicEventPublicResponse,
    EventRegistrationCreate,
    SuccessStoryPublicResponse,
    BlogPostPublicResponse,
    CertificateVerifyResponse,
    StaticPagePublicResponse,
    TeamMemberPublicResponse,
    JobListingPublicResponse,
    FooterLinkPublicResponse
)

router = APIRouter(prefix="/website", tags=["Public Website API"])


def add_cache_header(response: Response, max_age: int = 30):
    response.headers["Cache-Control"] = f"public, max-age={max_age}"


# ================== PILLARS ==================
@router.get("/pillars", response_model=List[PillarPublicResponse])
def get_pillars(response: Response, db: Session = Depends(get_db)):
    """Return all published pillars ordered by display_order."""
    add_cache_header(response, 30)
    return website_crud.get_pillars(db, active_only=True)


@router.get("/pillars/{slug}", response_model=PillarPublicResponse)
def get_pillar_by_slug(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return a published pillar by slug with its sections."""
    add_cache_header(response, 30)
    pillar = website_crud.get_pillar_by_slug(db, slug)
    if not pillar or pillar.status != "published":
        raise HTTPException(status_code=404, detail=f"Pillar '{slug}' not found")
    return pillar


@router.get("/pillars/{slug}/sections", response_model=List[PillarSectionPublicResponse])
def get_pillar_sections(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return published sections for a specific pillar slug."""
    add_cache_header(response, 30)
    pillar = website_crud.get_pillar_by_slug(db, slug)
    if not pillar or pillar.status != "published":
        raise HTTPException(status_code=404, detail=f"Pillar '{slug}' not found")
    return website_crud.get_pillar_sections(db, pillar_id=pillar.id, active_only=True)


# ================== PILLAR SECTIONS ==================
@router.get("/sections/{section_slug}", response_model=PillarSectionPublicResponse)
def get_section_by_slug(section_slug: str, response: Response, db: Session = Depends(get_db)):
    """Return a published section by slug with its offerings."""
    add_cache_header(response, 30)
    section = website_crud.get_pillar_section_by_slug(db, section_slug)
    if not section or section.status != "published":
        raise HTTPException(status_code=404, detail=f"Section '{section_slug}' not found")
    return section


@router.get("/sections/{section_id}/offerings", response_model=List[OfferingPublicResponse])
def get_section_offerings(section_id: int, response: Response, db: Session = Depends(get_db)):
    """Return published offerings for a specific section."""
    add_cache_header(response, 30)
    section = website_crud.get_pillar_section(db, section_id)
    if not section or section.status != "published":
        raise HTTPException(status_code=404, detail=f"Section not found")
    return website_crud.get_offerings(db, section_id=section_id, active_only=True)


# ================== INSTITUTION AUDIENCES ==================
@router.get("/institutions/audiences", response_model=List[InstitutionAudiencePublicResponse])
def get_institution_audiences(response: Response, db: Session = Depends(get_db)):
    """Return active institution audiences (Colleges, Schools) with their sections."""
    add_cache_header(response, 30)
    audiences = website_crud.get_institution_audiences(db, active_only=True)
    # Convert to public response with sections
    result = []
    for audience in audiences:
        sections = website_crud.get_pillar_sections(db, audience_id=audience.id, active_only=True)
        result.append(InstitutionAudiencePublicResponse.from_orm(audience).model_copy(update={"sections": sections}))
    return result


@router.get("/institutions/{audience_slug}/sections", response_model=List[PillarSectionPublicResponse])
def get_audience_sections(audience_slug: str, response: Response, db: Session = Depends(get_db)):
    """Return published sections for a specific audience (colleges/schools)."""
    add_cache_header(response, 30)
    audience = website_crud.get_institution_audience_by_slug(db, audience_slug)
    if not audience or not audience.is_active:
        raise HTTPException(status_code=404, detail=f"Audience '{audience_slug}' not found")
    return website_crud.get_pillar_sections(db, audience_id=audience.id, active_only=True)


# ================== PUBLIC EVENTS ==================
@router.get("/events", response_model=List[PublicEventPublicResponse])
def get_events(
    response: Response,
    event_type: Optional[str] = None,
    upcoming_only: bool = False,
    db: Session = Depends(get_db)
):
    """Return published events, optionally filtered by type."""
    add_cache_header(response, 30)
    events = website_crud.get_public_events(db, event_type=event_type, upcoming_only=upcoming_only, active_only=True)
    return events


@router.get("/events/{slug}", response_model=PublicEventPublicResponse)
def get_event_by_slug(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return a published event by slug."""
    add_cache_header(response, 30)
    event = website_crud.get_public_event_by_slug(db, slug)
    if not event or event.status != "published":
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")
    return event


@router.post("/events/{event_id}/register", response_model=EventRegistrationCreate)
def register_for_event(
    event_id: int,
    data: EventRegistrationCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Register for an event."""
    event = website_crud.get_public_event(db, event_id)
    if not event or event.status != "published":
        raise HTTPException(status_code=404, detail="Event not found")
    if not event.registration_open:
        raise HTTPException(status_code=400, detail="Registration is closed for this event")
    from datetime import datetime
    if event.event_date < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Event has already passed")
    
    registration = website_crud.create_event_registration(db, event_id, data)
    return registration


# ================== SUCCESS STORIES ==================
@router.get("/success-stories", response_model=List[SuccessStoryPublicResponse])
def get_success_stories(
    response: Response,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Return published success stories, optionally filtered by category."""
    add_cache_header(response, 30)
    return website_crud.get_success_stories(db, category=category, published_only=True)


# ================== BLOG POSTS ==================
@router.get("/blog", response_model=List[BlogPostPublicResponse])
def get_blog_posts(
    response: Response,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Return published blog posts, paginated."""
    add_cache_header(response, 30)
    posts = website_crud.get_blog_posts(db, published_only=True)
    return posts[skip:skip+limit]


@router.get("/blog/{slug}", response_model=BlogPostPublicResponse)
def get_blog_post_by_slug(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return a published blog post by slug."""
    add_cache_header(response, 30)
    post = website_crud.get_blog_post_by_slug(db, slug, published_only=True)
    if not post:
        raise HTTPException(status_code=404, detail=f"Blog post '{slug}' not found")
    return post


# ================== CERTIFICATES ==================
@router.get("/certificates/verify/{certificate_id}", response_model=CertificateVerifyResponse)
def verify_certificate(certificate_id: str, db: Session = Depends(get_db)):
    """Verify a certificate by its unique ID."""
    cert = website_crud.get_certificate_by_id(db, certificate_id)
    if not cert:
        return CertificateVerifyResponse(
            certificate_id=certificate_id,
            holder_name="",
            program="",
            verified=False
        )
    return CertificateVerifyResponse(
        certificate_id=cert.certificate_id,
        holder_name=cert.holder_name,
        program=cert.program,
        issued_on=cert.issued_on,
        verified=True
    )


# ================== STATIC PAGES ==================
@router.get("/pages/{slug}", response_model=StaticPagePublicResponse)
def get_static_page(slug: str, response: Response, db: Session = Depends(get_db)):
    """Return a static page by slug."""
    add_cache_header(response, 30)
    page = website_crud.get_static_page_by_slug(db, slug)
    if not page:
        raise HTTPException(status_code=404, detail=f"Page '{slug}' not found")
    return page


# ================== TEAM MEMBERS ==================
@router.get("/team", response_model=List[TeamMemberPublicResponse])
def get_team_members(response: Response, db: Session = Depends(get_db)):
    """Return published team members."""
    add_cache_header(response, 30)
    return website_crud.get_team_members(db, published_only=True)


# ================== JOB LISTINGS ==================
@router.get("/careers", response_model=List[JobListingPublicResponse])
def get_careers(response: Response, db: Session = Depends(get_db)):
    """Return open job listings."""
    add_cache_header(response, 30)
    return website_crud.get_job_listings(db, is_open=True)


# ================== FOOTER LINKS ==================
@router.get("/footer-links", response_model=List[FooterLinkPublicResponse])
def get_footer_links(response: Response, db: Session = Depends(get_db)):
    """Return active footer links grouped by label."""
    add_cache_header(response, 30)
    return website_crud.get_footer_links(db, active_only=True)