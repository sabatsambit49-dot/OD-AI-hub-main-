from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

# pyrefly: ignore [missing-import]
from app.database.session import get_db
from app.utils.auth_utils import require_role
from app.crud import session_crud, user_crud
from app.models.user import User
from app.models.session import SessionToken

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])

@router.get("/active", response_model=List[dict])
def list_active_sessions(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    """
    List all currently active logged-in user sessions.
    Only accessible by Admin.
    """
    sessions = session_crud.get_active_sessions(db)
    result = []
    for s in sessions:
        u = s.user
        result.append({
            "jti": s.jti,
            "user_id": s.user_id,
            "username": u.username if u else "Unknown",
            "email": u.email if u else "Unknown",
            "role": u.role if u else "viewer",
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "expires_at": s.expires_at.isoformat() if s.expires_at else None,
            "is_current_session": (s.user_id == current_user.id)
        })
    return result

@router.post("/revoke")
def revoke_user_session(
    payload: dict,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    """
    Revoke a specific session by jti (logs the user out immediately).
    Only accessible by Admin.
    """
    jti = payload.get("jti") or payload.get("session_id")
    if not jti:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="jti or session_id is required")
    
    success = session_crud.revoke_session(db, jti)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or already revoked"
        )
    return {"status": "success", "detail": "User session revoked successfully."}

@router.post("/revoke-all/{user_id}")
def revoke_all_sessions_for_user(
    user_id: int,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    """
    Revoke all active sessions for a specific user.
    """
    count = session_crud.revoke_all_user_sessions(db, user_id)
    return {"status": "success", "detail": f"Revoked {count} active session(s) for user."}

@router.get("/all", response_model=List[dict])
def list_all_users_with_status(
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    """
    List all registered users along with their online/active session status.
    """
    all_users = db.query(User).order_by(User.id.asc()).all()
    active_sessions = session_crud.get_active_sessions(db)
    active_user_ids = {s.user_id for s in active_sessions}
    
    result = []
    for u in all_users:
        result.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "is_online": u.id in active_user_ids,
            "active_sessions_count": sum(1 for s in active_sessions if s.user_id == u.id)
        })
    return result

@router.delete("/{user_id}")
def delete_user_account(
    user_id: int,
    current_user: User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    """
    Delete a user account and invalidate their sessions.
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own admin account while logged in."
        )
    # Revoke sessions first
    session_crud.revoke_all_user_sessions(db, user_id)
    success = user_crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"status": "success", "detail": "User account removed successfully."}
