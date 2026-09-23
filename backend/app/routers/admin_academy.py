from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.utils.auth_utils import require_role
from app.crud import academy_crud
from app.schemas.academy import (
    AcademyCategoryCreate, AcademyCategoryUpdate, AcademyCategoryResponse,
    AcademyCourseCreate, AcademyCourseUpdate, AcademyCourseResponse,
    EnquiryResponse, EnquiryStatusUpdate,
    StatCreate, StatUpdate, StatResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    FaqCreate, FaqUpdate, FaqResponse
)

router = APIRouter(prefix="/admin/academy", tags=["Admin - OD AI Academy Management"])


# ===================== CATEGORIES =====================
@router.get("/categories", response_model=List[AcademyCategoryResponse])
def admin_list_categories(db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.get_categories(db, active_only=False)

@router.get("/categories/{id}", response_model=AcademyCategoryResponse)
def admin_get_category(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    cat = academy_crud.get_category(db, id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.post("/categories", response_model=AcademyCategoryResponse, status_code=status.HTTP_201_CREATED)
def admin_create_category(data: AcademyCategoryCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    existing = academy_crud.get_category_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="A category with this slug already exists")
    return academy_crud.create_category(db, data)

@router.put("/categories/{id}", response_model=AcademyCategoryResponse)
def admin_update_category(id: int, data: AcademyCategoryUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    cat = academy_crud.update_category(db, id, data)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.delete("/categories/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_category(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    if not academy_crud.delete_category(db, id):
        raise HTTPException(status_code=404, detail="Category not found")
    return None


# ===================== COURSES =====================
@router.get("/courses", response_model=List[AcademyCourseResponse])
def admin_list_courses(
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    mode: Optional[str] = None,
    search: Optional[str] = None,
    is_featured: Optional[bool] = None,
    sort_by: str = "display_order",
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    courses = academy_crud.get_academy_courses(
        db, category_id=category_id, status=status, mode=mode,
        search=search, is_featured=is_featured, sort_by=sort_by,
        skip=skip, limit=limit, published_only=False
    )
    result = []
    for c in courses:
        resp = AcademyCourseResponse.from_orm(c)
        resp.price_display = academy_crud.format_price_display(c.price, c.is_free, c.currency)
        if c.discount_price:
            resp.discount_display = academy_crud.format_price_display(c.discount_price, False, c.currency)
        result.append(resp)
    return result

@router.get("/courses/{id}", response_model=AcademyCourseResponse)
def admin_get_course(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    c = academy_crud.get_course(db, id)
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    resp = AcademyCourseResponse.from_orm(c)
    resp.price_display = academy_crud.format_price_display(c.price, c.is_free, c.currency)
    if c.discount_price:
        resp.discount_display = academy_crud.format_price_display(c.discount_price, False, c.currency)
    return resp

@router.post("/courses", response_model=AcademyCourseResponse, status_code=status.HTTP_201_CREATED)
def admin_create_course(data: AcademyCourseCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    existing = academy_crud.get_course_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="A course with this slug already exists")
    c = academy_crud.create_academy_course(db, data)
    resp = AcademyCourseResponse.from_orm(c)
    resp.price_display = academy_crud.format_price_display(c.price, c.is_free, c.currency)
    if c.discount_price:
        resp.discount_display = academy_crud.format_price_display(c.discount_price, False, c.currency)
    return resp

@router.put("/courses/{id}", response_model=AcademyCourseResponse)
def admin_update_course(id: int, data: AcademyCourseUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    c = academy_crud.update_academy_course(db, id, data)
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    resp = AcademyCourseResponse.from_orm(c)
    resp.price_display = academy_crud.format_price_display(c.price, c.is_free, c.currency)
    if c.discount_price:
        resp.discount_display = academy_crud.format_price_display(c.discount_price, False, c.currency)
    return resp

@router.post("/courses/{id}/duplicate", response_model=AcademyCourseResponse)
def admin_duplicate_course(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    dup = academy_crud.duplicate_academy_course(db, id)
    if not dup:
        raise HTTPException(status_code=404, detail="Course not found")
    resp = AcademyCourseResponse.from_orm(dup)
    resp.price_display = academy_crud.format_price_display(dup.price, dup.is_free, dup.currency)
    if dup.discount_price:
        resp.discount_display = academy_crud.format_price_display(dup.discount_price, False, dup.currency)
    return resp

@router.patch("/courses/{id}/status", response_model=AcademyCourseResponse)
def admin_set_course_status(id: int, status: str = Query(..., regex="^(draft|published|archived)$"), db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    update_data = AcademyCourseUpdate(status=status)
    c = academy_crud.update_academy_course(db, id, update_data)
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    resp = AcademyCourseResponse.from_orm(c)
    resp.price_display = academy_crud.format_price_display(c.price, c.is_free, c.currency)
    if c.discount_price:
        resp.discount_display = academy_crud.format_price_display(c.discount_price, False, c.currency)
    return resp

@router.patch("/courses/{id}/featured", response_model=AcademyCourseResponse)
def admin_toggle_course_featured(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    c = academy_crud.get_course(db, id)
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    update_data = AcademyCourseUpdate(is_featured=not c.is_featured)
    c = academy_crud.update_academy_course(db, id, update_data)
    resp = AcademyCourseResponse.from_orm(c)
    resp.price_display = academy_crud.format_price_display(c.price, c.is_free, c.currency)
    return resp

@router.delete("/courses/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_course(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    if not academy_crud.delete_course(db, id):
        raise HTTPException(status_code=404, detail="Course not found")
    return None


# ===================== ENQUIRIES =====================
@router.get("/enquiries", response_model=List[EnquiryResponse])
def admin_list_enquiries(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin", "editor"]))
):
    enquiries = academy_crud.get_enquiries(db, status=status, skip=skip, limit=limit)
    result = []
    for e in enquiries:
        res = EnquiryResponse.from_orm(e)
        if e.course:
            res.course_title = e.course.title or e.course.name
        result.append(res)
    return result

@router.get("/enquiries/{id}", response_model=EnquiryResponse)
def admin_get_enquiry(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    e = academy_crud.get_enquiry(db, id)
    if not e:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    res = EnquiryResponse.from_orm(e)
    if e.course:
        res.course_title = e.course.title or e.course.name
    return res

@router.patch("/enquiries/{id}/status", response_model=EnquiryResponse)
def admin_update_enquiry_status(id: int, data: EnquiryStatusUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    e = academy_crud.update_enquiry_status(db, id, data.status)
    if not e:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    res = EnquiryResponse.from_orm(e)
    if e.course:
        res.course_title = e.course.title or e.course.name
    return res

@router.get("/enquiries/export/csv")
def admin_export_enquiries_csv(status: Optional[str] = None, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    csv_data = academy_crud.export_enquiries_csv(db, status=status)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=enquiries_export.csv"}
    )


# ===================== STATS, TESTIMONIALS, FAQS =====================
@router.get("/stats", response_model=List[StatResponse])
def admin_list_stats(db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.get_stats(db, active_only=False)

@router.post("/stats", response_model=StatResponse, status_code=status.HTTP_201_CREATED)
def admin_create_stat(data: StatCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.create_stat(db, data)

@router.put("/stats/{id}", response_model=StatResponse)
def admin_update_stat(id: int, data: StatUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    s = academy_crud.update_stat(db, id, data)
    if not s: raise HTTPException(status_code=404, detail="Stat not found")
    return s

@router.delete("/stats/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_stat(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    if not academy_crud.delete_stat(db, id): raise HTTPException(status_code=404, detail="Stat not found")
    return None

@router.get("/testimonials", response_model=List[TestimonialResponse])
def admin_list_testimonials(db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.get_testimonials(db, active_only=False)

@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
def admin_create_testimonial(data: TestimonialCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.create_testimonial(db, data)

@router.put("/testimonials/{id}", response_model=TestimonialResponse)
def admin_update_testimonial(id: int, data: TestimonialUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    t = academy_crud.update_testimonial(db, id, data)
    if not t: raise HTTPException(status_code=404, detail="Testimonial not found")
    return t

@router.delete("/testimonials/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_testimonial(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    if not academy_crud.delete_testimonial(db, id): raise HTTPException(status_code=404, detail="Testimonial not found")
    return None

@router.get("/faqs", response_model=List[FaqResponse])
def admin_list_faqs(db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.get_faqs(db, active_only=False)

@router.post("/faqs", response_model=FaqResponse, status_code=status.HTTP_201_CREATED)
def admin_create_faq(data: FaqCreate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    return academy_crud.create_faq(db, data)

@router.put("/faqs/{id}", response_model=FaqResponse)
def admin_update_faq(id: int, data: FaqUpdate, db: Session = Depends(get_db), current_user=Depends(require_role(["admin", "editor"]))):
    f = academy_crud.update_faq(db, id, data)
    if not f: raise HTTPException(status_code=404, detail="FAQ not found")
    return f

@router.delete("/faqs/{id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_faq(id: int, db: Session = Depends(get_db), current_user=Depends(require_role(["admin"]))):
    if not academy_crud.delete_faq(db, id): raise HTTPException(status_code=404, detail="FAQ not found")
    return None
