from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, validator
from decimal import Decimal

# ----------------- ACADEMY CATEGORIES -----------------
class AcademyCategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=100)
    tagline: Optional[str] = None
    description: Optional[str] = None
    accent_color: str = Field("#0082ff", max_length=50)
    icon_letter: str = Field("A", max_length=10)
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class AcademyCategoryCreate(AcademyCategoryBase):
    pass

class AcademyCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    accent_color: Optional[str] = None
    icon_letter: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class AcademyCategoryResponse(AcademyCategoryBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ----------------- ACADEMY COURSES -----------------
class AcademyCourseBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=250)
    slug: str = Field(..., min_length=2, max_length=200)
    category_id: Optional[int] = None
    group_label: Optional[str] = None
    target_audience: str = Field(..., min_length=1, description="Who the course is for")
    duration_value: int = Field(..., ge=1, description="How long it takes")
    duration_unit: str = Field("weeks", description="weeks, months, or hours")
    mode: str = Field("online", description="online, offline, or hybrid")
    price: Decimal = Field(Decimal("0.00"), ge=Decimal("0.00"), description="Regular course price")
    discount_price: Optional[Decimal] = Field(None, ge=Decimal("0.00"), description="Discounted price")
    currency: str = Field("INR", max_length=10)
    is_free: bool = False
    batch_size: Optional[int] = Field(None, ge=1, description="Batch size or seats")
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    highlights: Optional[List[str]] = []
    prerequisites: Optional[str] = None
    start_date: Optional[datetime] = None
    certificate_included: bool = True
    image_url: Optional[str] = None
    is_featured: bool = False
    status: str = Field("draft", description="draft, published, or archived")
    display_order: int = 0

    @validator("discount_price")
    def validate_discount(cls, v, values):
        if v is not None:
            price = values.get("price")
            if price is not None and v >= price:
                raise ValueError("Discount price must be strictly less than the regular price")
        return v

    @validator("mode")
    def validate_mode(cls, v):
        allowed = {"online", "offline", "hybrid"}
        if v.lower() not in allowed:
            raise ValueError(f"Mode must be one of {allowed}")
        return v.lower()

    @validator("status")
    def validate_status(cls, v):
        allowed = {"draft", "published", "archived"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()

class AcademyCourseCreate(AcademyCourseBase):
    pass

class AcademyCourseUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[int] = None
    group_label: Optional[str] = None
    target_audience: Optional[str] = None
    duration_value: Optional[int] = Field(None, ge=1)
    duration_unit: Optional[str] = None
    mode: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=Decimal("0.00"))
    discount_price: Optional[Decimal] = Field(None, ge=Decimal("0.00"))
    currency: Optional[str] = None
    is_free: Optional[bool] = None
    batch_size: Optional[int] = Field(None, ge=1)
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    highlights: Optional[List[str]] = None
    prerequisites: Optional[str] = None
    start_date: Optional[datetime] = None
    certificate_included: Optional[bool] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None
    display_order: Optional[int] = None

    @validator("discount_price")
    def validate_discount(cls, v, values):
        if v is not None and "price" in values and values["price"] is not None:
            if v >= values["price"]:
                raise ValueError("Discount price must be strictly less than regular price")
        return v

class AcademyCourseResponse(AcademyCourseBase):
    id: int
    name: Optional[str] = None
    price_display: str = ""
    discount_display: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    category: Optional[AcademyCategoryResponse] = None

    class Config:
        from_attributes = True

class AcademyCoursePublicResponse(BaseModel):
    id: int
    title: str
    slug: str
    category_id: Optional[int] = None
    category_slug: Optional[str] = None
    category_name: Optional[str] = None
    category_accent: Optional[str] = None
    group_label: Optional[str] = None
    target_audience: Optional[str] = None
    duration_value: Optional[int] = None
    duration_unit: Optional[str] = None
    duration_formatted: str = ""
    mode: str
    price: float
    discount_price: Optional[float] = None
    price_display: str
    discount_display: Optional[str] = None
    currency: str
    is_free: bool
    batch_size: Optional[int] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    highlights: List[str] = []
    prerequisites: Optional[str] = None
    start_date: Optional[datetime] = None
    certificate_included: bool
    image_url: Optional[str] = None
    is_featured: bool
    status: str
    display_order: int

    class Config:
        from_attributes = True


# ----------------- ENQUIRIES -----------------
class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[str] = None
    class_or_degree: Optional[str] = None
    message: Optional[str] = None
    course_id: Optional[int] = None
    honeypot: Optional[str] = Field(None, description="Anti-spam honeypot field - must be left empty")

class EnquiryStatusUpdate(BaseModel):
    status: str = Field(..., description="new, contacted, or closed")

    @validator("status")
    def validate_status(cls, v):
        allowed = {"new", "contacted", "closed"}
        if v.lower() not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v.lower()

class EnquiryResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    class_or_degree: Optional[str] = None
    message: Optional[str] = None
    course_id: Optional[int] = None
    course_title: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ----------------- STATS, TESTIMONIALS, FAQS -----------------
class StatBase(BaseModel):
    label: str
    value: int
    suffix: Optional[str] = ""
    display_order: int = 0
    is_active: bool = True

class StatCreate(StatBase):
    pass

class StatUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[int] = None
    suffix: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class StatResponse(StatBase):
    id: int
    class Config:
        from_attributes = True


class TestimonialBase(BaseModel):
    name: str
    role_or_degree: str
    quote: str
    rating: int = 5
    avatar_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role_or_degree: Optional[str] = None
    quote: Optional[str] = None
    rating: Optional[int] = None
    avatar_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class TestimonialResponse(TestimonialBase):
    id: int
    class Config:
        from_attributes = True


class FaqBase(BaseModel):
    question: str
    answer: str
    category: str = "general"
    display_order: int = 0
    is_active: bool = True

class FaqCreate(FaqBase):
    pass

class FaqUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class FaqResponse(FaqBase):
    id: int
    class Config:
        from_attributes = True
