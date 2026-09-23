import html
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc, func
from app.models import (
    Pillar, PillarSection, Offering, InstitutionAudience,
    PublicEvent, EventRegistration, SuccessStory, BlogPost,
    Certificate, StaticPage, TeamMember, JobListing, FooterLink, NavbarItem
)
from app.schemas.website import (
    PillarCreate, PillarUpdate,
    PillarSectionCreate, PillarSectionUpdate,
    OfferingCreate, OfferingUpdate,
    InstitutionAudienceCreate, InstitutionAudienceUpdate,
    PublicEventCreate, PublicEventUpdate,
    EventRegistrationCreate,
    SuccessStoryCreate, SuccessStoryUpdate,
    BlogPostCreate, BlogPostUpdate,
    CertificateCreate, CertificateUpdate,
    StaticPageCreate, StaticPageUpdate,
    TeamMemberCreate, TeamMemberUpdate,
    JobListingCreate, JobListingUpdate,
    FooterLinkCreate, FooterLinkUpdate,
    NavbarItemCreate, NavbarItemUpdate
)


def sanitize_text(text: Optional[str]) -> Optional[str]:
    """Escape HTML entities in user input to prevent XSS."""
    if text is None:
        return None
    return html.escape(text.strip())


# ================== PILLARS ==================
def get_pillars(db: Session, status: Optional[str] = None, active_only: bool = False) -> List[Pillar]:
    query = db.query(Pillar)
    if active_only:
        query = query.filter(Pillar.status == "published")
    elif status:
        query = query.filter(Pillar.status == status)
    return query.order_by(Pillar.display_order.asc(), Pillar.id.asc()).all()


def get_pillar(db: Session, pillar_id: int) -> Optional[Pillar]:
    return db.query(Pillar).filter(Pillar.id == pillar_id).first()


def get_pillar_by_slug(db: Session, slug: str) -> Optional[Pillar]:
    return db.query(Pillar).filter(Pillar.slug == slug).first()


def create_pillar(db: Session, data: PillarCreate) -> Pillar:
    pillar = Pillar(
        slug=sanitize_text(data.slug),
        name=sanitize_text(data.name),
        tagline=sanitize_text(data.tagline),
        description=sanitize_text(data.description),
        accent_color=data.accent_color.strip(),
        icon=data.icon.strip() if data.icon else None,
        image_url=data.image_url,
        display_order=data.display_order,
        status=data.status.lower()
    )
    db.add(pillar)
    db.commit()
    db.refresh(pillar)
    return pillar


def update_pillar(db: Session, pillar_id: int, data: PillarUpdate) -> Optional[Pillar]:
    pillar = get_pillar(db, pillar_id)
    if not pillar:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("name", "tagline", "description"):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        elif field == "icon" and val:
            val = val.strip()
        setattr(pillar, field, val)
    db.commit()
    db.refresh(pillar)
    return pillar


def delete_pillar(db: Session, pillar_id: int) -> bool:
    pillar = get_pillar(db, pillar_id)
    if not pillar:
        return False
    db.delete(pillar)
    db.commit()
    return True


# ================== PILLAR SECTIONS ==================
def get_pillar_sections(
    db: Session,
    pillar_id: Optional[int] = None,
    audience_id: Optional[int] = None,
    status: Optional[str] = None,
    active_only: bool = False
) -> List[PillarSection]:
    query = db.query(PillarSection)
    if active_only:
        query = query.filter(PillarSection.status == "published")
    elif status:
        query = query.filter(PillarSection.status == status)
    if pillar_id:
        query = query.filter(PillarSection.pillar_id == pillar_id)
    if audience_id:
        query = query.filter(PillarSection.audience_id == audience_id)
    return query.order_by(PillarSection.display_order.asc(), PillarSection.id.asc()).all()


def get_pillar_section(db: Session, section_id: int) -> Optional[PillarSection]:
    return db.query(PillarSection).filter(PillarSection.id == section_id).first()


def get_pillar_section_by_slug(db: Session, slug: str) -> Optional[PillarSection]:
    return db.query(PillarSection).filter(PillarSection.slug == slug).first()


def create_pillar_section(db: Session, data: PillarSectionCreate) -> PillarSection:
    section = PillarSection(
        pillar_id=data.pillar_id,
        audience_id=data.audience_id,
        slug=sanitize_text(data.slug),
        title=sanitize_text(data.title),
        description=sanitize_text(data.description),
        accent_color=data.accent_color.strip() if data.accent_color else None,
        icon=data.icon.strip() if data.icon else None,
        image_url=data.image_url,
        display_order=data.display_order,
        status=data.status.lower()
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


def update_pillar_section(db: Session, section_id: int, data: PillarSectionUpdate) -> Optional[PillarSection]:
    section = get_pillar_section(db, section_id)
    if not section:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title", "description"):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        elif field in ("accent_color", "icon") and val:
            val = val.strip()
        setattr(section, field, val)
    db.commit()
    db.refresh(section)
    return section


def delete_pillar_section(db: Session, section_id: int) -> bool:
    section = get_pillar_section(db, section_id)
    if not section:
        return False
    db.delete(section)
    db.commit()
    return True


# ================== OFFERINGS ==================
def get_offerings(
    db: Session,
    section_id: Optional[int] = None,
    status: Optional[str] = None,
    featured_only: bool = False,
    active_only: bool = False
) -> List[Offering]:
    query = db.query(Offering)
    if active_only:
        query = query.filter(Offering.status == "published")
    elif status:
        query = query.filter(Offering.status == status)
    if section_id:
        query = query.filter(Offering.pillar_section_id == section_id)
    if featured_only:
        query = query.filter(Offering.is_featured == True)
    return query.order_by(Offering.display_order.asc(), Offering.id.asc()).all()


def get_offering(db: Session, offering_id: int) -> Optional[Offering]:
    return db.query(Offering).filter(Offering.id == offering_id).first()


def create_offering(db: Session, data: OfferingCreate) -> Offering:
    offering = Offering(
        pillar_section_id=data.pillar_section_id,
        title=sanitize_text(data.title),
        short_description=sanitize_text(data.short_description),
        full_description=sanitize_text(data.full_description),
        highlights=[sanitize_text(h) for h in (data.highlights or [])],
        image_url=data.image_url,
        is_featured=data.is_featured,
        display_order=data.display_order,
        status=data.status.lower()
    )
    db.add(offering)
    db.commit()
    db.refresh(offering)
    return offering


def update_offering(db: Session, offering_id: int, data: OfferingUpdate) -> Optional[Offering]:
    offering = get_offering(db, offering_id)
    if not offering:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title", "short_description", "full_description"):
            val = sanitize_text(val)
        elif field == "highlights" and val is not None:
            val = [sanitize_text(h) for h in val]
        setattr(offering, field, val)
    db.commit()
    db.refresh(offering)
    return offering


def delete_offering(db: Session, offering_id: int) -> bool:
    offering = get_offering(db, offering_id)
    if not offering:
        return False
    db.delete(offering)
    db.commit()
    return True


# ================== INSTITUTION AUDIENCES ==================
def get_institution_audiences(db: Session, active_only: bool = False) -> List[InstitutionAudience]:
    query = db.query(InstitutionAudience)
    if active_only:
        query = query.filter(InstitutionAudience.is_active == True)
    return query.order_by(InstitutionAudience.display_order.asc(), InstitutionAudience.id.asc()).all()


def get_institution_audience(db: Session, audience_id: int) -> Optional[InstitutionAudience]:
    return db.query(InstitutionAudience).filter(InstitutionAudience.id == audience_id).first()


def get_institution_audience_by_slug(db: Session, slug: str) -> Optional[InstitutionAudience]:
    return db.query(InstitutionAudience).filter(InstitutionAudience.slug == slug).first()


def create_institution_audience(db: Session, data: InstitutionAudienceCreate) -> InstitutionAudience:
    audience = InstitutionAudience(
        slug=sanitize_text(data.slug),
        title=sanitize_text(data.title),
        description=sanitize_text(data.description),
        image_url=data.image_url,
        display_order=data.display_order,
        is_active=data.is_active
    )
    db.add(audience)
    db.commit()
    db.refresh(audience)
    return audience


def update_institution_audience(db: Session, audience_id: int, data: InstitutionAudienceUpdate) -> Optional[InstitutionAudience]:
    audience = get_institution_audience(db, audience_id)
    if not audience:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title", "description"):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        setattr(audience, field, val)
    db.commit()
    db.refresh(audience)
    return audience


def delete_institution_audience(db: Session, audience_id: int) -> bool:
    audience = get_institution_audience(db, audience_id)
    if not audience:
        return False
    db.delete(audience)
    db.commit()
    return True


# ================== PUBLIC EVENTS ==================
def get_public_events(
    db: Session,
    event_type: Optional[str] = None,
    status: Optional[str] = None,
    upcoming_only: bool = False,
    active_only: bool = False
) -> List[PublicEvent]:
    query = db.query(PublicEvent)
    if active_only:
        query = query.filter(PublicEvent.status == "published")
    elif status:
        query = query.filter(PublicEvent.status == status)
    if event_type:
        query = query.filter(PublicEvent.type == event_type)
    if upcoming_only:
        from datetime import datetime
        query = query.filter(PublicEvent.event_date >= datetime.utcnow())
    return query.order_by(PublicEvent.display_order.asc(), PublicEvent.id.asc()).all()


def get_public_event(db: Session, event_id: int) -> Optional[PublicEvent]:
    return db.query(PublicEvent).filter(PublicEvent.id == event_id).first()


def get_public_event_by_slug(db: Session, slug: str) -> Optional[PublicEvent]:
    return db.query(PublicEvent).filter(PublicEvent.slug == slug).first()


def create_public_event(db: Session, data: PublicEventCreate) -> PublicEvent:
    event = PublicEvent(
        slug=sanitize_text(data.slug),
        title=sanitize_text(data.title),
        type=data.type.lower(),
        description=sanitize_text(data.description),
        event_date=data.event_date,
        mode=data.mode.lower(),
        location=sanitize_text(data.location),
        registration_open=data.registration_open,
        image_url=data.image_url,
        status=data.status.lower(),
        display_order=data.display_order
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def update_public_event(db: Session, event_id: int, data: PublicEventUpdate) -> Optional[PublicEvent]:
    event = get_public_event(db, event_id)
    if not event:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title", "description", "location"):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        elif field in ("type", "mode") and val:
            val = val.lower()
        setattr(event, field, val)
    db.commit()
    db.refresh(event)
    return event


def delete_public_event(db: Session, event_id: int) -> bool:
    event = get_public_event(db, event_id)
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True


# ================== EVENT REGISTRATIONS ==================
def create_event_registration(db: Session, event_id: int, data: EventRegistrationCreate) -> EventRegistration:
    registration = EventRegistration(
        event_id=event_id,
        name=sanitize_text(data.name),
        phone=sanitize_text(data.phone),
        email=sanitize_text(data.email) if data.email else None,
        organization=sanitize_text(data.organization) if data.organization else None,
        status="registered"
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration


def get_event_registrations(
    db: Session,
    event_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[EventRegistration]:
    query = db.query(EventRegistration)
    if event_id:
        query = query.filter(EventRegistration.event_id == event_id)
    if status:
        query = query.filter(EventRegistration.status == status)
    return query.order_by(EventRegistration.created_at.desc()).offset(skip).limit(limit).all()


def get_event_registration(db: Session, registration_id: int) -> Optional[EventRegistration]:
    return db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()


def update_event_registration_status(db: Session, registration_id: int, status: str) -> Optional[EventRegistration]:
    reg = get_event_registration(db, registration_id)
    if not reg:
        return None
    reg.status = status
    db.commit()
    db.refresh(reg)
    return reg


def export_event_registrations_csv(db: Session, event_id: Optional[int] = None) -> str:
    import io
    import csv
    registrations = get_event_registrations(db, event_id=event_id, limit=5000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Event Title", "Event Type", "Event Date", "Name", "Phone", "Email", "Organization", "Status", "Registered At"])
    for r in registrations:
        writer.writerow([
            r.id,
            r.event.title if r.event else "Unknown",
            r.event.type if r.event else "Unknown",
            r.event.event_date.strftime("%Y-%m-%d %H:%M") if r.event and r.event.event_date else "",
            r.name,
            r.phone,
            r.email or "",
            r.organization or "",
            r.status,
            r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else ""
        ])
    return output.getvalue()


# ================== SUCCESS STORIES ==================
def get_success_stories(
    db: Session,
    category: Optional[str] = None,
    published_only: bool = False
) -> List[SuccessStory]:
    query = db.query(SuccessStory)
    if published_only:
        query = query.filter(SuccessStory.is_published == True)
    if category:
        query = query.filter(SuccessStory.category == category)
    return query.order_by(SuccessStory.display_order.asc(), SuccessStory.id.asc()).all()


def get_success_story(db: Session, story_id: int) -> Optional[SuccessStory]:
    return db.query(SuccessStory).filter(SuccessStory.id == story_id).first()


def create_success_story(db: Session, data: SuccessStoryCreate) -> SuccessStory:
    story = SuccessStory(
        category=data.category.lower(),
        name=sanitize_text(data.name),
        role_or_organization=sanitize_text(data.role_or_organization),
        photo_url=data.photo_url,
        quote=sanitize_text(data.quote),
        outcome=sanitize_text(data.outcome),
        is_published=data.is_published,
        display_order=data.display_order
    )
    db.add(story)
    db.commit()
    db.refresh(story)
    return story


def update_success_story(db: Session, story_id: int, data: SuccessStoryUpdate) -> Optional[SuccessStory]:
    story = get_success_story(db, story_id)
    if not story:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("name", "role_or_organization", "quote", "outcome"):
            val = sanitize_text(val)
        elif field == "category" and val:
            val = val.lower()
        setattr(story, field, val)
    db.commit()
    db.refresh(story)
    return story


def delete_success_story(db: Session, story_id: int) -> bool:
    story = get_success_story(db, story_id)
    if not story:
        return False
    db.delete(story)
    db.commit()
    return True


# ================== BLOG POSTS ==================
def get_blog_posts(
    db: Session,
    status: Optional[str] = None,
    published_only: bool = False
) -> List[BlogPost]:
    query = db.query(BlogPost)
    if published_only:
        query = query.filter(BlogPost.status == "published")
    elif status:
        query = query.filter(BlogPost.status == status)
    return query.order_by(BlogPost.display_order.asc(), BlogPost.id.asc()).all()


def get_blog_post(db: Session, post_id: int) -> Optional[BlogPost]:
    return db.query(BlogPost).filter(BlogPost.id == post_id).first()


def get_blog_post_by_slug(db: Session, slug: str, published_only: bool = False) -> Optional[BlogPost]:
    query = db.query(BlogPost).filter(BlogPost.slug == slug)
    if published_only:
        query = query.filter(BlogPost.status == "published")
    return query.first()


def create_blog_post(db: Session, data: BlogPostCreate) -> BlogPost:
    post = BlogPost(
        slug=sanitize_text(data.slug),
        title=sanitize_text(data.title),
        excerpt=sanitize_text(data.excerpt),
        body=data.body,  # Don't sanitize body - may contain markdown/HTML
        cover_image_url=data.cover_image_url,
        published_at=data.published_at,
        status=data.status.lower(),
        display_order=data.display_order
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_blog_post(db: Session, post_id: int, data: BlogPostUpdate) -> Optional[BlogPost]:
    post = get_blog_post(db, post_id)
    if not post:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title", "excerpt"):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        setattr(post, field, val)
    db.commit()
    db.refresh(post)
    return post


def delete_blog_post(db: Session, post_id: int) -> bool:
    post = get_blog_post(db, post_id)
    if not post:
        return False
    db.delete(post)
    db.commit()
    return True


# ================== CERTIFICATES ==================
def get_certificates(db: Session) -> List[Certificate]:
    return db.query(Certificate).order_by(Certificate.issued_on.desc()).all()


def get_certificate(db: Session, cert_id: int) -> Optional[Certificate]:
    return db.query(Certificate).filter(Certificate.id == cert_id).first()


def get_certificate_by_id(db: Session, certificate_id: str) -> Optional[Certificate]:
    return db.query(Certificate).filter(Certificate.certificate_id == certificate_id).first()


def create_certificate(db: Session, data: CertificateCreate) -> Certificate:
    cert = Certificate(
        certificate_id=sanitize_text(data.certificate_id),
        holder_name=sanitize_text(data.holder_name),
        program=sanitize_text(data.program),
        issued_on=data.issued_on
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def update_certificate(db: Session, cert_id: int, data: CertificateUpdate) -> Optional[Certificate]:
    cert = get_certificate(db, cert_id)
    if not cert:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("certificate_id", "holder_name", "program"):
            val = sanitize_text(val)
        setattr(cert, field, val)
    db.commit()
    db.refresh(cert)
    return cert


def delete_certificate(db: Session, cert_id: int) -> bool:
    cert = get_certificate(db, cert_id)
    if not cert:
        return False
    db.delete(cert)
    db.commit()
    return True


# ================== STATIC PAGES ==================
def get_static_pages(db: Session) -> List[StaticPage]:
    return db.query(StaticPage).order_by(StaticPage.slug.asc()).all()


def get_static_page(db: Session, page_id: int) -> Optional[StaticPage]:
    return db.query(StaticPage).filter(StaticPage.id == page_id).first()


def get_static_page_by_slug(db: Session, slug: str) -> Optional[StaticPage]:
    return db.query(StaticPage).filter(StaticPage.slug == slug).first()


def create_static_page(db: Session, data: StaticPageCreate) -> StaticPage:
    page = StaticPage(
        slug=sanitize_text(data.slug),
        title=sanitize_text(data.title),
        body_blocks=data.body_blocks
    )
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


def update_static_page(db: Session, page_id: int, data: StaticPageUpdate) -> Optional[StaticPage]:
    page = get_static_page(db, page_id)
    if not page:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title",):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        setattr(page, field, val)
    db.commit()
    db.refresh(page)
    return page


def delete_static_page(db: Session, page_id: int) -> bool:
    page = get_static_page(db, page_id)
    if not page:
        return False
    db.delete(page)
    db.commit()
    return True


# ================== TEAM MEMBERS ==================
def get_team_members(db: Session, status: Optional[str] = None, published_only: bool = False) -> List[TeamMember]:
    query = db.query(TeamMember)
    if published_only:
        query = query.filter(TeamMember.status == "published")
    elif status:
        query = query.filter(TeamMember.status == status)
    return query.order_by(TeamMember.display_order.asc(), TeamMember.id.asc()).all()


def get_team_member(db: Session, member_id: int) -> Optional[TeamMember]:
    return db.query(TeamMember).filter(TeamMember.id == member_id).first()


def create_team_member(db: Session, data: TeamMemberCreate) -> TeamMember:
    member = TeamMember(
        name=sanitize_text(data.name),
        role=sanitize_text(data.role),
        photo_url=data.photo_url,
        bio=sanitize_text(data.bio),
        display_order=data.display_order,
        status=data.status.lower()
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def update_team_member(db: Session, member_id: int, data: TeamMemberUpdate) -> Optional[TeamMember]:
    member = get_team_member(db, member_id)
    if not member:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("name", "role", "bio"):
            val = sanitize_text(val)
        elif field == "status" and val:
            val = val.lower()
        setattr(member, field, val)
    db.commit()
    db.refresh(member)
    return member


def delete_team_member(db: Session, member_id: int) -> bool:
    member = get_team_member(db, member_id)
    if not member:
        return False
    db.delete(member)
    db.commit()
    return True


# ================== JOB LISTINGS ==================
def get_job_listings(db: Session, is_open: Optional[bool] = None) -> List[JobListing]:
    query = db.query(JobListing)
    if is_open is not None:
        query = query.filter(JobListing.is_open == is_open)
    return query.order_by(JobListing.display_order.asc(), JobListing.id.asc()).all()


def get_job_listing(db: Session, job_id: int) -> Optional[JobListing]:
    return db.query(JobListing).filter(JobListing.id == job_id).first()


def create_job_listing(db: Session, data: JobListingCreate) -> JobListing:
    job = JobListing(
        title=sanitize_text(data.title),
        department=sanitize_text(data.department),
        location=sanitize_text(data.location),
        type=data.type.lower(),
        description=sanitize_text(data.description),
        is_open=data.is_open,
        display_order=data.display_order
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def update_job_listing(db: Session, job_id: int, data: JobListingUpdate) -> Optional[JobListing]:
    job = get_job_listing(db, job_id)
    if not job:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("title", "department", "location", "description"):
            val = sanitize_text(val)
        elif field == "type" and val:
            val = val.lower()
        setattr(job, field, val)
    db.commit()
    db.refresh(job)
    return job


def delete_job_listing(db: Session, job_id: int) -> bool:
    job = get_job_listing(db, job_id)
    if not job:
        return False
    db.delete(job)
    db.commit()
    return True


# ================== FOOTER LINKS ==================
def get_footer_links(db: Session, active_only: bool = False) -> List[FooterLink]:
    query = db.query(FooterLink)
    if active_only:
        query = query.filter(FooterLink.is_active == True)
    return query.order_by(FooterLink.group_label.asc(), FooterLink.display_order.asc(), FooterLink.id.asc()).all()


def get_footer_link(db: Session, link_id: int) -> Optional[FooterLink]:
    return db.query(FooterLink).filter(FooterLink.id == link_id).first()


def create_footer_link(db: Session, data: FooterLinkCreate) -> FooterLink:
    link = FooterLink(
        group_label=sanitize_text(data.group_label),
        label=sanitize_text(data.label),
        url=data.url,
        display_order=data.display_order,
        is_active=data.is_active
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def update_footer_link(db: Session, link_id: int, data: FooterLinkUpdate) -> Optional[FooterLink]:
    link = get_footer_link(db, link_id)
    if not link:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field in ("group_label", "label"):
            val = sanitize_text(val)
        setattr(link, field, val)
    db.commit()
    db.refresh(link)
    return link


def delete_footer_link(db: Session, link_id: int) -> bool:
    link = get_footer_link(db, link_id)
    if not link:
        return False
    db.delete(link)
    db.commit()
    return True


# ================== NAVBAR ITEMS ==================
def get_navbar_items(db: Session, visible_only: bool = False) -> List[NavbarItem]:
    query = db.query(NavbarItem)
    if visible_only:
        query = query.filter(NavbarItem.is_visible == True)
    return query.order_by(NavbarItem.display_order.asc(), NavbarItem.id.asc()).all()


def get_navbar_item(db: Session, item_id: int) -> Optional[NavbarItem]:
    return db.query(NavbarItem).filter(NavbarItem.id == item_id).first()


def create_navbar_item(db: Session, data: NavbarItemCreate) -> NavbarItem:
    item = NavbarItem(
        pillar_id=data.pillar_id,
        label=sanitize_text(data.label),
        url=data.url,
        display_order=data.display_order,
        is_visible=data.is_visible
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_navbar_item(db: Session, item_id: int, data: NavbarItemUpdate) -> Optional[NavbarItem]:
    item = get_navbar_item(db, item_id)
    if not item:
        return None
    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field == "label":
            val = sanitize_text(val)
        setattr(item, field, val)
    db.commit()
    db.refresh(item)
    return item


def delete_navbar_item(db: Session, item_id: int) -> bool:
    item = get_navbar_item(db, item_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True