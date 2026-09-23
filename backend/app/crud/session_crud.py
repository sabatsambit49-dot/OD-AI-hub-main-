from datetime import datetime, timedelta
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.session import SessionToken

def create_session(db: Session, user_id: int, jti: Optional[str] = None, expires_at: Optional[datetime] = None) -> SessionToken:
    if not jti:
        jti = str(uuid.uuid4())
    if not expires_at:
        expires_at = datetime.utcnow() + timedelta(hours=24)
    
    session_token = SessionToken(
        jti=jti,
        user_id=user_id,
        created_at=datetime.utcnow(),
        expires_at=expires_at,
        revoked=False
    )
    db.add(session_token)
    db.commit()
    db.refresh(session_token)
    return session_token

def get_active_sessions(db: Session) -> List[SessionToken]:
    now = datetime.utcnow()
    return (
        db.query(SessionToken)
        .options(joinedload(SessionToken.user))
        .filter(SessionToken.revoked == False, SessionToken.expires_at > now)
        .order_by(SessionToken.created_at.desc())
        .all()
    )

def is_session_active(db: Session, jti: str) -> bool:
    now = datetime.utcnow()
    token = db.query(SessionToken).filter(SessionToken.jti == jti).first()
    if not token:
        return False
    if token.revoked or token.expires_at <= now:
        return False
    return True

def revoke_session(db: Session, jti: str) -> bool:
    token = db.query(SessionToken).filter(SessionToken.jti == jti).first()
    if token and not token.revoked:
        token.revoked = True
        db.commit()
        return True
    return False

def revoke_all_user_sessions(db: Session, user_id: int) -> int:
    tokens = db.query(SessionToken).filter(SessionToken.user_id == user_id, SessionToken.revoked == False).all()
    count = len(tokens)
    for t in tokens:
        t.revoked = True
    db.commit()
    return count
