from typing import Optional
from sqlalchemy.orm import Session
from app.models.information_post import InformationPost
from app.schemas.information_post import InformationPostCreate, InformationPostUpdate

def get_information_post(db: Session, post_id: int):
    return db.query(InformationPost).filter(InformationPost.id == post_id).first()

def get_information_posts(db: Session, tag: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(InformationPost)
    if tag:
        query = query.filter(InformationPost.tag == tag)
    return query.order_by(InformationPost.posted_at.desc()).offset(skip).limit(limit).all()

def create_information_post(db: Session, post_in: InformationPostCreate):
    db_post = InformationPost(
        title=post_in.title,
        tag=post_in.tag,
        body=post_in.body
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_information_post(db: Session, post_id: int, post_in: InformationPostUpdate):
    db_post = get_information_post(db, post_id)
    if db_post:
        if post_in.title is not None:
            db_post.title = post_in.title
        if post_in.tag is not None:
            db_post.tag = post_in.tag
        if post_in.body is not None:
            db_post.body = post_in.body
        db.commit()
        db.refresh(db_post)
    return db_post

def delete_information_post(db: Session, post_id: int):
    db_post = get_information_post(db, post_id)
    if db_post:
        db.delete(db_post)
        db.commit()
        return True
    return False
