import uuid
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database.session import get_db, SessionLocal
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
    user_id: Optional[int] = None,
    db: Optional[Session] = None
) -> str:
    jti = str(uuid.uuid4())
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access", "jti": jti})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    # Persist session record in DB for revocation tracking
    try:
        close_db = False
        if db is None:
            db = SessionLocal()
            close_db = True
        
        # If user_id wasn't provided, try to find user by username in data['sub']
        resolved_user_id = user_id
        if resolved_user_id is None and "sub" in data:
            db_user = db.query(User).filter(User.username == data["sub"]).first()
            if db_user:
                resolved_user_id = db_user.id
                
        if resolved_user_id is not None:
            from app.crud import session_crud
            session_crud.create_session(db, user_id=resolved_user_id, jti=jti, expires_at=expire)
        
        if close_db:
            db.close()
    except Exception as e:
        # Logging failure without blocking token generation
        import logging
        logging.getLogger("uvicorn.error").warning(f"Could not record session in DB: {e}")
        
    return encoded_jwt

def create_reset_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=30)  # 30 mins expiry
    to_encode = {"sub": email, "exp": expire, "type": "password_reset"}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        email: str = payload.get("sub")
        return email
    except JWTError:
        return None

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        jti: str = payload.get("jti")
        if username is None:
            return None
        if jti:
            from app.models.session import SessionToken
            token_obj = db.query(SessionToken).filter(SessionToken.jti == jti).first()
            if token_obj and (token_obj.revoked or token_obj.expires_at <= datetime.utcnow()):
                return None
    except JWTError:
        return None
    user = db.query(User).filter(User.username == username).first()
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        jti: str = payload.get("jti")
        if username is None:
            raise credentials_exception
        if jti:
            from app.models.session import SessionToken
            token_obj = db.query(SessionToken).filter(SessionToken.jti == jti).first()
            if token_obj and (token_obj.revoked or token_obj.expires_at <= datetime.utcnow()):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session has been revoked or expired. Please log in again.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def require_role(roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' is not authorized for this operation. Required: {roles}"
            )
        return current_user
    return role_checker
