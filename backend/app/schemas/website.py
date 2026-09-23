from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, validator


# ================== PILLARS ==================
class PillarBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=200)
    tagline: Optional[str] = None
    description: Optional[str] = None
    accent_color: str = Field("#0082ff", max_length=50)
    icon: Optional[str] = None
    hero_image_url: Optional[str] = None
    display_order: int = 0
    status: str = Field("draft", description="draft, published, archived")

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()

    @validator("slug")
    def validate_slug(cls, v):
        return v.strip().lower()


class PillarCreate(PillarBase):
    pass


class PillarUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    accent_color: Optional[str] = None
    icon: Optional[str] = None
    hero_image_url: Optional[str] = None
    display_order: Optional[int] = None
    status: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            allowed = {"draft", "published", "archived"}
            if v.lower() not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
            return v.lower()
        return v

    @validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            return v.strip().lower()
        return v


class PillarResponse(PillarBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PillarPublicResponse(BaseModel):
    id: int
    slug: str
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    accent_color: str
    icon: Optional[str] = None
    hero_image_url: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


# ================== PILLAR SECTIONS ==================
class PillarSectionBase(BaseModel):
    pillar_id: int
    audience_id: Optional[int] = None
    slug: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    accent_color: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    status: str = Field("draft", description="draft, published, archived")

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()

    @validator("slug")
    def validate_slug(cls, v):
        return v.strip().lower()


class PillarSectionCreate(PillarSectionBase):
    pass


class PillarSectionUpdate(BaseModel):
    pillar_id: Optional[int] = None
    audience_id: Optional[int] = None
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    accent_color: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    status: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            allowed = {"draft", "published", "archived"}
            if v.lower() not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
            return v.lower()
        return v

    @validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            return v.strip().lower()
        return v


class PillarSectionResponse(PillarSectionBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    pillar: Optional["PillarResponse"] = None
    audience: Optional["InstitutionAudienceResponse"] = None

    class Config:
        from_attributes = True


class PillarSectionPublicResponse(BaseModel):
    id: int
    slug: str
    title: str
    description: Optional[str] = None
    accent_color: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


# ================== OFFERINGS ==================
class OfferingBase(BaseModel):
    pillar_section_id: int
    title: str = Field(..., min_length=1, max_length=200)
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    highlights: Optional[List[str]] = []
    image_url: Optional[str] = None
    is_featured: bool = False
    display_order: int = 0
    status: str = Field("draft", description="draft, published, archived")

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()


class OfferingCreate(OfferingBase):
    pass


class OfferingUpdate(BaseModel):
    pillar_section_id: Optional[int] = None
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    highlights: Optional[List[str]] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    status: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            allowed = {"draft", "published", "archived"}
            if v.lower() not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
            return v.lower()
        return v


class OfferingResponse(OfferingBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    section: Optional[PillarSectionPublicResponse] = None

    class Config:
        from_attributes = True


class OfferingPublicResponse(BaseModel):
    id: int
    title: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    highlights: List[str] = []
    image_url: Optional[str] = None
    is_featured: bool
    display_order: int

    class Config:
        from_attributes = True


# ================== INSTITUTION AUDIENCES ==================
class InstitutionAudienceBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100)  # 'colleges', 'schools'
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

    @validator("slug")
    def validate_slug(cls, v):
        return v.strip().lower()


class InstitutionAudienceCreate(InstitutionAudienceBase):
    pass


class InstitutionAudienceUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

    @validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            return v.strip().lower()
        return v


class InstitutionAudienceResponse(InstitutionAudienceBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    sections: List[PillarSectionPublicResponse] = []

    class Config:
        from_attributes = True


class InstitutionAudiencePublicResponse(BaseModel):
    id: int
    slug: str
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int
    sections: List[PillarSectionPublicResponse] = []

    class Config:
        from_attributes = True


# ================== PUBLIC EVENTS ==================
class PublicEventBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=200)
    title: str = Field(..., min_length=1, max_length=200)
    type: str = Field(..., description="workshop, hackathon, demo_class, seminar")
    description: Optional[str] = None
    event_date: datetime
    mode: str = Field("online", description="online, offline, hybrid")
    location: Optional[str] = None
    registration_open: bool = True
    image_url: Optional[str] = None
    status: str = Field("draft", description="draft, published, archived")
    display_order: int = 0

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()

    @validator("mode")
    def validate_mode(cls, v):
        allowed = {"online", "offline", "hybrid"}
        if v.lower() not in allowed:
            raise ValueError(f"Mode must be one of {allowed}")
        return v.lower()

    @validator("type")
    def validate_type(cls, v):
        allowed = {"workshop", "hackathon", "demo_class", "seminar"}
        if v.lower() not in allowed:
            raise ValueError(f"Type must be one of {allowed}")
        return v.lower()

    @validator("slug")
    def validate_slug(cls, v):
        return v.strip().lower()


class PublicEventCreate(PublicEventBase):
    pass


class PublicEventUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    mode: Optional[str] = None
    location: Optional[str] = None
    registration_open: Optional[bool] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    display_order: Optional[int] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            allowed = {"draft", "published", "archived"}
            if v.lower() not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
            return v.lower()
        return v

    @validator("mode")
    def validate_mode(cls, v):
        if v is not None:
            allowed = {"online", "offline", "hybrid"}
            if v.lower() not in allowed:
                raise ValueError(f"Mode must be one of {allowed}")
            return v.lower()
        return v

    @validator("type")
    def validate_type(cls, v):
        if v is not None:
            allowed = {"workshop", "hackathon", "demo_class", "seminar"}
            if v.lower() not in allowed:
                raise ValueError(f"Type must be one of {allowed}")
            return v.lower()
        return v

    @validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            return v.strip().lower()
        return v


class PublicEventResponse(PublicEventBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    registration_count: int = 0

    class Config:
        from_attributes = True


class PublicEventPublicResponse(BaseModel):
    id: int
    slug: str
    title: str
    type: str
    description: Optional[str] = None
    event_date: datetime
    mode: str
    location: Optional[str] = None
    registration_open: bool
    image_url: Optional[str] = None
    status: str
    display_order: int

    class Config:
        from_attributes = True


# ================== EVENT REGISTRATIONS ==================
class EventRegistrationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[str] = None
    organization: Optional[str] = None


class EventRegistrationResponse(BaseModel):
    id: int
    event_id: int
    name: str
    phone: str
    email: Optional[str] = None
    organization: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    event_title: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# ================== SUCCESS STORIES ==================
class SuccessStoryBase(BaseModel):
    category: str = Field(..., description="student, startup, business, institution")
    name: str = Field(..., min_length=1, max_length=200)
    role_or_organization: Optional[str] = None
    photo_url: Optional[str] = None
    quote: str = Field(..., min_length=1)
    outcome: Optional[str] = None
    is_published: bool = False
    display_order: int = 0

    @validator("category")
    def validate_category(cls, v):
        allowed = {"student", "startup", "business", "institution"}
        if v.lower() not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v.lower()


class SuccessStoryCreate(SuccessStoryBase):
    pass


class SuccessStoryUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    role_or_organization: Optional[str] = None
    photo_url: Optional[str] = None
    quote: Optional[str] = None
    outcome: Optional[str] = None
    is_published: Optional[bool] = None
    display_order: Optional[int] = None

    @validator("category")
    def validate_category(cls, v):
        if v is not None:
            allowed = {"student", "startup", "business", "institution"}
            if v.lower() not in allowed:
                raise ValueError(f"Category must be one of {allowed}")
            return v.lower()
        return v


class SuccessStoryResponse(SuccessStoryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SuccessStoryPublicResponse(BaseModel):
    id: int
    category: str
    name: str
    role_or_organization: Optional[str] = None
    photo_url: Optional[str] = None
    quote: str
    outcome: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


# ================== BLOG POSTS ==================
class BlogPostBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=200)
    title: str = Field(..., min_length=1, max_length=300)
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover_image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: str = Field("draft", description="draft, published, archived")
    display_order: int = 0

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()

    @validator("slug")
    def validate_slug(cls, v):
        return v.strip().lower()


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover_image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: Optional[str] = None
    display_order: Optional[int] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            allowed = {"draft", "published", "archived"}
            if v.lower() not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
            return v.lower()
        return v

    @validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            return v.strip().lower()
        return v


class BlogPostResponse(BlogPostBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BlogPostPublicResponse(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: Optional[str] = None
    body: Optional[str] = None
    cover_image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: str
    display_order: int

    class Config:
        from_attributes = True


# ================== CERTIFICATES ==================
class CertificateBase(BaseModel):
    certificate_id: str = Field(..., min_length=1, max_length=100)
    holder_name: str = Field(..., min_length=1, max_length=200)
    program: str = Field(..., min_length=1, max_length=300)
    issued_on: Optional[datetime] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    certificate_id: Optional[str] = None
    holder_name: Optional[str] = None
    program: Optional[str] = None
    issued_on: Optional[datetime] = None


class CertificateResponse(CertificateBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CertificateVerifyResponse(BaseModel):
    certificate_id: str
    holder_name: str
    program: str
    issued_on: Optional[datetime] = None
    verified: bool = True


# ================== STATIC PAGES ==================
class StaticPageBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=300)
    body_blocks: Optional[List[Any]] = []

    @validator("slug")
    def validate_slug(cls, v):
        return v.strip().lower()


class StaticPageCreate(StaticPageBase):
    pass


class StaticPageUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    body_blocks: Optional[List[Any]] = None

    @validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            return v.strip().lower()
        return v


class StaticPageResponse(StaticPageBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StaticPagePublicResponse(BaseModel):
    id: int
    slug: str
    title: str
    body_blocks: List[Any] = []

    class Config:
        from_attributes = True


# ================== TEAM MEMBERS ==================
class TeamMemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=200)
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    display_order: int = 0
    status: str = Field("draft", description="draft, published, archived")

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    display_order: Optional[int] = None
    status: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        if v is not None:
            allowed = {"draft", "published", "archived"}
            if v.lower() not in allowed:
                raise ValueError(f"Status must be one of {allowed}")
            return v.lower()
        return v


class TeamMemberResponse(TeamMemberBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TeamMemberPublicResponse(BaseModel):
    id: int
    name: str
    role: str
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True


# ================== JOB LISTINGS ==================
class JobListingBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    department: Optional[str] = None
    location: Optional[str] = None
    type: str = Field("full-time", description="full-time, part-time, contract, internship")
    description: Optional[str] = None
    is_open: bool = True
    display_order: int = 0

    @validator("type")
    def validate_type(cls, v):
        allowed = {"full-time", "part-time", "contract", "internship"}
        if v.lower() not in allowed:
            raise ValueError(f"Type must be one of {allowed}")
        return v.lower()


class JobListingCreate(JobListingBase):
    pass


class JobListingUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    is_open: Optional[bool] = None
    display_order: Optional[int] = None

    @validator("type")
    def validate_type(cls, v):
        if v is not None:
            allowed = {"full-time", "part-time", "contract", "internship"}
            if v.lower() not in allowed:
                raise ValueError(f"Type must be one of {allowed}")
            return v.lower()
        return v


class JobListingResponse(JobListingBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobListingPublicResponse(BaseModel):
    id: int
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    type: str
    description: Optional[str] = None
    is_open: bool
    display_order: int

    class Config:
        from_attributes = True


# ================== FOOTER LINKS ==================
class FooterLinkBase(BaseModel):
    group_label: str = Field(..., min_length=1, max_length=100)
    label: str = Field(..., min_length=1, max_length=200)
    url: str = Field(..., min_length=1, max_length=500)
    display_order: int = 0
    is_active: bool = True


class FooterLinkCreate(FooterLinkBase):
    pass


class FooterLinkUpdate(BaseModel):
    group_label: Optional[str] = None
    label: Optional[str] = None
    url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class FooterLinkResponse(FooterLinkBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FooterLinkPublicResponse(BaseModel):
    id: int
    group_label: str
    label: str
    url: str
    display_order: int

    class Config:
        from_attributes = True


# ================== NAVBAR ITEMS ==================
class NavbarItemBase(BaseModel):
    pillar_id: Optional[int] = None
    label: str = Field(..., min_length=1, max_length=200)
    url: str = Field(..., min_length=1, max_length=500)
    display_order: int = 0
    is_visible: bool = True


class NavbarItemCreate(NavbarItemBase):
    pass


class NavbarItemUpdate(BaseModel):
    pillar_id: Optional[int] = None
    label: Optional[str] = None
    url: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class NavbarItemResponse(NavbarItemBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    pillar: Optional[PillarPublicResponse] = None

    class Config:
        from_attributes = True


# Forward references
PillarSectionResponse.model_rebuild()
InstitutionAudienceResponse.model_rebuild()