import html
import io
import csv
import re
from decimal import Decimal
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.models.academy_category import AcademyCategory
from app.models.course import Course
from app.models.enquiry import Enquiry
from app.models.stat import Stat
from app.models.testimonial import Testimonial
from app.models.faq import Faq
from app.schemas.academy import (
    AcademyCategoryCreate, AcademyCategoryUpdate,
    AcademyCourseCreate, AcademyCourseUpdate,
    EnquiryCreate, EnquiryStatusUpdate,
    StatCreate, StatUpdate,
    TestimonialCreate, TestimonialUpdate,
    FaqCreate, FaqUpdate
)

def sanitize_text(text: Optional[str]) -> Optional[str]:
    """Escape HTML entities in user input to prevent XSS."""
    if text is None:
        return None
    return html.escape(text.strip())

def format_price_display(price: Optional[Decimal], is_free: bool = False, currency: str = "INR") -> str:
    if is_free or price is None or price <= 0:
        return "Free"
    symbol = "₹" if currency == "INR" else f"{currency} "
    # Format with Indian grouping if applicable, or standard comma grouping
    num_str = f"{int(price):,}" if price % 1 == 0 else f"{price:,.2f}"
    return f"{symbol}{num_str}"

def generate_slug(text: str) -> str:
    slug = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', slug)


# ------------------ CATEGORIES ------------------
def get_categories(db: Session, active_only: bool = False) -> List[AcademyCategory]:
    query = db.query(AcademyCategory)
    if active_only:
        query = query.filter(AcademyCategory.is_active == True)
    return query.order_by(AcademyCategory.display_order.asc(), AcademyCategory.id.asc()).all()

def get_category_by_slug(db: Session, slug: str) -> Optional[AcademyCategory]:
    return db.query(AcademyCategory).filter(AcademyCategory.slug == slug).first()

def get_category(db: Session, category_id: int) -> Optional[AcademyCategory]:
    return db.query(AcademyCategory).filter(AcademyCategory.id == category_id).first()

def create_category(db: Session, data: AcademyCategoryCreate) -> AcademyCategory:
    cat = AcademyCategory(
        name=sanitize_text(data.name),
        slug=data.slug.strip().lower(),
        tagline=sanitize_text(data.tagline),
        description=sanitize_text(data.description),
        accent_color=data.accent_color.strip(),
        icon_letter=data.icon_letter.strip().upper(),
        image_url=data.image_url,
        display_order=data.display_order,
        is_active=data.is_active
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

def update_category(db: Session, category_id: int, data: AcademyCategoryUpdate) -> Optional[AcademyCategory]:
    cat = get_category(db, category_id)
    if not cat:
        return None
    for field, val in data.dict(exclude_unset=True).items():
        if field in ("name", "tagline", "description"):
            val = sanitize_text(val)
        elif field == "slug" and val:
            val = val.strip().lower()
        setattr(cat, field, val)
    db.commit()
    db.refresh(cat)
    return cat

def delete_category(db: Session, category_id: int) -> bool:
    cat = get_category(db, category_id)
    if not cat:
        return False
    db.delete(cat)
    db.commit()
    return True


# ------------------ COURSES ------------------
def get_academy_courses(
    db: Session,
    category_id: Optional[int] = None,
    category_slug: Optional[str] = None,
    status: Optional[str] = None,
    mode: Optional[str] = None,
    group_label: Optional[str] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    published_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    sort_by: str = "display_order"
) -> List[Course]:
    query = db.query(Course)
    
    if published_only:
        query = query.filter(Course.status == "published")
    elif status:
        query = query.filter(Course.status == status)

    if category_id:
        query = query.filter(Course.category_id == category_id)
    elif category_slug:
        cat = get_category_by_slug(db, category_slug)
        if cat:
            query = query.filter(Course.category_id == cat.id)
        else:
            return []

    if mode and mode != "All":
        query = query.filter(Course.mode == mode.lower())

    if group_label and group_label != "All":
        query = query.filter(Course.group_label == group_label)

    if is_featured is not None:
        query = query.filter(Course.is_featured == is_featured)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Course.title.ilike(s),
                Course.name.ilike(s),
                Course.short_description.ilike(s),
                Course.target_audience.ilike(s),
                Course.group_label.ilike(s)
            )
        )

    if sort_by == "price_asc":
        query = query.order_by(Course.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Course.price.desc())
    elif sort_by == "newest":
        query = query.order_by(Course.created_at.desc())
    else:
        query = query.order_by(Course.display_order.asc(), Course.id.asc())

    return query.offset(skip).limit(limit).all()

def get_course_by_slug(db: Session, slug: str, published_only: bool = False) -> Optional[Course]:
    query = db.query(Course).filter(Course.slug == slug)
    if published_only:
        query = query.filter(Course.status == "published")
    return query.first()

def get_course(db: Session, course_id: int) -> Optional[Course]:
    return db.query(Course).filter(Course.id == course_id).first()

def create_academy_course(db: Session, data: AcademyCourseCreate) -> Course:
    title = sanitize_text(data.title)
    course = Course(
        title=title,
        name=title,
        slug=data.slug.strip().lower(),
        category_id=data.category_id,
        group_label=sanitize_text(data.group_label),
        target_audience=sanitize_text(data.target_audience),
        duration_value=data.duration_value,
        duration_unit=data.duration_unit,
        mode=data.mode.lower(),
        price=data.price,
        discount_price=data.discount_price,
        currency=data.currency or "INR",
        is_free=data.is_free,
        batch_size=data.batch_size,
        short_description=sanitize_text(data.short_description),
        description=sanitize_text(data.short_description),
        full_description=sanitize_text(data.full_description),
        highlights=[sanitize_text(h) for h in (data.highlights or [])],
        prerequisites=sanitize_text(data.prerequisites),
        start_date=data.start_date,
        certificate_included=data.certificate_included,
        image_url=data.image_url,
        is_featured=data.is_featured,
        status=data.status.lower(),
        display_order=data.display_order
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def update_academy_course(db: Session, course_id: int, data: AcademyCourseUpdate) -> Optional[Course]:
    course = get_course(db, course_id)
    if not course:
        return None

    update_dict = data.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if field == "title":
            val = sanitize_text(val)
            course.title = val
            course.name = val
        elif field in ("group_label", "target_audience", "short_description", "full_description", "prerequisites"):
            val = sanitize_text(val)
            setattr(course, field, val)
            if field == "short_description":
                course.description = val
        elif field == "slug" and val:
            course.slug = val.strip().lower()
        elif field == "highlights" and val is not None:
            course.highlights = [sanitize_text(h) for h in val]
        else:
            setattr(course, field, val)

    db.commit()
    db.refresh(course)
    return course

def duplicate_academy_course(db: Session, course_id: int) -> Optional[Course]:
    orig = get_course(db, course_id)
    if not orig:
        return None

    new_title = f"{orig.title or orig.name} (Copy)"
    base_slug = f"{(orig.slug or 'course')}-copy"
    new_slug = base_slug
    counter = 1
    while db.query(Course).filter(Course.slug == new_slug).first():
        new_slug = f"{base_slug}-{counter}"
        counter += 1

    dup = Course(
        title=new_title,
        name=new_title,
        slug=new_slug,
        category_id=orig.category_id,
        group_label=orig.group_label,
        target_audience=orig.target_audience,
        duration_value=orig.duration_value,
        duration_unit=orig.duration_unit,
        mode=orig.mode,
        price=orig.price,
        discount_price=orig.discount_price,
        currency=orig.currency,
        is_free=orig.is_free,
        batch_size=orig.batch_size,
        short_description=orig.short_description,
        description=orig.description,
        full_description=orig.full_description,
        highlights=list(orig.highlights or []),
        prerequisites=orig.prerequisites,
        start_date=orig.start_date,
        certificate_included=orig.certificate_included,
        image_url=orig.image_url,
        is_featured=orig.is_featured,
        status="draft",  # Always duplicated as draft
        display_order=(orig.display_order or 0) + 1
    )
    db.add(dup)
    db.commit()
    db.refresh(dup)
    return dup

def delete_course(db: Session, course_id: int) -> bool:
    course = get_course(db, course_id)
    if not course:
        return False
    db.delete(course)
    db.commit()
    return True


# ------------------ ENQUIRIES ------------------
def create_enquiry(db: Session, data: EnquiryCreate) -> Enquiry:
    enquiry = Enquiry(
        name=sanitize_text(data.name),
        phone=sanitize_text(data.phone),
        email=sanitize_text(data.email),
        class_or_degree=sanitize_text(data.class_or_degree),
        message=sanitize_text(data.message),
        course_id=data.course_id,
        status="new"
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry

def get_enquiries(db: Session, status: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Enquiry]:
    query = db.query(Enquiry)
    if status and status != "all":
        query = query.filter(Enquiry.status == status.lower())
    return query.order_by(Enquiry.created_at.desc()).offset(skip).limit(limit).all()

def get_enquiry(db: Session, enquiry_id: int) -> Optional[Enquiry]:
    return db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

def update_enquiry_status(db: Session, enquiry_id: int, status: str) -> Optional[Enquiry]:
    enq = get_enquiry(db, enquiry_id)
    if not enq:
        return None
    enq.status = status.lower()
    db.commit()
    db.refresh(enq)
    return enq

def export_enquiries_csv(db: Session, status: Optional[str] = None) -> str:
    enquiries = get_enquiries(db, status=status, limit=5000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Phone", "Email", "Class / Degree", "Course Title", "Message", "Status", "Date"])
    for e in enquiries:
        course_title = e.course.title if e.course else "General"
        writer.writerow([
            e.id,
            e.name,
            e.phone,
            e.email or "",
            e.class_or_degree or "",
            course_title,
            e.message or "",
            e.status,
            e.created_at.strftime("%Y-%m-%d %H:%M") if e.created_at else ""
        ])
    return output.getvalue()


# ------------------ STATS, TESTIMONIALS, FAQS ------------------
def get_stats(db: Session, active_only: bool = False) -> List[Stat]:
    q = db.query(Stat)
    if active_only:
        q = q.filter(Stat.is_active == True)
    return q.order_by(Stat.display_order.asc(), Stat.id.asc()).all()

def create_stat(db: Session, data: StatCreate) -> Stat:
    stat = Stat(label=sanitize_text(data.label), value=data.value, suffix=data.suffix, display_order=data.display_order, is_active=data.is_active)
    db.add(stat)
    db.commit()
    db.refresh(stat)
    return stat

def update_stat(db: Session, stat_id: int, data: StatUpdate) -> Optional[Stat]:
    s = db.query(Stat).filter(Stat.id == stat_id).first()
    if not s:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        if k == "label": v = sanitize_text(v)
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s

def delete_stat(db: Session, stat_id: int) -> bool:
    s = db.query(Stat).filter(Stat.id == stat_id).first()
    if not s: return False
    db.delete(s)
    db.commit()
    return True

def get_testimonials(db: Session, active_only: bool = False) -> List[Testimonial]:
    q = db.query(Testimonial)
    if active_only:
        q = q.filter(Testimonial.is_active == True)
    return q.order_by(Testimonial.display_order.asc(), Testimonial.id.asc()).all()

def create_testimonial(db: Session, data: TestimonialCreate) -> Testimonial:
    t = Testimonial(
        name=sanitize_text(data.name),
        role_or_degree=sanitize_text(data.role_or_degree),
        quote=sanitize_text(data.quote),
        rating=data.rating,
        avatar_url=data.avatar_url,
        display_order=data.display_order,
        is_active=data.is_active
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

def update_testimonial(db: Session, t_id: int, data: TestimonialUpdate) -> Optional[Testimonial]:
    t = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if not t: return None
    for k, v in data.dict(exclude_unset=True).items():
        if k in ("name", "role_or_degree", "quote"): v = sanitize_text(v)
        setattr(t, k, v)
    db.commit()
    db.refresh(t)
    return t

def delete_testimonial(db: Session, t_id: int) -> bool:
    t = db.query(Testimonial).filter(Testimonial.id == t_id).first()
    if not t: return False
    db.delete(t)
    db.commit()
    return True

def get_faqs(db: Session, active_only: bool = False) -> List[Faq]:
    q = db.query(Faq)
    if active_only:
        q = q.filter(Faq.is_active == True)
    return q.order_by(Faq.display_order.asc(), Faq.id.asc()).all()

def create_faq(db: Session, data: FaqCreate) -> Faq:
    f = Faq(
        question=sanitize_text(data.question),
        answer=sanitize_text(data.answer),
        category=sanitize_text(data.category),
        display_order=data.display_order,
        is_active=data.is_active
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    return f

def update_faq(db: Session, faq_id: int, data: FaqUpdate) -> Optional[Faq]:
    f = db.query(Faq).filter(Faq.id == faq_id).first()
    if not f: return None
    for k, v in data.dict(exclude_unset=True).items():
        if k in ("question", "answer", "category"): v = sanitize_text(v)
        setattr(f, k, v)
    db.commit()
    db.refresh(f)
    return f

def delete_faq(db: Session, faq_id: int) -> bool:
    f = db.query(Faq).filter(Faq.id == faq_id).first()
    if not f: return False
    db.delete(f)
    db.commit()
    return True
