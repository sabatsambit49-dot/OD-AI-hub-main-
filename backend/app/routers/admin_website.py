from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.utils.auth_utils import require_role
from app.crud import website_crud
from app.schemas.website import (
    PillarCreate, PillarUpdate, PillarResponse,
    PillarSectionCreate, PillarSectionUpdate, PillarSectionResponse,
    OfferingCreate, OfferingUpdate, OfferingResponse,
    InstitutionAudienceCreate, InstitutionAudienceUpdate, InstitutionAudienceResponse,
    PublicEventCreate, PublicEventUpdate, PublicEventResponse,
    EventRegistrationCreate, EventRegistrationResponse,
    SuccessStoryCreate, SuccessStoryUpdate, SuccessStoryResponse,
    BlogPostCreate, BlogPostUpdate, BlogPostResponse,
    CertificateCreate, CertificateUpdate, CertificateResponse,
    StaticPageCreate, StaticPageUpdate, StaticPageResponse,
    TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse,
    JobListingCreate, JobListingUpdate, JobListingResponse,
    FooterLinkCreate, FooterLinkUpdate, FooterLinkResponse,
    NavbarItemCreate, NavbarItemUpdate, NavbarItemResponse
)

router = APIRouter(prefix="/admin/website", tags=["Admin - Website Content Management"])


# ================== PILLARS ==================
@router.get("/pillars", response_model=List[PillarResponse])
def admin_list_pillars(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_pillars(db, status=status)


@router.get("/pillars/{id}", response_model=PillarResponse)
def admin_get_pillar(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    pillar = website_crud.get_pillar(db, id)
    if not pillar:
        raise HTTPException(status_code=404, detail="Pillar not found")
    return pillar


@router.post("/pillars", response_model=PillarResponse, status_code=status.HTTP_201_CREATED)
def admin_create_pillar(
    data: PillarCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_pillar_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="A pillar with this slug already exists")
    return website_crud.create_pillar(db, data)


@router.put("/pillars/{id}", response_model=PillarResponse)
def admin_update_pillar(
    id: int,
    data: PillarUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    pillar = website_crud.update_pillar(db, id, data)
    if not pillar:
        raise HTTPException(status_code=404, detail="Pillar not found")
    return pillar


@router.delete("/pillars/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_pillar(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_pillar(db, id):
        raise HTTPException(status_code=404, detail="Pillar not found")
    return None


# ================== PILLAR SECTIONS ==================
@router.get("/pillar-sections", response_model=List[PillarSectionResponse])
def admin_list_pillar_sections(
    pillar_id: Optional[int] = None,
    audience_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_pillar_sections(db, pillar_id=pillar_id, audience_id=audience_id, status=status)


@router.get("/pillar-sections/{id}", response_model=PillarSectionResponse)
def admin_get_pillar_section(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    section = website_crud.get_pillar_section(db, id)
    if not section:
        raise HTTPException(status_code=404, detail="Pillar section not found")
    return section


@router.post("/pillar-sections", response_model=PillarSectionResponse, status_code=status.HTTP_201_CREATED)
def admin_create_pillar_section(
    data: PillarSectionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_pillar_section_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="A section with this slug already exists")
    return website_crud.create_pillar_section(db, data)


@router.put("/pillar-sections/{id}", response_model=PillarSectionResponse)
def admin_update_pillar_section(
    id: int,
    data: PillarSectionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    section = website_crud.update_pillar_section(db, id, data)
    if not section:
        raise HTTPException(status_code=404, detail="Pillar section not found")
    return section


@router.delete("/pillar-sections/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_pillar_section(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_pillar_section(db, id):
        raise HTTPException(status_code=404, detail="Pillar section not found")
    return None


# ================== OFFERINGS ==================
@router.get("/offerings", response_model=List[OfferingResponse])
def admin_list_offerings(
    section_id: Optional[int] = None,
    status: Optional[str] = None,
    featured_only: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_offerings(db, section_id=section_id, status=status, featured_only=featured_only)


@router.get("/offerings/{id}", response_model=OfferingResponse)
def admin_get_offering(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    offering = website_crud.get_offering(db, id)
    if not offering:
        raise HTTPException(status_code=404, detail="Offering not found")
    return offering


@router.post("/offerings", response_model=OfferingResponse, status_code=status.HTTP_201_CREATED)
def admin_create_offering(
    data: OfferingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.create_offering(db, data)


@router.put("/offerings/{id}", response_model=OfferingResponse)
def admin_update_offering(
    id: int,
    data: OfferingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    offering = website_crud.update_offering(db, id, data)
    if not offering:
        raise HTTPException(status_code=404, detail="Offering not found")
    return offering


@router.delete("/offerings/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_offering(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_offering(db, id):
        raise HTTPException(status_code=404, detail="Offering not found")
    return None


# ================== INSTITUTION AUDIENCES ==================
@router.get("/institution-audiences", response_model=List[InstitutionAudienceResponse])
def admin_list_institution_audiences(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_institution_audiences(db)


@router.get("/institution-audiences/{id}", response_model=InstitutionAudienceResponse)
def admin_get_institution_audience(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    audience = website_crud.get_institution_audience(db, id)
    if not audience:
        raise HTTPException(status_code=404, detail="Institution audience not found")
    return audience


@router.post("/institution-audiences", response_model=InstitutionAudienceResponse, status_code=status.HTTP_201_CREATED)
def admin_create_institution_audience(
    data: InstitutionAudienceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_institution_audience_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="An audience with this slug already exists")
    return website_crud.create_institution_audience(db, data)


@router.put("/institution-audiences/{id}", response_model=InstitutionAudienceResponse)
def admin_update_institution_audience(
    id: int,
    data: InstitutionAudienceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    audience = website_crud.update_institution_audience(db, id, data)
    if not audience:
        raise HTTPException(status_code=404, detail="Institution audience not found")
    return audience


@router.delete("/institution-audiences/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_institution_audience(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_institution_audience(db, id):
        raise HTTPException(status_code=404, detail="Institution audience not found")
    return None


# ================== PUBLIC EVENTS ==================
@router.get("/events", response_model=List[PublicEventResponse])
def admin_list_events(
    event_type: Optional[str] = None,
    status: Optional[str] = None,
    upcoming_only: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    events = website_crud.get_public_events(db, event_type=event_type, status=status, upcoming_only=upcoming_only)
    result = []
    for e in events:
        resp = PublicEventResponse.from_orm(e)
        resp.registration_count = len(e.registrations) if e.registrations else 0
        result.append(resp)
    return result


@router.get("/events/{id}", response_model=PublicEventResponse)
def admin_get_event(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    event = website_crud.get_public_event(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    resp = PublicEventResponse.from_orm(event)
    resp.registration_count = len(event.registrations) if event.registrations else 0
    return resp


@router.post("/events", response_model=PublicEventResponse, status_code=status.HTTP_201_CREATED)
def admin_create_event(
    data: PublicEventCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_public_event_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="An event with this slug already exists")
    event = website_crud.create_public_event(db, data)
    resp = PublicEventResponse.from_orm(event)
    resp.registration_count = 0
    return resp


@router.put("/events/{id}", response_model=PublicEventResponse)
def admin_update_event(
    id: int,
    data: PublicEventUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    event = website_crud.update_public_event(db, id, data)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    resp = PublicEventResponse.from_orm(event)
    resp.registration_count = len(event.registrations) if event.registrations else 0
    return resp


@router.delete("/events/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_event(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_public_event(db, id):
        raise HTTPException(status_code=404, detail="Event not found")
    return None


# ================== EVENT REGISTRATIONS ==================
@router.get("/event-registrations", response_model=List[EventRegistrationResponse])
def admin_list_event_registrations(
    event_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    registrations = website_crud.get_event_registrations(db, event_id=event_id, status=status, skip=skip, limit=limit)
    result = []
    for r in registrations:
        resp = EventRegistrationResponse.from_orm(r)
        resp.event_title = r.event.title if r.event else "Unknown"
        resp.event_type = r.event.type if r.event else "Unknown"
        resp.event_date = r.event.event_date if r.event else None
        result.append(resp)
    return result


@router.get("/event-registrations/export/csv")
def admin_export_event_registrations_csv(
    event_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    csv_data = website_crud.export_event_registrations_csv(db, event_id=event_id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=event_registrations_export.csv"}
    )


# ================== SUCCESS STORIES ==================
@router.get("/success-stories", response_model=List[SuccessStoryResponse])
def admin_list_success_stories(
    category: Optional[str] = None,
    published_only: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_success_stories(db, category=category, published_only=published_only)


@router.get("/success-stories/{id}", response_model=SuccessStoryResponse)
def admin_get_success_story(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    story = website_crud.get_success_story(db, id)
    if not story:
        raise HTTPException(status_code=404, detail="Success story not found")
    return story


@router.post("/success-stories", response_model=SuccessStoryResponse, status_code=status.HTTP_201_CREATED)
def admin_create_success_story(
    data: SuccessStoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.create_success_story(db, data)


@router.put("/success-stories/{id}", response_model=SuccessStoryResponse)
def admin_update_success_story(
    id: int,
    data: SuccessStoryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    story = website_crud.update_success_story(db, id, data)
    if not story:
        raise HTTPException(status_code=404, detail="Success story not found")
    return story


@router.delete("/success-stories/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_success_story(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_success_story(db, id):
        raise HTTPException(status_code=404, detail="Success story not found")
    return None


# ================== BLOG POSTS ==================
@router.get("/blog-posts", response_model=List[BlogPostResponse])
def admin_list_blog_posts(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_blog_posts(db, status=status)


@router.get("/blog-posts/{id}", response_model=BlogPostResponse)
def admin_get_blog_post(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    post = website_crud.get_blog_post(db, id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.post("/blog-posts", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def admin_create_blog_post(
    data: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_blog_post_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="A blog post with this slug already exists")
    return website_crud.create_blog_post(db, data)


@router.put("/blog-posts/{id}", response_model=BlogPostResponse)
def admin_update_blog_post(
    id: int,
    data: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    post = website_crud.update_blog_post(db, id, data)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.delete("/blog-posts/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_blog_post(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_blog_post(db, id):
        raise HTTPException(status_code=404, detail="Blog post not found")
    return None


# ================== CERTIFICATES ==================
@router.get("/certificates", response_model=List[CertificateResponse])
def admin_list_certificates(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_certificates(db)


@router.get("/certificates/{id}", response_model=CertificateResponse)
def admin_get_certificate(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    cert = website_crud.get_certificate(db, id)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert


@router.post("/certificates", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def admin_create_certificate(
    data: CertificateCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_certificate_by_id(db, data.certificate_id)
    if existing:
        raise HTTPException(status_code=400, detail="A certificate with this ID already exists")
    return website_crud.create_certificate(db, data)


@router.put("/certificates/{id}", response_model=CertificateResponse)
def admin_update_certificate(
    id: int,
    data: CertificateUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    cert = website_crud.update_certificate(db, id, data)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert


@router.delete("/certificates/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_certificate(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_certificate(db, id):
        raise HTTPException(status_code=404, detail="Certificate not found")
    return None


# ================== STATIC PAGES ==================
@router.get("/static-pages", response_model=List[StaticPageResponse])
def admin_list_static_pages(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_static_pages(db)


@router.get("/static-pages/{id}", response_model=StaticPageResponse)
def admin_get_static_page(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    page = website_crud.get_static_page(db, id)
    if not page:
        raise HTTPException(status_code=404, detail="Static page not found")
    return page


@router.post("/static-pages", response_model=StaticPageResponse, status_code=status.HTTP_201_CREATED)
def admin_create_static_page(
    data: StaticPageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    existing = website_crud.get_static_page_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="A page with this slug already exists")
    return website_crud.create_static_page(db, data)


@router.put("/static-pages/{id}", response_model=StaticPageResponse)
def admin_update_static_page(
    id: int,
    data: StaticPageUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    page = website_crud.update_static_page(db, id, data)
    if not page:
        raise HTTPException(status_code=404, detail="Static page not found")
    return page


@router.delete("/static-pages/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_static_page(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_static_page(db, id):
        raise HTTPException(status_code=404, detail="Static page not found")
    return None


# ================== TEAM MEMBERS ==================
@router.get("/team-members", response_model=List[TeamMemberResponse])
def admin_list_team_members(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_team_members(db, status=status)


@router.get("/team-members/{id}", response_model=TeamMemberResponse)
def admin_get_team_member(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    member = website_crud.get_team_member(db, id)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@router.post("/team-members", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def admin_create_team_member(
    data: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.create_team_member(db, data)


@router.put("/team-members/{id}", response_model=TeamMemberResponse)
def admin_update_team_member(
    id: int,
    data: TeamMemberUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    member = website_crud.update_team_member(db, id, data)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member


@router.delete("/team-members/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_team_member(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_team_member(db, id):
        raise HTTPException(status_code=404, detail="Team member not found")
    return None


# ================== JOB LISTINGS ==================
@router.get("/job-listings", response_model=List[JobListingResponse])
def admin_list_job_listings(
    is_open: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_job_listings(db, is_open=is_open)


@router.get("/job-listings/{id}", response_model=JobListingResponse)
def admin_get_job_listing(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    job = website_crud.get_job_listing(db, id)
    if not job:
        raise HTTPException(status_code=404, detail="Job listing not found")
    return job


@router.post("/job-listings", response_model=JobListingResponse, status_code=status.HTTP_201_CREATED)
def admin_create_job_listing(
    data: JobListingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.create_job_listing(db, data)


@router.put("/job-listings/{id}", response_model=JobListingResponse)
def admin_update_job_listing(
    id: int,
    data: JobListingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    job = website_crud.update_job_listing(db, id, data)
    if not job:
        raise HTTPException(status_code=404, detail="Job listing not found")
    return job


@router.delete("/job-listings/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_job_listing(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_job_listing(db, id):
        raise HTTPException(status_code=404, detail="Job listing not found")
    return None


# ================== FOOTER LINKS ==================
@router.get("/footer-links", response_model=List[FooterLinkResponse])
def admin_list_footer_links(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_footer_links(db)


@router.get("/footer-links/{id}", response_model=FooterLinkResponse)
def admin_get_footer_link(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    link = website_crud.get_footer_link(db, id)
    if not link:
        raise HTTPException(status_code=404, detail="Footer link not found")
    return link


@router.post("/footer-links", response_model=FooterLinkResponse, status_code=status.HTTP_201_CREATED)
def admin_create_footer_link(
    data: FooterLinkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.create_footer_link(db, data)


@router.put("/footer-links/{id}", response_model=FooterLinkResponse)
def admin_update_footer_link(
    id: int,
    data: FooterLinkUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    link = website_crud.update_footer_link(db, id, data)
    if not link:
        raise HTTPException(status_code=404, detail="Footer link not found")
    return link


@router.delete("/footer-links/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_footer_link(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_footer_link(db, id):
        raise HTTPException(status_code=404, detail="Footer link not found")
    return None


# ================== NAVBAR ITEMS ==================
@router.get("/navbar-items", response_model=List[NavbarItemResponse])
def admin_list_navbar_items(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.get_navbar_items(db)


@router.get("/navbar-items/{id}", response_model=NavbarItemResponse)
def admin_get_navbar_item(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    item = website_crud.get_navbar_item(db, id)
    if not item:
        raise HTTPException(status_code=404, detail="Navbar item not found")
    return item


@router.post("/navbar-items", response_model=NavbarItemResponse, status_code=status.HTTP_201_CREATED)
def admin_create_navbar_item(
    data: NavbarItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    return website_crud.create_navbar_item(db, data)


@router.put("/navbar-items/{id}", response_model=NavbarItemResponse)
def admin_update_navbar_item(
    id: int,
    data: NavbarItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    item = website_crud.update_navbar_item(db, id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Navbar item not found")
    return item


@router.delete("/navbar-items/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_navbar_item(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    if not website_crud.delete_navbar_item(db, id):
        raise HTTPException(status_code=404, detail="Navbar item not found")
    return None