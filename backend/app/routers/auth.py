from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token, LoginRequest, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest
from app.crud import user_crud
from app.utils.auth_utils import verify_password, create_access_token, get_current_user, create_reset_token, verify_reset_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_username(db, user_in.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username is already registered")
    
    db_email = user_crud.get_user_by_email(db, user_in.email)
    if db_email:
        raise HTTPException(status_code=400, detail="Email is already registered")
        
    user = user_crud.create_user(db, user_in)
    return user

@router.post("/login", response_model=Token)
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_username(db, login_req.username)
    if not user or not verify_password(login_req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        user_id=user.id,
        db=db
    )
    return Token(access_token=access_token, token_type="bearer", user=user)

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db, req.email)
    if not user:
        # Security best practice: don't expose email presence, but return clear notice
        raise HTTPException(status_code=404, detail="No registered account found with this email address")
    
    reset_token = create_reset_token(user.email)
    return ForgotPasswordResponse(
        message="Password reset request generated successfully.",
        reset_token=reset_token
    )

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(req.reset_token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired password reset token")
    
    user = user_crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_crud.update_user(db, user.id, user_crud.UserUpdate(password=req.new_password))
    return {"message": "Password reset successfully. You may now sign in with your new password."}

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user=Depends(get_current_user)):
    return current_user
